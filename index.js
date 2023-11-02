const
    { VK } = require('vk-io'),
    { HearManager } = require('@vk-io/hear'),
    config = require('./config.json'),
    { check, add, show } = require('./wordsFilter');

const COMMANDS = {
    ADD: '/add',
    SHOW: '/show'
}

const vk = new VK({token: config.vk_token});

const command = new HearManager();

vk.updates.on('message', command.middleware);

vk.updates.on('message', async (context, next) => {
    console.log('Пришло новое сообщение!');
    await next();
});


command.hear('/start', async (context) => {
    context.send('Ну всё Антон, пизда тебе');
})

vk.updates.on('message_new', async (context, next) => {
    const callback = context.senderId != config.kargin_id ? logBadWord.bind(this, context) : deleteMessage.bind(this, context);
    check(context.text, callback);
    next();
});

vk.updates.on('message_new', async (context, next) => {
    const text = context.text;
    if (text && text.includes(COMMANDS.ADD)) {
        add(text.substring(COMMANDS.ADD.length + 1));
    }
    if (text && text.includes(COMMANDS.SHOW)) {
        show(showAllWords.bind(this, context));
    }
    next();
});

function showAllWords(context, words) {
    context.send(words.join(' '));
}

function logBadWord(context) {
    context.send('я бы это удалил, будь ты каргиным');
}

function deleteMessage(context) {
    vk.api.messages.delete({
        conversation_message_ids: context.conversationMessageId,
        peer_id: context.peerId,
        delete_for_all: 1,
    });
}

vk.updates.start()
    .then(() => console.log('Стартанул'))
    .catch(console.error);
