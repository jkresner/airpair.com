var mongoose = require('mongoose')

var VALID_LEVELS = ['beginner', 'intermediate', 'expert'];

export default mongoose.model('Tag', new mongoose.Schema({

  name: {               // E.g. Ruby on Rails
    required: true,
    type: String
  },
  short: {              // E.g. Rails
    required: true,
    type: String
  },
  slug: {               // E.g. ruby-on-rails
    required: true,
    type: String,
    unique: true,
    sparse: true
  },  
  desc: String,         
  soId: {
    type: String,
    unique: true,
    sparse: true
  },
  so: {},
  ghId: {
    type: String,
    unique: true,
    sparse: true
  },
  gh: {},
  tokens: String,       // Extra comma separated strings to assist filter search

}))
