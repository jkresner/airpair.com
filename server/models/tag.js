var mongoose = require('mongoose')


var tagSchema = new mongoose.Schema({

  name: { required: true, type: String, trim: true },  // E.g. Ruby on Rails
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

})


tagSchema.index(
 {
   tokens: "text",
   name: "text",
   short: "text",
   desc: "text",
 },
 {
   weights: {
      tokens: 20,
      name: 10,
      short: 9,
      desc: 1,
    },
    name: "TagTextIndex"
  }
)


module.exports = mongoose.model('Tag', tagSchema)
