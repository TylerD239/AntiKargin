const
    { VK } = require('vk-io'),
    { HearManager } = require('@vk-io/hear'),
    config = require('./config.json'),
    wordsFilter = require('./wordsFilter');

const COMMANDS = {
    ADD: '/add',
    SHOW: '/show'
}

const vk = new VK({token: config.vk_token});

const command = new HearManager();

vk.updates.on('message', command.middleware);

vk.updates.on('message', async (context, next) => {
    console.log(`Пришло новое сообщение!
    text: ${context.text},
    type: ${context.type}
    `);
    
    if (context.eventMemberId === config.renata_id) {
        if (context.eventType === "chat_invite_user") {
            renameChat(true);
        }
        if (context.eventType === "chat_kick_user") {
            renameChat(false);
        }
    }
    await next();
});


command.hear('/start', async (context) => {
    context.send('Ну всё Антон, пизда тебе');
})

vk.updates.on('message_new', async (context, next) => {
    const callback = context.senderId !== config.kargin_id ?
        logBadWord.bind(this, context) :
        deleteMessage.bind(this, context);
    wordsFilter.check(context.text, callback);
    await next();
});

vk.updates.use( async (context, next) => {
    // const callback = context.senderId != config.kargin_id ?
    //     logBadWord.bind(this, context) :
    //     deleteMessage.bind(this, context);
    // wordsFilter.check(context.text, callback);
    // await next();
    // console.log(JSON.stringify(context));
    // console.log(context.eventType);
    await next();
});

vk.updates.on('message_new', async (context, next) => {
    const text = context.text;
    if (text && text.includes(COMMANDS.ADD)) {
        wordsFilter.add(text.substring(COMMANDS.ADD.length + 1));
    }
    if (text && text.includes(COMMANDS.SHOW)) {
        wordsFilter.show(showAllWords.bind(this, context));
    }

    await next();
});

function showAllWords(context, words) {
    context.send(words.join(' '));
}

function logBadWord(context) {
    if (config.response_for_not_kargin) {
        context.send('Я бы это удалил, будь ты каргиным', {
            forward: JSON.stringify({
                peer_id: context.peerId,
                conversation_message_ids: [context.conversationMessageId],
                is_reply: 1,
            })
        });
    }
}

function deleteMessage(context) {
    vk.api.messages.delete({
        conversation_message_ids: context.conversationMessageId,
        peer_id: context.peerId,
        delete_for_all: 1,
    });
    wordsFilter.save(context.text)
    context.send('Тут было сообщение @lightofdawn(Каргина) с демонстрацией желания иметь половую связь с мужчинами');
}

vk.updates.start()
    .then(() => console.log('Стартанул'))
    .catch(console.error);

async function renameChat(withRenata) {
    await vk.api.messages.editChat({
        chat_id: 1,
        title: withRenata ? config.chat_name_with_renata : config.chat_name_without_renata
    });
}

// vk.api.messages.getConversationMembers({
//     peer_id: 2000000001
// }).then(data => console.log(JSON.stringify(data)));

