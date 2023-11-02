const
    { VK } = require('vk-io'),
    { HearManager } = require('@vk-io/hear'),
    config = require('./config.json'),
    check = require('./wordsFilter');


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

vk.updates.on('message_new', async (context) => {
    if (context.senderId != config.kargin_id) {
        // return;
    }
    check(context.text, () => deleteMessage(context.conversationMessageId, context.peerId))
});

function deleteMessage(id, peedId) {
    vk.api.messages.delete({
        conversation_message_ids: id,
        peer_id: peedId,
        delete_for_all: 1,
    });
}

vk.updates.start()
    .then(() => console.log('Стартанул'))
    .catch(console.error);
