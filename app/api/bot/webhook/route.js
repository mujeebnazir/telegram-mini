//api/bot/route.js 

import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false});


// Function to set the webhook
async function setWebhook() {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  try {
    // First, delete any existing webhook
    const deleteWebhookResponse = await bot.deleteWebHook();
    console.log('Webhook deleted:', deleteWebhookResponse);

    // Now, set the new webhook
    const setWebhookResponse = await bot.setWebHook(`${webhookUrl}/webhook`);
    console.log('Webhook set successfully:', setWebhookResponse);
  } catch (error) {
    console.error('Error handling webhook:', error);
  }
}

setWebhook();

// Enhanced Keyboard Configuration
const mainMenu = {
  reply_markup: {
    keyboard: [
      [
        { 
          text: "🎮 Open Web App",
          web_app: { url: process.env.NEXT_PUBLIC_WEBAPP_URL }
        }
      ],
      [
        { text: "ℹ️ About" },
        { text: "📊 My Stats" }
      ],
      [
        { text: "⚙️ Settings" },
        { text: "🌟 Rate Us" }
      ]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// Inline Keyboard for Settings
const settingsKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🔔 Notifications", callback_data: 'toggle_notifications' },
        { text: "🌙 Dark Mode", callback_data: 'toggle_dark_mode' }
      ],
      [
        { text: "📚 Documentation", url: "https://your-docs-url.com" },
        { text: "💬 Support", url: "https://t.me/yoursupportchannel" }
      ]
    ]
  }
};

// Store user interactions (consider using a database in production)
const userStats = new Map();

// Webhook setup function remains the same...

export async function POST(req) {
  try {
    const update = await req.json();

    // Track user activity
    if (update.message?.chat.id) {
      const userId = update.message.chat.id;
      userStats.set(userId, (userStats.get(userId) || 0) + 1);
    }

    // Handle commands
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const messageText = update.message.text.toLowerCase();

      switch(messageText) {
        case '/start':
          await bot.sendMessage(chatId, '🚀 Welcome to our awesome bot!', mainMenu);
          // await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEL...'); // Add your sticker ID
          break;

        case 'ℹ️ about':
          await bot.sendMessage(chatId, `🌟 **About Us**\n\nThis bot helps you...`, {
            parse_mode: 'Markdown',
            ...mainMenu
          });
          break;

        case '📊 my stats':
          const stats = userStats.get(chatId) || 0;
          await bot.sendMessage(chatId, `📈 **Your Stats**\n\nInteractions: ${stats}\nRank: ${getUserRank(stats)}`, {
            parse_mode: 'Markdown'
          });
          break;

        case '⚙️ settings':
          await bot.sendMessage(chatId, '⚙️ **Bot Settings**', settingsKeyboard);
          break;

        case '🌟 rate us':
          await sendRatingRequest(chatId);
          break;

        default:
          if (messageText.startsWith('/')) {
            await bot.sendMessage(chatId, '❌ Unknown command. Try one of these:', mainMenu);
          }
      }
    }

    // Handle inline keyboard callbacks
    if (update.callback_query) {
      const { data, message } = update.callback_query;
      await bot.answerCallbackQuery(update.callback_query.id);
      
      switch(data) {
        case 'toggle_notifications':
          await handleNotificationsToggle(message.chat.id);
          break;
        
        case 'toggle_dark_mode':
          await handleDarkModeToggle(message.chat.id);
          break;
      }
    }

    // Handle web app data with more functionality
    if (update.web_app_data) {
      const webData = JSON.parse(update.web_app_data.data);
      await bot.sendMessage(
        update.message.chat.id,
        `✅ Received ${webData.type || 'data'}:\n${JSON.stringify(webData, null, 2)}`,
        { parse_mode: 'Markdown' }
      );
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling update:', error);
    return new Response('Error', { status: 500 });
  }
}

// Helper functions
async function sendRatingRequest(chatId) {
  await bot.sendMessage(chatId, 'How would you rate our bot?', {
    reply_markup: {
      inline_keyboard: [
        [...Array(5)].map((_, i) => ({
          text: '⭐'.repeat(i + 1),
          callback_data: `rate_${i + 1}`
        }))
      ]
    }
  });
}

async function handleNotificationsToggle(chatId) {
  await bot.sendMessage(chatId, '🔔 Notifications toggled!');
  // Add your notification logic here
}

async function handleDarkModeToggle(chatId) {
  await bot.sendMessage(chatId, '🌙 Dark mode toggled!');
  // Add your theme handling logic here
}

function getUserRank(interactions) {
  if (interactions > 50) return 'Gold 🥇';
  if (interactions > 20) return 'Silver 🥈';
  return 'Bronze 🥉';
}