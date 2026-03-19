import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import * as googleTTS from 'google-tts-api';

/**
 * Hybrid Multilingual Text-to-Speech (Serverless-Safe)
 * 
 * Returns base64 Data URIs instead of writing to disk to prevent 
 * Vercel/AWS Lambda read-only filesystem crashes (ENOENT /var/task).
 * 
 * @param {string} text - The input text to convert to speech
 * @param {string} detectedLanguage - english, yoruba, igbo, or hausa
 * @returns {Promise<string>} Base64 audio data URI playable in the browser
 */
export async function generateHybridSpeech(text, detectedLanguage = 'english') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.error('[HYBRID TTS] Empty input provided, returning null.');
    return null;
  }

  const normalizedLang = detectedLanguage?.toLowerCase() || 'english';

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
    
    // Process stream into buffer in memory
    const stream = tts.toStream(edgeText);
    const chunks = [];

    await new Promise((resolve, reject) => {
      stream.audioStream.on('data', chunk => chunks.push(chunk));
      stream.audioStream.on('end', resolve);
      stream.audioStream.on('error', reject);
    });

    const audioBuffer = Buffer.concat(chunks);
    const base64Audio = audioBuffer.toString('base64');
    
    return `data:audio/mp3;base64,${base64Audio}`;

  } catch (primaryError) {
    console.warn('[HYBRID TTS] Primary Engine (MsEdge) failed. Attempting Fallback...', primaryError.message);
    
    // --- FALLBACK ENGINE: Google TTS API (Free/Unofficial) ---
    try {
      const gttsLangMap = {
        'english': 'en',
        'yoruba':  'yo',
        'hausa':   'ha',
        'igbo':    'ig',
        'unsupported': 'en' 
      };

      let gttsLang = gttsLangMap[normalizedLang];
      let gttsText = text;

      if (!gttsLang) {
        gttsLang = gttsLangMap['unsupported'];
        gttsText = "Language not supported.";
      }

      console.log(`[HYBRID TTS] Using Secondary Engine (Google TTS API) for language code '${gttsLang}'`);

      const audioChunks = await googleTTS.getAllAudioBase64(gttsText, {
        lang: gttsLang,
        slow: false,
        host: 'https://translate.google.com',
      });

      const combinedBuffer = Buffer.concat(
        audioChunks.map(chunk => Buffer.from(chunk.base64, 'base64'))
      );
      
      const base64Audio = combinedBuffer.toString('base64');
      return `data:audio/mp3;base64,${base64Audio}`;
      
    } catch (fallbackError) {
      console.error('[HYBRID TTS] Fallback Engine also failed:', fallbackError);
      throw new Error('All TTS engines failed to generate audio.');
    }
  }
}
