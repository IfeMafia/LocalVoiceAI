import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import fsPromises from 'fs/promises';

/**
 * Hybrid Multilingual Text-to-Speech
 * 
 * PRIMARY: Free Microsoft Edge Neural Voices (High quality Nigerian accents)
 * FALLBACK: Free unofficial Google Translate API (Reliable, no API keys, standard voices)
 * 
 * @param {string} text - The input text to convert to speech
 * @param {string} detectedLanguage - english, yoruba, igbo, or hausa
 * @returns {Promise<string>} Path to the generated audio file
 */
export async function generateHybridSpeech(text, detectedLanguage = 'english') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.error('[HYBRID TTS] Empty input provided, returning null.');
    return null;
  }

  const normalizedLang = detectedLanguage?.toLowerCase() || 'english';
  const tempFileName = `hybrid_tts_${crypto.randomBytes(8).toString('hex')}.mp3`;
  const tempDir = path.join(process.cwd(), 'public', 'temp_voice');
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const filePath = path.join(tempDir, tempFileName);

  // Auto cleanup after 15 minutes
  setTimeout(async () => {
    try {
      if (fs.existsSync(filePath)) await fsPromises.unlink(filePath);
    } catch (err) { }
  }, 15 * 60 * 1000);

  // --- PRIMARY ENGINE: MsEdge Neural Voices ---
  try {
    const edgeVoiceMap = {
      'english': 'en-NG-AbeoNeural',
      'yoruba':  'yo-NG-OluNeural',
      'hausa':   'ha-NG-AminaNeural',
      'igbo':    'ig-NG-NkechiNeural',
      'unsupported': 'en-US-AriaNeural'
    };

    let selectedEdgeVoice = edgeVoiceMap[normalizedLang];
    let edgeText = text;

    if (!selectedEdgeVoice) {
      console.warn(`[HYBRID TTS: MSEDGE] Fallback active: '${normalizedLang}' is unsupported.`);
      selectedEdgeVoice = edgeVoiceMap['unsupported'];
      edgeText = "Language not supported.";
    }

    console.log(`[HYBRID TTS] Attempting Primary Engine (MsEdge) using ${selectedEdgeVoice}`);
    
    const tts = new MsEdgeTTS();
    await tts.setMetadata(selectedEdgeVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    const stream = tts.toStream(edgeText);
    const writer = fs.createWriteStream(filePath);
    stream.audioStream.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return `/temp_voice/${tempFileName}`;

  } catch (primaryError) {
    console.warn('[HYBRID TTS] Primary Engine (MsEdge) failed. Attempting Fallback...', primaryError.message);
    
    // --- FALLBACK ENGINE: Google TTS API (Free/Unofficial) ---
    try {
      const gttsLangMap = {
        'english': 'en',
        'yoruba':  'yo',
        'hausa':   'ha',
        'igbo':    'ig',
        'unsupported': 'en' // Fallback to english if not found
      };

      let gttsLang = gttsLangMap[normalizedLang];
      let gttsText = text;

      if (!gttsLang) {
        gttsLang = gttsLangMap['unsupported'];
        gttsText = "Language not supported.";
      }

      console.log(`[HYBRID TTS] Using Secondary Engine (Google TTS API) for language code '${gttsLang}'`);

      // google-tts-api automatically handles text > 200 chars by chunking with getAllAudioBase64
      const audioChunks = await googleTTS.getAllAudioBase64(gttsText, {
        lang: gttsLang,
        slow: false,
        host: 'https://translate.google.com',
      });

      // Combine base64 chunks and write to file
      const combinedBuffer = Buffer.concat(
        audioChunks.map(chunk => Buffer.from(chunk.base64, 'base64'))
      );
      
      fs.writeFileSync(filePath, combinedBuffer);

      return `/temp_voice/${tempFileName}`;
      
    } catch (fallbackError) {
      console.error('[HYBRID TTS] Fallback Engine also failed:', fallbackError);
      throw new Error('All TTS engines failed to generate audio.');
    }
  }
}
