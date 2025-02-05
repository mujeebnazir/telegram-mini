import TelegramBot from 'node-telegram-bot-api';

// Initialize bot outside the handler to maintain the connection
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  webHook: {
    port:  3000
  }
});

// Configure the webhook URL in your environment
const webhookUrl = process.env.WEBHOOK_URL; // e.g., 'https://your-domain.com/api/bot'

// Set up webhook
(async () => {
  try {
    await bot.setWebHook(`${webhookUrl}/webhook`);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
})();

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