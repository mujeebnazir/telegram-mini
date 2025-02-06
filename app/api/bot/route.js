//api/bot/route.js 

import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false});

// Keyboard configuration
const keyboard = {
  reply_markup: {
    keyboard: [[
      {
        text: "Open Web App",
        web_app: { url: process.env.NEXT_PUBLIC_WEBAPP_URL }
      }
    ]],
    resize_keyboard: true
  }
};

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

export async function POST(req) {
  try {
    const update = await req.json();

    // Handle /start command
    if (update.message?.text === '/start') {
      await bot.sendMessage(
        update.message.chat.id,
        'Welcome! Click the button below to open the web app:',
        keyboard
      );
    }

    // Handle web app data
    if (update.web_app_data) {
      console.log('Received data from web app:', update.web_app_data);
      await bot.sendMessage(
        update.message.chat.id,
        'Received your data!'
      );
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling update:', error);
    return new Response('Error', { status: 500 });
  }
}

export async function GET() {
  return new Response('Bot is running', { status: 200 });
}