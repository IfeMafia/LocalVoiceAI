import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Initialize the Google Cloud TTS client.
// NOTE: Ensure your standard GOOGLE_APPLICATION_CREDENTIALS are set in your environment
// or you provide credentials directly to the constructor in production.
const client = new textToSpeech.TextToSpeechClient();

/**
 * Multilingual Text-to-Speech using Google Cloud
 * 
 * 1. Input: text buffer string.
 * 2. Selects correct language based on detection.
 * 3. Uses WaveNet/Neural2 (fallback to Standard if Google doesn't have Neural for African languages).
 * 4. Outputs high-quality MP3 audio playable natively by Voxy.
 * 5. Handles unsupported and empty strings without crashing.
 * 
 * @param {string} text - The input text to convert to speech
 * @param {string} detectedLanguage - English, Yoruba, Hausa or Igbo
 * @returns {Promise<string>} Path to the generated audio file
 */
export async function generateGoogleSpeech(text, detectedLanguage = 'english') {
  // Feature 7: Error handling for empty/null inputs
  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.error('[GOOGLE TTS] Empty input provided, returning null without crashing.');
    return null;
  }

  // Feature 4: Language-specific voice configuration (WaveNet / Neural2)
  const voiceConfig = {
    'english': { languageCode: 'en-US', name: 'en-US-Neural2-F' },
    'yoruba':  { languageCode: 'yo-NG', name: 'yo-NG-Standard-A' },
    'igbo':    { languageCode: 'ig-NG', name: 'ig-NG-Standard-A' },
    'hausa':   { languageCode: 'ha-NG', name: 'ha-NG-Standard-A' },
    'unsupported': { languageCode: 'en-US', name: 'en-US-Neural2-J' }
  };

  let config = voiceConfig[detectedLanguage?.toLowerCase()];
  let textToSynthesize = text;

  // Feature 5: Fallback handling for unsupported languages
  if (!config) {
    console.warn(`[GOOGLE TTS] Fallback active: '${detectedLanguage}' is unsupported.`);
    config = voiceConfig['unsupported'];
    textToSynthesize = "Language not supported.";
  }

  console.log(`[GOOGLE TTS] Preparing audio generation in ${config.languageCode} (${config.name})`);

  // Construct request payload
  const request = {
    input: { text: textToSynthesize },
    voice: { 
      languageCode: config.languageCode, 
      name: config.name 
    },
    audioConfig: { audioEncoding: 'MP3' }, // High-quality audio output
  };

  try {
    // Generate audio
    const [response] = await client.synthesizeSpeech(request);
    
    // Feature 6: Provide immediate playback URL in Voxy
    const tempFileName = `gcp_tts_${crypto.randomBytes(8).toString('hex')}.mp3`;
    const tempDir = path.join(process.cwd(), 'public', 'temp_voice');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filePath = path.join(tempDir, tempFileName);
    fs.writeFileSync(filePath, response.audioContent, 'binary');
    
    console.log(`[GOOGLE TTS] Successfully generated audio at ${filePath}`);
    return `/temp_voice/${tempFileName}`;
  } catch (error) {
    console.error('[GOOGLE TTS] Client Error:', error);
    throw new Error('Failed to generate high-quality Google Cloud TTS audio.');
  }
}
