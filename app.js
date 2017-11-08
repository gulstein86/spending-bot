/* jshint node: true, devel: true, asi : true, loopfunc: true, esversion: 6 */

const telegramBot = require('node-telegram-bot-api');
const mongodb = require('mongodb');
const express = require('express')
// const re = require('re')
const _ = require('lodash')

const app = express()

let MongoClient = mongodb.MongoClient;
let db
const token = '387164811:AAFG-YE0wZ9rJaCt3MpGIjWZAEssYWu-LCU';
const api = new telegramBot(token, {
  polling: true
});

app.set('port', process.env.PORT || 443);

api.onText(/\/add/, function (msg, match) {
  var fromId = msg.from.id;
  var test = _.pick(msg, ['text'])
 
  api.sendMessage(fromId, "Ok. done!")

  if (msg.chat.id < 0) {
    db.collection('group').updateOne({
      id: msg.chat.id
    }, msg.chat, {
      upsert: true
    })
  } else(
    db.collection('person').updateOne({
      id: msg.chat.id
    }, msg.chat, {
      upsert: true
    })
  )

  db.collection('text').insert(test)
  db.collection('transaction').insert(msg)
  console.log(test)
});


var opts = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
};

console.log("SpendTrack has started. Start conversations in your Telegram.");

//start server
MongoClient.connect('mongodb://localhost:27017/telegram', function (err, database) {
  if (err) throw err;

  db = database;

  // Start the application after the database connection is ready
  app.listen(app.get('port'), '127.0.0.1', function () {
    console.log('Node app is running on port', app.get('port'));
  });
});

//this is my new code line