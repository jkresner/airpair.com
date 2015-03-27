var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema
var Shared = require("./_shared")

var TagSlim = {
  _id:          { required: true, type: ObjectId, ref: 'Tag'},
  name:         { required: true, type: String, trim: true },
  slug:         { required: true, type: String, lowercase: true, trim: true },
  sort:         { type: Number   },
}

var Author = {
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  expertId:     { type: ObjectId, ref: 'Expert' },
  name:         { required: true, type: String },
  avatar:       { required: true, type: String },
  bio:          { required: true, type: String },
  username:     { type: String, lowercase: true },
  social:       {
      gh: {     username: { type: String } },
      so: {     link: { type: String } },
      bb: {     username: { type: String } },
      in: {     id: { type: String } },
      tw: {     username: { type: String } },
      al: {     username: { type: String } },
      gp: {     link: { type: String } }
  }
}

var StatsSummary = {
  rating:           { type: Number },
  reviews:          { type: Number },
  comments:         { type: Number }, // includes reviews & replies
  forkers:          { type: Number },
  acceptedPRs:      { type: Number },
  closedPRs:        { type: Number },
  openPRs:          { type: Number },
  shares:           { type: Number },
  words:            { type: Number },
}

var Github =    {
  repoInfo:     {
    // reviewTeamId:   { type: String },
    authorTeamId:   { type: String },
    // owner:          { type: String },
    authorTeamName: { type: String },
    author:         { type: String },
    url:            { type: String, lowercase: true },
    // SHA of file ?
  },
  events: Array,
  stats: Array //Object?
}

var Forker = new mongoose.Schema({
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  name:         { type: String, trim: true },
  email:        { type: String, trim: true, lowercase: true },
  social:       {
    gh:         { username: { type: String } }
  }
})


var tmplType = ['post','blank','landing','faq'] //,'customsidebar']


var PublishEvent = new mongoose.Schema({
  touch:        { type: Shared.Touch },
  commit:       { type: {} }, // sha hash
})


module.exports = mongoose.model('Post', new mongoose.Schema({

  by:               Author,
  created:          { required: true, type: Date, 'default': Date },

  lastTouch:        Shared.Touch,
  //-- consider removing 'updated' as supersceded by lastTouch
  updated:          { required: true, type: Date, 'default': Date },

  submitted:        { type: Date },

  published:        { type: Date }, // first time
  publishedBy:      { type: Shared.UserByte },
  publishedCommit:  { type: {} }, // sha hash or whole commit object
  publishedUpdated: { type: Date }, // lasttime timestamp of update

  reviews:          { type: [Shared.Survey] },
  forkers:          { type: [Forker] },
  github:           { required: false, type: Github },
  slug:             { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  title:            { required: true, type: String, trim: true },
  md:               { required: true, type: String },
  assetUrl:         { type: String, trim: true },
  tags:             { type: [TagSlim], 'default': [] },
  tmpl:             { type: String, enum: tmplType },
  meta:             Shared.PageMeta,

  editHistory:      [Shared.Touch],
  publishHistory:   [PublishEvent],

  stats:            StatsSummary

}))
