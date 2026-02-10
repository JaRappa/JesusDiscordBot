require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { checkProfanity } = require('./curseWords');
const { analyzeSentiment, generateJesusResponse } = require('./openaiService');
const jesusQuotes = require('./JesusQuotes.json');

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel]
});

// Configuration
const USE_PROFANITY_LIST = true; // Toggle: true = use @dsojevic/profanity-list, false = custom list only
const SENTIMENT_THRESHOLD = 0.6; // Minimum confidence to respond to mean messages
const COOLDOWN_MS = 30000; // 30 second cooldown per user to avoid spam
const QUOTE_CHANCE = 1 / 20; // 1 in 20 chance to send a quote
const CLEAN_MESSAGES_REQUIRED = 3; // Messages without curse/mean before quote chance

// Track cooldowns per user
const userCooldowns = new Map();

// Track clean messages per channel (no curse/mean)
const channelCleanCount = new Map();

// Check if user is on cooldown
function isOnCooldown(userId) {
  const lastResponse = userCooldowns.get(userId);
  if (!lastResponse) return false;
  return Date.now() - lastResponse < COOLDOWN_MS;
}

// Set user cooldown
function setCooldown(userId) {
  userCooldowns.set(userId, Date.now());
}

// Get a random Jesus quote
function getRandomQuote() {
  const quote = jesusQuotes[Math.floor(Math.random() * jesusQuotes.length)];
  return `✝️ *"${quote.quote}"*\n— **${quote.reference}**`;
}

// Bot ready event
client.once('ready', () => {
  console.log('═══════════════════════════════════════════');
  console.log('✝️  Jesus Bot is now online!');
  console.log(`📛 Logged in as: ${client.user.tag}`);
  console.log(`🏠 Serving ${client.guilds.cache.size} server(s)`);
  console.log('═══════════════════════════════════════════');
  
  // Set bot status
  client.user.setActivity('over my children 🙏', { type: 3 }); // "Watching over my children"
});

// Message event handler
client.on('messageCreate', async (message) => {
  // Ignore bot messages and DMs
  if (message.author.bot) return;
  if (!message.guild) return;
  
  // Check for cooldown
  if (isOnCooldown(message.author.id)) {
    return;
  }
  
  const messageContent = message.content;
  const username = message.author.username;
  
  let shouldRespond = false;
  let triggerType = null;
  
  // Check for curse words first (faster, no API call)
  const profanityResult = checkProfanity(messageContent, USE_PROFANITY_LIST);
  if (profanityResult.hasProfanity) {
    shouldRespond = true;
    triggerType = 'curse';
    
    console.log(`[CURSE DETECTED] User: ${username} | Word: ${profanityResult.word} | Source: ${profanityResult.source}`);
  } 
  // If no curse words, check sentiment with OpenAI
  else if (messageContent.length > 5) { // Only check messages with some content
    try {
      const sentiment = await analyzeSentiment(messageContent);
      
      if (sentiment.isMean && sentiment.confidence >= SENTIMENT_THRESHOLD) {
        shouldRespond = true;
        triggerType = 'mean';
        console.log(`[MEAN MESSAGE] User: ${username} | Confidence: ${sentiment.confidence} | Reason: ${sentiment.reason}`);
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error.message);
    }
  }
  
  // Generate and send response if needed
  if (shouldRespond) {
    // Reset clean message count for this channel
    channelCleanCount.set(message.channel.id, 0);
    
    try {
      // Show typing indicator
      await message.channel.sendTyping();
      
      // Generate Jesus response
      const jesusResponse = await generateJesusResponse(messageContent, triggerType, username);
      
      // Reply to the message
      await message.reply({
        content: jesusResponse,
        allowedMentions: { repliedUser: true }
      });
      
      // Set cooldown for this user
      setCooldown(message.author.id);
      
      console.log(`[RESPONSE SENT] To: ${username} | Type: ${triggerType}`);
      
    } catch (error) {
      console.error('Failed to send response:', error.message);
    }
  } else {
    // Message was clean - increment clean count for this channel
    const cleanCount = (channelCleanCount.get(message.channel.id) || 0) + 1;
    channelCleanCount.set(message.channel.id, cleanCount);
    
    // If we've had enough clean messages, roll for a random quote
    if (cleanCount >= CLEAN_MESSAGES_REQUIRED && Math.random() < QUOTE_CHANCE) {
      try {
        const quote = getRandomQuote();
        await message.channel.send(quote);
        
        // Reset the counter after sending a quote
        channelCleanCount.set(message.channel.id, 0);
        
        console.log(`[QUOTE SENT] Channel: ${message.channel.name}`);
      } catch (error) {
        console.error('Failed to send quote:', error.message);
      }
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login to Discord
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ ERROR: DISCORD_TOKEN not found in .env file!');
  console.error('Please create a .env file with your Discord bot token.');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY not found in .env file!');
  console.error('Please create a .env file with your OpenAI API key.');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
