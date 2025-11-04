// disparar.js
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = null;
let isReady = false;

function initializeWhatsApp() {
  return new Promise((resolve, reject) => {
    if (client && isReady) return resolve(client);

    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true }
    });

    client.on('qr', qr => {
      console.log('\nESCANEIE O QR CODE:\n');
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('WhatsApp PRONTO PARA ENVIO ATIVO!');
      isReady = true;
      resolve(client);
    });

    client.on('auth_failure', () => reject(new Error('Falha na autenticação')));
    client.on('disconnected', () => {
      console.log('Desconectado.');
      client = null; isReady = false;
    });

    client.initialize().catch(reject);
  });
}

/**
 * ENVIA PDF ATIVAMENTE PARA QUALQUER NÚMERO
 */
async function sendPdfToContact(telefone, pdfBytes, fileName) {
  if (!isReady || !client) throw new Error('WhatsApp não conectado');

  const numeroLimpo = telefone.replace(/\D/g, '');
  if (numeroLimpo.length < 10) throw new Error(`Número inválido: ${telefone}`);

  // Usa getNumberId para forçar envio ativo
  const numberId = await client.getNumberId(numeroLimpo);
  if (!numberId) throw new Error(`Número não existe no WhatsApp: ${numeroLimpo}`);

  const chatId = numberId._serialized; // ex: 5544999721495@c.us

  const media = new MessageMedia('application/pdf', Buffer.from(pdfBytes).toString('base64'), fileName);

  await client.sendMessage(chatId, media, {
    caption: 'Segue seu documento personalizado.'
  });

  console.log(`ENVIADO ATIVAMENTE → ${numeroLimpo}`);
}

module.exports = { initializeWhatsApp, sendPdfToContact };