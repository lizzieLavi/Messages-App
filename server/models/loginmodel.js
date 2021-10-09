const mongoose = require('mongoose'); 

let LogInSchema = new mongoose.Schema({
  name: String,
  phone: String,
  imageName: String,
  contacts: Array,
  LastSeen: String,
  Status:String,
  color:String
});

module.exports = mongoose.model('logIn',LogInSchema);