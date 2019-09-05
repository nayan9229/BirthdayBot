const moment = require('moment');
const { sendTextMessage, sendHiMessage, askBirthDate, sendPositiveResponse, sendNegativeResponse, sendActionResponse } = require('./Message');
const { isPositive, isNegative, storeMessage } = require('./utils');

const db = {};

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 *
 */
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);

        if (quickReplyPayload === 'DEVELOPER_DEFINED_PAYLOAD_YES') {
            sendPositiveResponse(senderID, db[senderID].bd);
        } else if (quickReplyPayload === 'DEVELOPER_DEFINED_PAYLOAD_NO') {
            sendTextMessage(senderID, 'Goodbye');
        } else {
            sendTextMessage(senderID, 'Goodbye!');
        }
        db[senderID] ? db[senderID].stage = 1 : db[senderID] = { stage: 1 };
        return;
    }

    if (messageText) {

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
            case 'hello':
            case 'hi':
                sendHiMessage(senderID);
                db[senderID] ? db[senderID].stage = 1 : db[senderID] = { stage: 1 };
                break;
            default:
                if (db[senderID]) {
                    if (db[senderID].stage) {
                        switch (db[senderID].stage) {
                            case 1:
                                askBirthDate(senderID, messageText);
                                db[senderID] ? db[senderID].stage = 2 : db[senderID] = { stage: 2 };
                                break;
                            case 2:
                                if (moment(messageText, "YYYY-MM-DD").isValid()) {
                                    sendActionResponse(senderID);
                                    db[senderID] ? db[senderID].stage = 3 : db[senderID] = { stage: 3 };
                                    db[senderID] ? db[senderID].bd = messageText : db[senderID] = { bd: messageText };
                                } else {
                                    askBirthDate(senderID, '');
                                    db[senderID] ? db[senderID].stage = 2 : db[senderID] = { stage: 2 };
                                }
                                break;
                            case 3:
                                if (isPositive(messageText)) {
                                    sendPositiveResponse(senderID, db[senderID].bd);
                                } else if (isNegative(messageText)) {
                                    sendTextMessage(senderID, 'Goodbye');
                                } else {
                                    sendTextMessage(senderID, 'Goodbye!');
                                }
                                db[senderID] ? db[senderID].stage = 0 : db[senderID] = { stage: 0 };
                                break;
                            default:
                                sendTextMessage(senderID, messageText);
                        }
                    }
                } else sendTextMessage(senderID, messageText);
        }
        storeMessage(senderID, messageText);
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

module.exports = {
    receivedMessage
}