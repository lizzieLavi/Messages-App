const mongoose = require('mongoose'); 

let ConversationSchema = new mongoose.Schema
({
  Name: String, 
  creatorId: String,
  Participants:Array,
  Messages:Array,
  LastMessage:Object,
  ConversationImage:String,
  isGroup: Boolean,
  createdDate:String,
  description:String,
});

module.exports = mongoose.model('conversations',ConversationSchema);