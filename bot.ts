import { Bot, Keyboard } from "grammy";
import dotenv from "dotenv";
import { getWeather } from "./apiMethods";
dotenv.config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const introductionMessage = `¡Hola! Soy Ally, un bot de Telegram.
Puedo decirte el clima, o contar... ¡Puedo contar!

<b>Comandos</b>
/clima - Muestra el clima de hoy
/contar - Muestra la cantidad de veces que has interactuado con Ally`;

const keyboard = new Keyboard()
  .text("¡Quiero saber el clima! ☀️")
  .row()
  .text("¡Quiero contar! 🔢")
  .row()
  .resized();

keyboard.persistent();

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });

bot.api.setMyCommands([
  { command: "clima", description: "Muestra el clima de hoy" },
  {
    command: "contar",
    description: "Muestra la cantidad de veces que has interactuado con Ally",
  },
]);

bot.command("clima", async (ctx) => {
  const chatId = ctx.msg.chat.id;
  await bot.api.sendMessage(
    chatId,
    "¿En qué ciudad te gustaría saber el clima?"
  );

  const message = ctx.message;
  const result = await getWeather(message?.text || "");
  ctx.reply(result?.weather[0].description || "");
});

bot.command("start", replyWithIntro);

bot.on("message", replyWithIntro);

bot.start();
