var telegramBot = require('node-telegram-bot-api'); 
var token ='387164811:AAFG-YE0wZ9rJaCt3MpGIjWZAEssYWu-LCU'; 
var api = new telegramBot(token, {polling: true}); 
const mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;
let db

api.onText(/\/help/, function(msg, match) { 
  var fromId = msg.from.id; 
  api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me."); 
}); 

api.onText(/\/add/, function(msg, match) { 
  var fromId = msg.from.id; 
  api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me."); 
}); 

api.onText(/\/start/, function(msg, match) { 
  var fromId = msg.from.id; 
  api.sendMessage(fromId, "They call me MadansFirstTelegramBot. " +  
    "I can help you in getting the sentiments of any text you send to me."+ 
    "To help you i just have few commands.\n/help\n/start\n/sentiments"); 
}); 

api.onText(/../, function(msg, match) { 
  // var fromId = msg.from.id; 
  db.collection('fblog').insert(msg)
}); 
 
var opts = {
  reply_markup: JSON.stringify( 
    { 
      force_reply: true 
    } 
  )}; 
 
//sentiment command execution is added here 
api.onText(/\/sentiments/, function(msg, match) {
  var fromId = msg.from.id;   
  api.sendMessage(fromId, "Alright! So you need sentiments of a text from me. "+ 
    "I can help you in that. Just send me the text.", opts) 
  .then(function (sended) { 
    var chatId = sended.chat.id; 
    var messageId = sended.message_id; 
    api.onReplyToMessage(chatId, messageId, function (message) { 
      //call a function to get sentiments here... 
      var sentival = sentiment(message.text); 
      api.sendMessage(fromId,"So sentiments for your text are, Score:" + sentival.score +" Comparative:"+sentival.comparative); 
    }); 
  });                                                    
}); 
 
console.log("MadansFirstTelegramBot has started. Start conversations in your Telegram.");

//start server
MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
  if(err) throw err;

  db = database;

  // Start the application after the database connection is ready
	app.listen(app.get('port'),'127.0.0.1', function() {
	 console.log('Node app is running on port', app.get('port'));
	});
});