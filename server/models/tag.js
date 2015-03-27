var mongoose = require('mongoose')
var Shared = require("./_shared")

var tagSchema = new mongoose.Schema({

  // E.g. Ruby on Rails
  name:     { required: true, type: String, trim: true },

  // E.g. Rails
  short:    { required: true, type: String, trim: true },

  // E.g. ruby-on-rails
  slug:     { required: true, type: String, trim: true,
            lowercase: true, unique: true, sparse: true },

  desc:     String,

  // E.g "RoR,Rub,Ruby,Rai" comma separated strings to assist search
  tokens:   String,

  meta:     Shared.PageMeta,

  soId:     { type: String, trim: true,
            lowercase: true, unique: true, sparse: true },

  so: {},

  ghId: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  gh: {},

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
      tokens: 2000,
      name: 1000,
      short: 400,
      desc: 10,
    },
    name: "TagTextIndex"
  }
)


module.exports = mongoose.model('Tag', tagSchema)
