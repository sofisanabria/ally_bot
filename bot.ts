import * as dotenv from 'dotenv'
import { TelegramBot } from './src/bot/TelegramBot'
dotenv.config()

const botToken = process.env.TELEGRAM_TOKEN || ''
const telegramBot = new TelegramBot(botToken)
telegramBot.start()
