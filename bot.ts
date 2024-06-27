import {
    Bot,
    CommandContext,
    Context,
    Keyboard,
    session,
    SessionFlavor,
} from 'grammy'
import * as dotenv from 'dotenv'
import { getWeather } from './src/api/apiMethods'
import { State, SessionData } from './src/types/botState'
dotenv.config()

type BotContext = Context & SessionFlavor<SessionData>

const bot = new Bot<BotContext>(process.env.TELEGRAM_TOKEN || '')

function initial(): SessionData {
    return {
        state: State.IDLE,
        city: null,
        interactions: 0,
    }
}

bot.use(
    session({
        initial,
    })
)

const introductionMessage = `¡Hola! Soy Ally, un bot de Telegram.
Puedo decirte el clima, o contar... ¡Puedo contar!

<b>Comandos</b>
/clima - Muestra el clima de hoy
/contar - Muestra la cantidad de veces que has interactuado con Ally`

const keyboard = new Keyboard()
    .text('¡Quiero saber el clima! ☀️')
    .row()
    .text('¡Quiero contar! 🔢')
    .row()
    .resized()

keyboard.persistent()

const replyWithIntro = async (ctx) => {
    switch (ctx.session.state) {
        case State.WAITING:
            ctx.session.state = State.IDLE
            const city = ctx.message?.text || ''
            const weather = await getWeather(city)
            if (!weather) {
                ctx.reply('No se pudo obtener el clima', {
                    reply_markup: keyboard,
                    parse_mode: 'HTML',
                })
                return
            }
            const response = `El clima en ${city} es ${weather?.weather[0].description}`
            ctx.reply(response, {
                reply_markup: keyboard,
                parse_mode: 'HTML',
            })
            break
        case State.IDLE:
            ctx.reply(introductionMessage, {
                reply_markup: keyboard,
                parse_mode: 'HTML',
            })
            break
    }
}

bot.api.setMyCommands([
    { command: 'clima', description: 'Muestra el clima de hoy' },
    {
        command: 'contar',
        description:
            'Muestra la cantidad de veces que has interactuado con Ally',
    },
])

bot.hears(/.*clima.*/, async (ctx) => {
    ctx.session.interactions++
    const chatId = ctx.msg.chat.id
    await bot.api.sendMessage(
        chatId,
        '¿En qué ciudad te gustaría saber el clima?'
    )
    ctx.session.state = State.WAITING
})

bot.hears(/.*contar.*/, async (ctx) => {
    ctx.session.interactions++
    const chatId = ctx.msg.chat.id
    await bot.api.sendMessage(
        chatId,
        `La cantidad de interacciones es: ${ctx.session.interactions}`
    )
})

bot.command('start', replyWithIntro)

bot.on('message', async (ctx) => {
    ctx.session.interactions++
    await replyWithIntro(ctx)
})

bot.start()
