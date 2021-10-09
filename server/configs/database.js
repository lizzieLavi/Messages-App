const mongoose = require('mongoose');

mongoose.connect('mongodb://lizzieLavi:olishuk2089@messageapp-shard-00-00.36fu3.mongodb.net:27017,messageapp-shard-00-01.36fu3.mongodb.net:27017, messageapp-shard-00-02.36fu3.mongodb.net:27017/messagesDB?ssl=true&replicaSet=atlas-mo1c4i-shard-0&authSource=admin&retryWrites=true&w=majority');

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));  
db.once('open', () => {  
  console.log(`Connected to the messagesDB database`);
});


