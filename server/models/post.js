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
  ogUrl:        { type: String, lowercase: true, trim: true }
  // reviewTeamId: { type: String, unique: true, sparse: true}
};

var Author = {
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  expertId:     { type: ObjectId, ref: 'Expert' },
  name:         { required: true, type: String },
  avatar:       { required: true, type: String },
  bio:          { required: true, type: String },
  username:     { type: String, lowercase: true },
  social:       { type: Shared.SocialAccounts }
}

var Github =    {
  repoInfo:     {
    reviewTeamId:   { type: String },
    authorTeamId:   { type: String },
    owner:          { type: String },
    author:         { type: String },
    url:            { type: String, lowercase: true}
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
  meta:             Meta,
  tmpl:             { type: String, enum: tmplType },

  editHistory:     [Shared.Touch],
  publishHistory:  [PublishEvent],

}))
