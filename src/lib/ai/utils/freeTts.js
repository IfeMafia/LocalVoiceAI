import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import fsPromises from 'fs/promises';

/**
 * Multilingual Text-to-Speech using Free Microsoft Edge Neural Voices
 * No billing, no API keys required.
 * 
 * 1. Input: text string.
 * 2. Selects correct language based on detection.
 * 3. Uses High-Quality Neural Voices for Nigerian languages.
 * 4. Outputs high-quality MP3 audio.
 * 5. Handles unsupported and empty strings safely.
 * 
 * @param {string} text - The input text to convert to speech
 * @param {string} detectedLanguage - english, yoruba, igbo, or hausa
 * @returns {Promise<string>} Path to the generated audio file
 */
export async function generateFreeSpeech(text, detectedLanguage = 'english') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.error('[FREE TTS] Empty input provided, returning null.');
    return null;
  }

  const voiceMap = {
    'english': 'en-NG-AbeoNeural',
    'yoruba':  'yo-NG-OluNeural',
    'hausa':   'ha-NG-AminaNeural',
    'igbo':    'ig-NG-NkechiNeural',
    'unsupported': 'en-US-AriaNeural'
  };

  let selectedVoice = voiceMap[detectedLanguage?.toLowerCase()];
  let textToSynthesize = text;

  if (!selectedVoice) {
    console.warn(`[FREE TTS] Fallback active: '${detectedLanguage}' is unsupported.`);
    selectedVoice = voiceMap['unsupported'];
    textToSynthesize = "Language not supported.";
  }

  console.log(`[FREE TTS] Preparing audio generation using ${selectedVoice}`);

  const tempFileName = `free_tts_${crypto.randomBytes(8).toString('hex')}.mp3`;
  const tempDir = path.join(process.cwd(), 'public', 'temp_voice');
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const filePath = path.join(tempDir, tempFileName);
  
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    // Use manual stream to fix saving issues on some operating systems
    const stream = tts.toStream(textToSynthesize);
    const writer = fs.createWriteStream(filePath);
    stream.audioStream.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Auto cleanup after 15 minutes
    setTimeout(async () => {
      try {
        if (fs.existsSync(filePath)) await fsPromises.unlink(filePath);
      } catch (err) {
        // Ignore errors during background auto-delete
      }
    }, 15 * 60 * 1000);
    
    return `/temp_voice/${tempFileName}`;
  } catch (error) {
    console.error('[FREE TTS] Error:', error);
    throw new Error('Failed to generate free TTS audio.');
  }
}
