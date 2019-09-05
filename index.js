const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const CONFIG = require('./config');

app.set('port', (process.env.PORT || 8000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Home
app.get('/', function (req, res) {
	res.send('Hello world!');
});
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === CONFIG.VERIFICATION_TOKEN) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Wrong token!');
});

app.post('/webhook/', function (req, res) {
    // const data = req.body
    // const message = data.entry[0].messaging[0].message.text
    // const sender = data.entry[0].messaging[0].sender.id

    // _.forEach(command.request, (value, key) => {
    //     if (_.lowerCase(message) === key) {
    //         sendmsg(sender, value)
    //     }
    // });
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, text + "!");
        }
    }
    res.sendStatus(200)
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
    }, function(error, response, body) {
        if (error) {
            console.log('Error:', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

// Start the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});