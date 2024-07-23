import { Bot, Context, Keyboard, session, SessionFlavor } from 'grammy'
import { SessionData, State } from '../types/BotStates'
import { BotHandler } from './BotHandler'

type BotContext = Context & SessionFlavor<SessionData>

export class TelegramBot {
    private bot: Bot<BotContext>
    private keyboard: Keyboard
    private introductionMessage: string

    constructor(token: string) {
        this.bot = new Bot<BotContext>(token)
        this.keyboard = this.createKeyboard()
        this.introductionMessage = `¡Hola! Soy Ally, un bot de Telegram.
Puedo decirte el clima, o contar... ¡Puedo contar!

<b>Comandos</b>
/clima - Muestra el clima de hoy
/contar - Muestra la cantidad de veces que has interactuado con Ally`

        this.bot.use(session({ initial: this.initialSessionData }))
        this.setBotCommands()
        this.setEventHandlers()
    }

    private initialSessionData(): SessionData {
        return {
            state: State.IDLE,
            city: null,
            interactions: 0,
        }
    }

    private createKeyboard(): Keyboard {
        return new Keyboard()
            .text('¡Quiero saber el clima! ☀️')
            .row()
            .text('¡Quiero contar! 🔢')
            .row()
            .resized()
            .persistent()
    }

    private setBotCommands(): void {
        this.bot.api.setMyCommands([
            { command: 'clima', description: 'Muestra el clima de hoy' },
            {
                command: 'contar',
                description:
                    'Muestra la cantidad de veces que has interactuado con Ally',
            },
        ])
    }

    private setEventHandlers(): void {
        const handler = new BotHandler(
            this.bot,
            this.keyboard,
            this.introductionMessage
        )

        this.bot.command('start', handler.replyWithIntro)
        this.bot.command('clima', handler.handleClimaCommand)
        this.bot.command('contar', handler.handleContarCommand)

        this.bot.hears('¡Quiero saber el clima! ☀️', handler.handleClimaCommand)
        this.bot.hears('¡Quiero contar! 🔢', handler.handleContarCommand)

        this.bot.on('message', handler.handleMessage)
    }

    public start(): void {
        this.bot.start()
    }
}
