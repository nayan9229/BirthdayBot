const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const CONFIG = require('./config');
const { receivedMessage } = require('./actions/receivedHandler');
const { getAllMessages, getById, deleteById } = require('./actions/utils');

app.set('port', (process.env.PORT || 8080));

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
        req.query['hub.verify_token'] === CONFIG.VERIFICATION_TOKEN) {
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
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});


/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/messages', function (req, res) {
    getAllMessages()
        .then(result => res.status(200).send(result))
        .catch(err => res.status(403).send({ message: 'Something Went wrong' }));
});

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/messages/:messageId', function (req, res) {
    getById(req.params.messageId)
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result[0]);
            } else res.status(200).send({ message: 'Not Found.' })
        })
        .catch(err => res.status(403).send({ message: 'Something Went wrong' }));
});

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.delete('/messages/:messageId', function (req, res) {
    deleteById(req.params.messageId)
        .then(result => {
            res.status(200).send({ message: 'message deleted successfully' });
        })
        .catch(err => res.status(403).send({ message: 'Something Went wrong' }));
});

// Start the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'));
});