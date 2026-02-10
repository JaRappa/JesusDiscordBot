// Load the profanity list package
const profanityListEn = require('@dsojevic/profanity-list/en.json');

// Extract all match patterns from the profanity list
const profanityWords = profanityListEn.flatMap(item => {
  // Split on | for multiple match patterns
  return item.match.split('|').map(word => word.trim());
});

// ============================================================
// CUSTOM CURSE WORDS - Add your own words here!
// These are checked IN ADDITION to the profanity-list package
// ============================================================
const customCurseWords = [
  // Add any custom words the main list might miss
  // Examples:
  // 'customword',
  // 'anotherword',
];

// Function to check a word list against a message
function checkWordList(message, wordList) {
  const lowerMessage = message.toLowerCase();
  const cleanedMessage = lowerMessage.replace(/[^a-z0-9\s]/g, '');
  
  for (const word of wordList) {
    // Skip empty words
    if (!word || word.length === 0) continue;
    
    const cleanedWord = word.toLowerCase().replace(/[^a-z0-9*]/g, '');
    
    // Handle wildcard patterns (e.g., "lo*ng" matches "loooong")
    if (cleanedWord.includes('*')) {
      const regexPattern = cleanedWord.replace(/\*/g, '+');
      try {
        const regex = new RegExp(regexPattern, 'i');
        if (regex.test(cleanedMessage)) {
          return { found: true, word };
        }
      } catch (e) {
        // Invalid regex, skip
      }
    } else {
      // Check both original and cleaned versions
      if (lowerMessage.includes(word.toLowerCase()) || 
          cleanedMessage.includes(cleanedWord)) {
        return { found: true, word };
      }
    }
  }
  
  return { found: false, word: null };
}

/**
 * Main profanity check function
 * @param {string} message - The message to check
 * @param {boolean} useProfanityList - Whether to use the @dsojevic/profanity-list
 * @returns {{ hasProfanity: boolean, source: string, word: string|null }}
 */
function checkProfanity(message, useProfanityList = true) {
  // Always check custom words first
  const customCheck = checkWordList(message, customCurseWords);
  if (customCheck.found) {
    return { hasProfanity: true, source: 'custom', word: customCheck.word };
  }
  
  // Check profanity list if enabled
  if (useProfanityList) {
    const profanityCheck = checkWordList(message, profanityWords);
    if (profanityCheck.found) {
      return { hasProfanity: true, source: 'profanity-list', word: profanityCheck.word };
    }
  }
  
  return { hasProfanity: false, source: null, word: null };
}

module.exports = {
  customCurseWords,
  profanityWords,
  checkProfanity
};
