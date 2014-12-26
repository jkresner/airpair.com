var mongoose = require('mongoose')


var redirectType = ['301','302','410','canonical-post']


module.exports = mongoose.model('Redirect', new mongoose.Schema({

  previous:  { type: String, unique: true, required: true, trim: true, lowercase: true },
  current:   { type: String, required: true, trim: true, lowercase: true },
  type:      { type: String, required: true, enum: redirectType, default: '301' }

}))
