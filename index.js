const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const CONFIG = require('./config');

app.set('port', (process.env.PORT || 80));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home
app.get('/', function (req, res) {
    res.send('Hello world!');
});

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 *
 */
app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        // data.entry.forEach(function (pageEntry) {
        //     var pageID = pageEntry.id;
        //     var timeOfEvent = pageEntry.time;

        //     // Iterate over each messaging event
        //     pageEntry.messaging.forEach(function (messagingEvent) {
        //         // if (messagingEvent.optin) {
        //         //     receivedAuthentication(messagingEvent);
        //         // } else if (messagingEvent.message) {
        //         //     receivedMessage(messagingEvent);
        //         // } else if (messagingEvent.delivery) {
        //         //     receivedDeliveryConfirmation(messagingEvent);
        //         // } else if (messagingEvent.postback) {
        //         //     receivedPostback(messagingEvent);
        //         // } else if (messagingEvent.read) {
        //         //     receivedMessageRead(messagingEvent);
        //         // } else if (messagingEvent.account_linking) {
        //         //     receivedAccountLink(messagingEvent);
        //         // } else {
        //         //     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        //         // }
        //     });
        // });
        try {
            var messaging_events = req.body.entry[0].messaging;
            for (var i = 0; i < messaging_events.length; i++) {
                var event = req.body.entry[0].messaging[i];
                var sender = event.sender.id;
                if (event.message && event.message.text) {
                    var text = event.message.text;
                    sendTextMessage(sender, text + "!");
                }
            }
            res.sendStatus(200);
        } catch (error) {
            console.log('[CATCH]', error);
        }

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: CONFIG.FB_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error:', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

// Start the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'));
});