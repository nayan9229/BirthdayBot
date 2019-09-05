const { callSendAPI } = require('./fb_apis');
const { calNextBirtdayDays } = require('./utils');

function sendHiMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            // text: `Welcome to birthday bot!`
            text: `What is your first name?`
        }
    }
    callSendAPI(messageData);
}

/*
 * Send a text message for asking user birth date using the Send API.
 *
 */
function askBirthDate(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: `plese enter your birth date in YYYY-MM-DD`
        }
    }
    callSendAPI(messageData);
}

/*
 * Send a text message for asking user birth date using the Send API.
 *
 */
function sendActionResponse(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: `Would you like to know how many days till your next birtday?`,
            quick_replies: [
                {
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_YES"
                },
                {
                    "content_type": "text",
                    "title": "No",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_NO"
                }
            ]
        }
    }
    callSendAPI(messageData);
}

/*
 * Send a text message for asking user birth date using the Send API.
 *
 */
function sendPositiveResponse(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: `There are ${calNextBirtdayDays(messageText)} days left until your next birthday`
        }
    }
    callSendAPI(messageData);
}

/*
 * Send a text message for asking user birth date using the Send API.
 *
 */
function sendNegativeResponse(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: `Plese enter your birth date`
        }
    }
    callSendAPI(messageData);
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
}

module.exports = {
    sendHiMessage,
    sendTextMessage,
    askBirthDate,
    sendActionResponse,
    sendPositiveResponse,
    sendNegativeResponse
}