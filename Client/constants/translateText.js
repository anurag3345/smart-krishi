// constants/translateText.js

export const translateText = async (text, targetLang) => {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang.toLowerCase(), // 'np' for Nepali
        format: 'text',
      }),
    });

    const result = await response.json();
    return result.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // fallback to original text
  }
};
