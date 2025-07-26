export const toNepaliDigits = (input, language) => {
  if (language !== 'NP') {
    return input; // Return input as is if the language is not Nepali
  }

  const map = {
    '0': '०',
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
  };

  return input.toString().split('').map((char) => map[char] || char).join('');
};
