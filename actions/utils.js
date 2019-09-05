const moment = require('moment');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://bot:boot@cluster0-bbg40.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });

const positives = ['yes', 'yeah', 'yup', 'sure', 'okay', 'mhmm'];
const negatives = ['no', 'nah'];

function calNextBirtdayDays(bdate) {
    // This is the birthdate we're checking, in ISO 8601 format
    const birthdate = bdate;

    // Get today's date in ISO 8601 format
    const today = moment().format('YYYY-MM-DD');

    // Calculate current age of person in years (moment truncates by default)
    const years = moment().diff(birthdate, 'years');

    // Special case if birthday is today; we do NOT need an extra year added
    const adjustToday = birthdate.substring(5) === today.substring(5) ? 0 : 1;

    // Add age plus one year (unless birthday is today) to get next birthday
    const nextBirthday = moment(birthdate).add(years + adjustToday, 'years');

    // Final calculation in days
    const daysUntilBirthday = nextBirthday.diff(today, 'days');
    return daysUntilBirthday;
}

function isPositive(messageText) {
    messageText = messageText.trim().toLowerCase();
    if (positives.indexOf(messageText) > -1) {
        return true;
    } else return false;
}

function isNegative(messageText) {
    messageText = messageText.trim().toLowerCase();
    if (negatives.indexOf(messageText) > -1) {
        return true;
    } else return false;
}

function storeMessage(senderId = 0, messageText = '') {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) console.log(err);
        const message = { userId: senderId, text: messageText, time: parseInt(new Date().getTime() / 1000) };
        client.db("bot").collection("message").insertOne(message, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            client.close();
        });
    });
}

function getAllMessages() {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) console.log(err);
            client.db("bot").collection("message").find({}).toArray(function (err, result) {
                if (err) reject(err);
                else resolve(result);
                client.close();
            });
        });
    });
}

function getById(msgId) {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) console.log(err);
            var query = { _id: new mongo.ObjectID(msgId) };
            client.db("bot").collection("message").find(query).toArray(function (err, result) {
                if (err) reject(err);
                else resolve(result);
                client.close();
            });
        });
    });
}

function deleteById(msgId) {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) console.log(err);
            var query = { _id: new mongo.ObjectID(msgId) };
            client.db("bot").collection("message").deleteOne(query, function (err, result) {
                if (err) reject(err);
                else resolve(result);
                client.close();
            });
        });
    });
}

module.exports = {
    calNextBirtdayDays,
    isPositive,
    isNegative,
    storeMessage,
    getAllMessages,
    getById,
    deleteById
}