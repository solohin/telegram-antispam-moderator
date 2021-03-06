"use strict";
//libs

//modules
const getDomain = require('../../components/getDomain');
const db = require('../../components/db');
const bot = require('../../components/bot');
const extractEnteties = require('../../components/extractEnteties');
const deleteOriginalAndBan = require('./shared/deleteOriginalAndBan');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const {forward_from, text, entities} = message.reply_to_message;

    const [link] = extractEnteties({text, entities}, 'url');
    originalChatId = parseInt(originalChatId);

    let messageText = `Сообщение удалено. Любой, кто оставит ссылку ${link} будет заблокирован.`
    if (forward_from) messageText += `\nАвтор лишен возможности писать сообщения.`

    return Promise.all([
        bot.sendMessage(message.chat.id, messageText),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
        db.blackListLink({chatId: originalChatId, blockedString: link}),
    ]);
};