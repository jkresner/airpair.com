var mongoose = require('mongoose')

module.exports = mongoose.model('redirect', new mongoose.Schema({
  
  previous:  { type: String, unique: true, required: true, trim: true, lowercase: true },  
  current:   { type: String, required: true, trim: true, lowercase: true }

}))