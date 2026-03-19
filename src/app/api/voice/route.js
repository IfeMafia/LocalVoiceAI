import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { generateGoogleSpeech } from '@/lib/ai/utils/googleTts';
import { detectLanguageGemini } from '@/lib/ai/utils/language';
import { trackUsage } from '@/lib/tracking';

// Import the existing chat handler to prevent logic duplication
import { POST as handleChatGenerate } from '@/app/api/assistant/chat/route';

async function transcribeAudio(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    // Groq's high-speed Whisper model
    formData.append("model", "whisper-large-v3-turbo"); 

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq STT Error Object:", errText);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Groq STT Error:', error);
    throw new Error('Speech-to-Text conversion failed');
  }
}

async function generateChatResponse(conversationId, transcript) {
  // 1. Save transcript as a customer message first
  await db.query(
    'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3)',
    [conversationId, 'customer', transcript]
  );

  // 2. Wrap conversationId in a fake Request to reuse the exact chat logic endpoint
  const mockReq = new Request('http://localhost/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId }),
  });

  // 3. Call the handler natively
  const chatRes = await handleChatGenerate(mockReq);
  const chatData = await chatRes.json();

  if (!chatData.success || !chatData.message) {
    throw new Error(chatData.error || 'Failed to generate chat response from AI');
  }

  // AI response is safely stored in DB already by handleChatGenerate
  return {
    text: chatData.message.content,
    language: chatData.language || 'english'
  };
}

// Removed generateSpeech (MsEdgeTTS) -> delegated to generateGoogleSpeech in src/lib/ai/utils/googleTts.js

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio');
    const conversationId = formData.get('conversationId');
    const role = formData.get('role'); // Added: Role of the sender ('customer' or 'owner')

    if (!audioBlob || !conversationId) {
      return NextResponse.json({ success: false, error: 'Audio file and conversation ID are required' }, { status: 400 });
    }

    const convRes = await db.query('SELECT business_id FROM conversations WHERE id = $1', [conversationId]);
    const businessId = convRes.rows[0]?.business_id;

    // 1. Convert Audio to Text (using Groq Whisper)
    const sttStartTime = Date.now();
    const transcript = await transcribeAudio(audioBlob);
    const sttDurationSeconds = Math.round((Date.now() - sttStartTime) / 1000) || 1;
    
    if (businessId) {
      await trackUsage({
        businessId,
        type: 'stt',
        tokensUsed: null,
        duration: sttDurationSeconds,
        costEstimate: sttDurationSeconds * 0.0001 // ~$0.006 per min
      });
    }
    if (!transcript.trim()) {
      return NextResponse.json({ success: false, error: 'Could not transcribe any speech' }, { status: 400 });
    }

    console.log(`[VOICE] Role: ${role}, Transcribed: "${transcript}"`);

    // 2. Chat Processing (Ensures scope, context, DB logging)
    let aiResponseText = null;
    let detectedLanguage = 'english';
    
    // ONLY generate AI response if it's a CUSTOMER speaking
    if (role !== 'owner') {
      // 2a. Detect Language early for voice flow early rejection
      detectedLanguage = await detectLanguageGemini(transcript);
      console.log(`[VOICE] Detected Language: ${detectedLanguage}`);

      if (detectedLanguage === 'unsupported') {
        aiResponseText = "Sorry, this language is not supported. Please use English, Yoruba, Hausa, or Igbo.";
        detectedLanguage = 'english'; // Default to English for the rejection audio
        
        // Save the customer message and AI rejection to DB
        await db.query(
          'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3)',
          [conversationId, 'customer', transcript]
        );
        await db.query(
          'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3)',
          [conversationId, 'ai', aiResponseText]
        );
      } else {
        const chatResponse = await generateChatResponse(conversationId, transcript);
        aiResponseText = chatResponse.text;
        detectedLanguage = chatResponse.language;
        console.log(`[VOICE] AI Response (${detectedLanguage}): "${aiResponseText}"`);
      }
    } else {
      // If it's the owner, just save the message to DB and don't trigger AI
      await db.query(
        'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3)',
        [conversationId, 'owner', transcript]
      );
    }

    // 3. Convert Text to Speech (using Google Cloud TTS) - Only if we have an AI response
    let audioUrl = null;
    if (aiResponseText) {
      const ttsStartTime = Date.now();
      // Requirement 4 & 5: Google Cloud Generation
      audioUrl = await generateGoogleSpeech(aiResponseText, detectedLanguage);
      const ttsDurationSeconds = Math.round((Date.now() - ttsStartTime) / 1000) || 1;
      
      if (businessId) {
        await trackUsage({
          businessId,
          type: 'tts',
          tokensUsed: aiResponseText.length, // track characters as tokens for Google TTS
          duration: ttsDurationSeconds,
          costEstimate: aiResponseText.length * 0.000016 // GCP Text-to-Speech config pricing estimate
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      text: transcript,
      aiText: aiResponseText,
      audioUrl 
    });

  } catch (error) {
    console.error('Voice Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { url } = await req.json();
    if (!url || !url.startsWith('/temp_voice/')) {
      return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
    }

    const fileName = url.replace('/temp_voice/', '');
    const filePath = path.join(process.cwd(), 'public', 'temp_voice', fileName);

    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
      console.log(`[VOICE] Manually deleted ${fileName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Voice Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
