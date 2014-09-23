var mongoose = require('mongoose')


export default mongoose.model('Tag', new mongoose.Schema({

  name: {               // E.g. Ruby on Rails
    required: true,
    type: String,
    trim: true
  },
  short: {              // E.g. Rails
    required: true,
    type: String,
    trim: true
  },
  slug: {               // E.g. ruby-on-rails
    required: true,
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },  
  desc: String,         
  soId: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  so: {},
  ghId: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  gh: {},
  tokens: String,       // Extra comma separated strings to assist filter search

}))
