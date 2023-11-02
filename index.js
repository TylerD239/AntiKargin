// const app = require('vk-io');
// const app2 = require('@vk-io/hear');
// const port = 80;
//
async function b() {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    const a = await fetch('https://neurochat-gpt.ru/v1/chat/completions');
    const c = await a.text();
    console.log(c)
}
b();


// const {OpenAI} = require("openai");
//
// const openai = new OpenAI({apiKey: "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"});
//
// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [{ role: "system", content: "You are a helpful assistant." }],
//         model: "gpt-3.5-turbo"
//     });
//
//     console.log(completion.choices[0]);
// }
//
// main();




// Добавляем конфиг файл для хранения токена и подключаем библиотеку, которая облегчит работу с API ВК
const
    { VK, Keyboard } = require('vk-io'), // сама библиотека
    { HearManager } = require('@vk-io/hear'); // Удобен для создания команд бота

// Теперь необходимо создать экземпляр класса передав в него наш токен для работы с API, в дальнейшем этот экземпляр понадобится нам для работы с библиотекой
const vk = new VK({
    token: "vk1.a.e9b1xyN8sU774gN-VXPZmGx0nhG1clxvuBcfwC5CNHwOgjwHEpW1mh-ELU--Kp2K_KFu2F9N03Jk7S22FRg-S23tFQetLlIkYBGzt_7kd7MKzLSu68TQZKYWixnYloXT4_DZoo7t7VLylc0gm3sTTx3UqQ6NfY9Rp7jTD21d5jZ11DSMOBwtJRxJaeKcW4hapYtM_wwM-WpSCEseB5L5Wg"
});

const command = new HearManager(); // Создаём экземпляр

vk.updates.on('message', command.middleware); // Это позволит HearManager прослушивать события сообщений

// Получаем событие нового сообщения, также вы можете указывать полное название события (то как указано в документации вк, либо найти все сокращения в документации vk-io
vk.updates.on('message', async (context, next) => {
    console.log('Пришло новое сообщение!'); // Выводим в консоль сообщение о том, что пришло событие
    await next(); // Для продолжения выполнения кода нужно вызывать next функцию.
});


command.hear('/start', async (context) => {
    context.send('Ну всё Антон, пизда тебе');
})

vk.updates.on('message', (context, next ) => {

    let blacklisted = ['Купата', 'Купаты', 'Купатыща']

    let foundInText = false;
    for (var i in blacklisted){
        if (context.text.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }sadasd

    if (foundInText && context.senderId == 123456){
        vk.api.messages.delete({
            message_ids: context.conversationMessageId,
            delete_for_all: 1,
        });
        context.send('ТЕКСТ ЕБАНЫЙ ТЕКСТ');
    } else {
        next()
    }
})

vk.updates.start()
    .then(() => console.log('Стартанул'))
    .catch(console.error);
