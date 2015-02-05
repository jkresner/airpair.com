var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema
var Shared = require("./_shared")

var TagSlim = {
  _id:          { required: true, type: ObjectId, ref: 'Tag'},
  name:         { required: true, type: String, trim: true },
  slug:         { required: true, type: String, lowercase: true, trim: true },
  sort:         { type: Number   },
}

var Meta = {
  title:        { type: String },
  description:  { type: String },
  canonical:    { type: String, lowercase: true, trim: true },
  ogTitle:      { type: String },
  ogType:       { type: String },
  ogDescription:{ type: String },
  ogImage:      { type: String, trim: true },
  ogVideo:      { type: String, trim: true },
  ogUrl:        { type: String, lowercase: true, trim: true },
  reviewTeamId: { type: String, unique: true, sparse: true}
};

var Author = {
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  name:         { required: true, type: String },
  avatar:       { required: true, type: String },
  bio:          { required: true, type: String },
  username:     { type: String, lowercase: true }, // if they are an expert
  tw:           { type: String },
  gh:           { type: String },
  in:           { type: String },
  so:           { type: String },
  gp:           { type: String },
};

var Github = {
  repoInfo: {
    reviewTeamId: {type: String},
    authorTeamId: {type: String},
    owner: {type: String},
    author: {type: String},
    url: {type:String, lowercase: true}
  },
  events: Array,
  stats: Array //Object?
};

var Forker = new mongoose.Schema({
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  userAirPair: {type: Shared.UserByte},
  userGitHub: {
    username: {type: String}
    //more?
  }
})


var tmplType = ['post','blank'] //,'customsidebar']


// var PublishEvent = {
//   publishedBy:  { type: ObjectId, ref: 'User' },
//   publishedCommit: { type: {} }, // revised timestamp
// }

module.exports = mongoose.model('Post', new mongoose.Schema({

  by:           Author,
  created:      { required: true, type: Date, 'default': Date },
  updated:      { required: true, type: Date, 'default': Date },
  reviewReady:  { type: Date },

  published:    { type: Date }, // first time
  publishedBy:  { type: ObjectId, ref: 'User' },
  publishedCommit: { type: {} }, // revised timestamp
  lastUpdated:  { type: Date }, // lasttime timestamp of update

  reviews:      { type: Array },
  forkers:      { type: [Forker] },
  github:       Github,
  slug:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  title:        { required: true, type: String, trim: true },
  md:           { required: true, type: String },
  assetUrl:     { type: String, trim: true },
  tags:         { type: [TagSlim], 'default': [] },
  meta:         Meta,
  tmpl:         { type: String, enum:tmplType }

}))
