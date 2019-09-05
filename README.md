# BirthdayBot
Facebook messanger bot to tell us remaining days to birth day

## Technology stack:
1. JavaScript
1. NodeJS with Express.js framework
1. mongoDB database
1. REST APIs 
1. Facebook messanger
1. Facebook APIs

__Now, you can clone the project__

Type in your terminal : 

```
$ git clone https://github.com/nayan9229/BirthdayBot.git
$ cd BirthdayBot
$ npm install
```

Then, Run 

```
$ npm start
```

__If you want to create a with own. you need to update your credentials in `config.js`__

## BOT

__Facebook messenger bot address:__
```
https://www.messenger.com/t/105409847509502
```
This bot is in development though it is still pending for facebook review. You need to provide me your facebook user id and I will add you as a tester to play with bot.


## APIs

This project is hosted on heroku and it is runnig Live [here](https://bdbot9.herokuapp.com). 

### baseURL:
```
https://bdbot9.herokuapp.com
```

### APIs:

| Method | Endpoint  | Description |
| ------------- | ------------- | ------------- |
| GET  | /webhook  | Facebook Check that the token used in the Webhook  |
| POST | /webhook  | All callbacks for Messenger are POST-ed. They will be sent to the same webhook. Be sure to subscribe your app to your page to receive callbacks for your page.  |
| GET  | /messages  | Retrives the list of messages received from users |
| GET  | /messages/:messageId  | Retrives the messages by messageId |
| DELETE | /messages/:messageId  | Delete the messages by messageId. |
