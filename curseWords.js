// List of curse words and inappropriate language to detect
// Add or remove words as needed (keeping it family-friendly in the code)

const curseWords = [
  // Common curse words
  'fuck',
  'shit',
  'damn',
  'ass',
  'bitch',
  'bastard',
  'crap',
  'hell',
  'piss',
  
  // Slurs and hateful terms (abbreviated/censored in code)
  'fck',
  'sht',
  'btch',
  
  // Variations and common misspellings people use to bypass filters
  'f*ck',
  'sh*t',
  'b*tch',
  'a$$',
  'd@mn',
  'fuk',
  'fuc',
  'shiz',
  'azz',
  
  // Add more as needed
];

// Function to check if a message contains curse words
function containsCurseWord(message) {
  const lowerMessage = message.toLowerCase();
  
  // Remove special characters and check
  const cleanedMessage = lowerMessage.replace(/[^a-z0-9\s]/g, '');
  
  for (const word of curseWords) {
    const cleanedWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check both original and cleaned versions
    if (lowerMessage.includes(word.toLowerCase()) || 
        cleanedMessage.includes(cleanedWord)) {
      return true;
    }
  }
  
  return false;
}

// Function to get which curse words were found (for logging)
function findCurseWords(message) {
  const found = [];
  const lowerMessage = message.toLowerCase();
  const cleanedMessage = lowerMessage.replace(/[^a-z0-9\s]/g, '');
  
  for (const word of curseWords) {
    const cleanedWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (lowerMessage.includes(word.toLowerCase()) || 
        cleanedMessage.includes(cleanedWord)) {
      found.push(word);
    }
  }
  
  return found;
}

module.exports = {
  curseWords,
  containsCurseWord,
  findCurseWords
};
