import ora from "ora";
import chalk from "chalk";
import clear from "console-clear";
import figlet from "figlet";
import qrcode from "qrcode-terminal";
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs-extra";

const logger = pino({
  level: "silent",
});

const spinner = ora("Iniciando...").start();

const showBanner = () => {
  clear();

  const program_name = "Mensaje a color";

  const author =
    chalk.yellow("\nCódigo fuente: ") +
    chalk.underline.greenBright("https://t.me/djhonnyb\n");

  const howToUseEn =
    chalk.magenta.bold("Cómo usar:\n") +
    chalk.blueBright(
      `Once the QR code is scanned and connected to your WhatsApp account, you can send any text message.
To trigger the hidetag, send a message to a group containing any emoji.\n`
    );

  const howToUseId =
    chalk.magenta.bold("Cómo usar:Una vez que el código QR se escanea y se conecta a tu cuenta de WhatsApp, puedes enviar cualquier mensaje de texto.
Para activar el mensaje a color, envía un mensaje por el chat.\n") +
    chalk.blueBright ( `\n` );
console.log(program_name);
console.log(author);
console.log(howToUseEn);
console.log(howToUseId);
};

const whatsapp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('.auth_session');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger,
  });
  
const sendMessage = (message, groupJid) => {
if (message.message.extendedTextMessage?.text || message.message.conversation) {
  let textMessage = message.message.extendedTextMessage?.text || message.message.conversation;
  
  if (textMessage.length > 0) {
    try {
      const textoColor = chalk.red(textMessage); // Cambia a chalk.green, chalk.blue, chalk.yellow según el color que desees
      sock.sendMessage(groupJid, { text: textoColor });
      spinner.succeed("Texto de color enviado correctamente");
    } catch (error) {
      spinner.fail(`Fallo el envío de texto a color: ${error.toString()}`).start();
     }
   }
 }
};
  sock.ev.on('messages.upsert', async (messages) => {
    const message = messages[0];
    const groupJid = message.key.remoteJid;
    await sendMessage(message, groupJid);
  });
};
