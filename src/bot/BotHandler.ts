import { Bot, Context, Keyboard, SessionFlavor } from 'grammy'
import { runConversation } from '../api/OpenAiApiClient'
import { ApiException } from '../api/WeatherApiClient'
import { SessionData, State } from '../types/BotStates'

type BotContext = Context & SessionFlavor<SessionData>

export class BotHandler {
    constructor(
        private bot: Bot<BotContext>,
        private keyboard: Keyboard,
        private introductionMessage: string
    ) {}

    public replyWithIntro = async (ctx: BotContext): Promise<void> => {
        await ctx.reply(this.introductionMessage, {
            reply_markup: this.keyboard,
            parse_mode: 'HTML',
        })
    }

    public handleClimaCommand = async (ctx: BotContext): Promise<void> => {
        ctx.session.interactions++
        const chatId = ctx.msg.chat.id
        await this.bot.api.sendMessage(
            chatId,
            '¿En qué ciudad te gustaría saber el clima?'
        )
        ctx.session.state = State.WAITING
    }

    public handleContarCommand = async (ctx: BotContext): Promise<void> => {
        ctx.session.interactions++
        const chatId = ctx.msg.chat.id
        await this.bot.api.sendMessage(
            chatId,
            `La cantidad de interacciones es: ${ctx.session.interactions}`
        )
    }

    public handleMessage = async (ctx: BotContext): Promise<void> => {
        ctx.session.interactions++

        switch (ctx.session.state) {
            case State.WAITING:
                await this.continueConversation(ctx)
                break
            case State.IDLE:
                await ctx.reply(this.introductionMessage, {
                    reply_markup: this.keyboard,
                    parse_mode: 'HTML',
                })
                break
        }
    }

    private async continueConversation(ctx: BotContext): Promise<void> {
        ctx.session.state = State.IDLE
        const city = ctx.message?.text || ''
        try {
            const reply = await runConversation(city)
            await ctx.reply(reply || '', {
                reply_markup: this.keyboard,
                parse_mode: 'HTML',
            })
        } catch (error) {
            this.handleError(ctx, error)
        }
    }

    private async handleError(ctx: BotContext, error: any): Promise<void> {
        if (process.env.DEBUG === 'TRUE') {
            if (error instanceof ApiException) {
                await ctx.reply(`Error: ${error.message}`, {
                    reply_markup: this.keyboard,
                    parse_mode: 'HTML',
                })
            } else {
                await ctx.reply(`Error: ${error}`, {
                    reply_markup: this.keyboard,
                    parse_mode: 'HTML',
                })
            }
        } else {
            await ctx.reply('No se pudo obtener el clima', {
                reply_markup: this.keyboard,
                parse_mode: 'HTML',
            })
        }
    }
}
