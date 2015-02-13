var mongoose = require('mongoose')


var type = [
  'mail',
  'md-file',
  'site-notification',
  'site-content',
  'tw-tweet',
  'fb-share',
  'in-share',
  'pageMeta'
]


module.exports = mongoose.model('Template', new mongoose.Schema({

  key:          { type: String, required: true, lowercase: true, trim: true, unique: true },
  type:         { type: String, required: true, enum: type },
  markdown:     { type: String, required: true },
  subject:      { type: String },
  description:  { type: String },

}))
