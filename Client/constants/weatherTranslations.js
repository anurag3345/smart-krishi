export const weatherConditions = {
  Clear: { NP: "खुल्ला" },
  Clouds: { NP: "बादल" },
  Rain: { NP: "वर्षा" },
  Drizzle: { NP: "फुर्सदिलो वर्षा" },
  Thunderstorm: { NP: "गर्जनसहितको वर्षा" },
  Snow: { NP: "हिउँ" },
  Mist: { NP: "तुँवालो" },
  Smoke: { NP: "धुवाँ" },
  Haze: { NP: "कुहिरो" },
  Dust: { NP: "धुलो" },
  Fog: { NP: "हुस्सु" },
  Sand: { NP: "बालुवा" },
  Ash: { NP: "राख" },
  Squall: { NP: "आँधी" },
  Tornado: { NP: "बवण्डर" },
};

export const weatherDescriptions = {
  "clear sky": { NP: "खुल्ला आकाश" },
  "few clouds": { NP: "केही बादलहरू" },
  "scattered clouds": { NP: "छरिएका बादलहरू" },
  "broken clouds": { NP: "फुटेका बादलहरू" },
  "overcast clouds": { NP: "घना बादल" },
  "light rain": { NP: "हल्का वर्षा" },
  "moderate rain": { NP: "मध्यम वर्षा" },
  "heavy intensity rain": { NP: "तीव्र वर्षा" },
  "shower rain": { NP: "छिटपुट वर्षा" },
  thunderstorm: { NP: "गर्जनसहितको वर्षा" },
  snow: { NP: "हिउँ" },
  mist: { NP: "तुँवालो" },
  haze: { NP: "कुहिरो" },
  fog: { NP: "हुस्सु" },
  smoke: { NP: "धुवाँ" },
  dust: { NP: "धुलो" },
};

export function translateWeather(text, lang = 'EN') {
  if (!text) return '';

  if (lang === 'EN') return text;

  // Clean up text
  const lowerText = text.toLowerCase();
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  // Check description first
  if (weatherDescriptions[lowerText]) {
    return weatherDescriptions[lowerText][lang] || text;
  }

  // Then check main conditions
  if (weatherConditions[capitalized]) {
    return weatherConditions[capitalized][lang] || text;
  }

  return text;
}
