import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as googleTTS from 'google-tts-api';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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
  return chatData.message.content;
}

async function generateSpeech(text) {
  try {
    // google-tts-api breaks down text > 200 chars automatically
    const base64Array = await googleTTS.getAllAudioBase64(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?',
    });

    // Convert all base64 chunks to buffers and combine them
    const buffers = base64Array.map(item => Buffer.from(item.base64, 'base64'));
    const finalBuffer = Buffer.concat(buffers);
    
    // Create a local temp file in the public directory to serve directly
    const tempFileName = `tts_${crypto.randomBytes(8).toString('hex')}.mp3`;
    const tempDir = path.join(process.cwd(), 'public', 'temp_voice');
    
    // Ensure directory exists
    await fs.mkdir(tempDir, { recursive: true }).catch(() => {});
    
    const filePath = path.join(tempDir, tempFileName);
    await fs.writeFile(filePath, finalBuffer);
    
    return `/temp_voice/${tempFileName}`;
  } catch (error) {
    console.error('TTS Error:', error);
    throw new Error('Text-to-Speech conversion failed');
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio');
    const conversationId = formData.get('conversationId');

    if (!audioBlob || !conversationId) {
      return NextResponse.json({ success: false, error: 'Audio file and conversation ID are required' }, { status: 400 });
    }

    // 1. Convert Audio to Text (using Groq Whisper)
    const transcript = await transcribeAudio(audioBlob);
    if (!transcript.trim()) {
      return NextResponse.json({ success: false, error: 'Could not transcribe any speech' }, { status: 400 });
    }

    console.log(`[VOICE] Transcribed: "${transcript}"`);

    // 2. Chat Processing (Ensures scope, context, DB logging)
    const aiResponseText = await generateChatResponse(conversationId, transcript);
    console.log(`[VOICE] AI Response: "${aiResponseText}"`);

    // 3. Convert Text to Speech (using Google TTS)
    let audioUrl = null;
    if (aiResponseText) {
      audioUrl = await generateSpeech(aiResponseText);
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
