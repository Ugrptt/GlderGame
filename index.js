const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Token
const TOKEN = 'YOUR_BOT_TOKEN'; // BotFather'dan aldığın token
const CHAT_ID = 'YOUR_CHAT_ID'; // İstediğin kullanıcının chat id'si

app.use(bodyParser.json());

// Webhook için bir endpoint tanımlıyoruz
app.post(`/webhook/${TOKEN}`, (req, res) => {
    const update = req.body;

    // Mesaj alındığında yapılacak işlemler
    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        // Mesaja cevap ver
        sendMessage(chatId, `Mesajınız alındı: ${text}`);
    }

    res.sendStatus(200);
});

// Telegram'a mesaj göndermek için fonksiyon
const sendMessage = (chatId, text) => {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Webhook sunucusu ${PORT} portunda çalışıyor...`);
});
