/* jshint node: true, devel: true, asi : true, loopfunc: true, esversion: 6 */

const telegramBot = require('node-telegram-bot-api');
const mongodb = require('mongodb');
const express = require('express');
const moment = require('moment');
// const re = require('re')
const _ = require('lodash')

const app = express()

let MongoClient = mongodb.MongoClient;
let db
// let mongod_url = 'mongodb://aswadi:Dianti123@ds147995.mlab.com:47995/eds2'
let mongod_url = 'mongodb://localhost:27017/telegram'

const token = '387164811:AAFG-YE0wZ9rJaCt3MpGIjWZAEssYWu-LCU';
const api = new telegramBot(token, {
  polling: true
});



//start server
MongoClient.connect(mongod_url, function (err, database) {
  if (err) throw err;

  db = database;

  // Start the application after the database connection is ready
  app.listen(app.get('port'), '127.0.0.1', function () {
    console.log('Node app is running on port', app.get('port'));
  });
});

app.set('port', process.env.PORT || 443);

api.onText(/\/add/, function (msg, match) {
  let fromId = msg.from.id;
  let test = _.pick(msg, ['text'])
  // api.sendMessage(fromId, "Ok. done!")

  if (msg.chat.id < 0) { //message from group
    db.collection('group').updateOne({
      id: msg.chat.id
    }, msg.chat, {
      upsert: true
    })

    console.log(msg)

    // let time = new Date(msg.date*1000+28800000)
    let time = moment.unix(msg.date)
    let item = msg.text.match((/^\/add\s([a-zA-Z-\s]+)\s\d/))[1]
    let amount = msg.text.match(/([0-9,]+(\.[0-9]{1,2})?)$/)[1]

    let transact = {
      'time': msg.date*1000,
      'group_id': msg.chat.id,
      'person_id': msg.from.id,
      'item': item,
      'amount': parseFloat(amount)
    }

    db.collection('transact').insert(transact)
    db.collection('person').updateOne({
      id: msg.from.id
    }, msg.from, {
      upsert: true
    })

    // db.collection('transact').

  } else( //message from user alone
    db.collection('person').updateOne({
      id: msg.chat.id
    }, msg.chat, {
      upsert: true
    })
  )

  db.collection('text').insert(test)
  db.collection('all_transaction').insert(msg)
  console.log(test)
});


var opts = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
};

console.log("SpendTrack has started. Start conversations in your Telegram.");

//function below this line

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};