const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// The cheapest/lightest model as specified
const MODEL = 'gpt-5-nano';

/**
 * Analyzes if a message has mean/negative sentiment
 * Returns { isMean: boolean, confidence: number, reason: string }
 */
async function analyzeSentiment(message) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analyzer. Analyze if the following message is mean, hateful, bullying, or unkind toward others. 
          
Respond ONLY with valid JSON in this exact format:
{"isMean": true/false, "confidence": 0.0-1.0, "reason": "brief explanation"}

Consider these as mean:
- Direct insults or name-calling
- Bullying or harassment
- Hateful speech
- Mocking or belittling others
- Aggressive threats
- Passive-aggressive attacks

Do NOT flag:
- General complaints or frustration (not directed at people)
- Sarcasm among friends (context-dependent)
- Criticism that is constructive
- Expressing negative emotions about situations (not people)`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 100,
      temperature: 0.3
    });

    const content = response.choices[0].message.content.trim();
    
    // Parse the JSON response
    try {
      const result = JSON.parse(content);
      return {
        isMean: result.isMean === true,
        confidence: result.confidence || 0.5,
        reason: result.reason || 'No reason provided'
      };
    } catch (parseError) {
      console.error('Failed to parse sentiment response:', content);
      return { isMean: false, confidence: 0, reason: 'Parse error' };
    }
    
  } catch (error) {
    console.error('OpenAI sentiment analysis error:', error.message);
    return { isMean: false, confidence: 0, reason: 'API error' };
  }
}

/**
 * Generates a Jesus-like response to remind someone to be kind
 * @param {string} originalMessage - The message that triggered the response
 * @param {string} triggerType - 'curse' or 'mean' to indicate why we're responding
 * @param {string} username - The username of the person who sent the message
 */
async function generateJesusResponse(originalMessage, triggerType, username) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are Jesus Christ responding in a Discord server. Your goal is to gently remind people to be kind and loving, without being preachy or judgmental.

Your personality:
- Loving, gentle, and understanding
- Use simple, warm language
- Occasionally reference Biblical teachings but keep it accessible
- Use light humor when appropriate
- Never harsh or condemning - always forgiving
- Speak with compassion and empathy
- Keep responses concise (1-3 sentences typically)
- Sometimes use phrases like "My child", "Dear friend", "Peace be with you"
- Can use appropriate emojis sparingly (✝️ 🙏 💙 ☮️ 🕊️)

Important: Don't quote the offensive message back. Just respond with love and encouragement.`
        },
        {
          role: 'user',
          content: triggerType === 'curse' 
            ? `Someone named ${username} just used some harsh language. Generate a gentle, loving reminder about using kinder words.`
            : `Someone named ${username} just said something that seemed unkind or hurtful toward others. Generate a gentle, loving reminder about treating others with kindness.`
        }
      ],
      max_tokens: 200,
      temperature: 0.9 // Higher temperature for more varied responses
    });

    return response.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('OpenAI response generation error:', error.message);
    
    // Fallback responses if API fails
    const fallbackResponses = [
      "My child, let us speak with love in our hearts. 🙏",
      "Peace be with you, friend. Remember, kind words heal while harsh ones wound. 💙",
      "Dear friend, I encourage you to let love guide your words. ☮️",
      "Let us treat one another as we wish to be treated. 🕊️",
      "My child, there is great strength in gentleness and kindness. ✝️"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

module.exports = {
  analyzeSentiment,
  generateJesusResponse
};
