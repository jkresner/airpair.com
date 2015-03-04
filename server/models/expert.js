var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var Shared = require("./_shared")

var Coupon = {
  code:           { required: true, type: String },
  rate:           { required: true, type: Number }
}

var Bookme = {

  enabled:        { required: true, type: Boolean    },  // allow us or the expert to turn themselves off
  urlSlug:        { required: true, type: String, index: true }, // https://www.airpair.com/@domenic (urlSlug == 'domnic')
  noIndex:        { type: Boolean, default: false    },  // no index for crawlers
  rate:           { required: true, type: Number     },  // experts external rate
  rake:           { required: true, type: Number     },  // allow the expert commission deals
  coupons:        [Coupon],                              // allow the expert to hand out promotions
  urlBlog:        String,                                // www.airpair.com/node.js/expert-training-domenic-denicola
  youTubeId:      String,                                // youtube movie
  // creditRequestIds: { type: [ObjectId] },  # Requests that credits can be applied for

}

var UserCopy = {
  _id:              { unique: true, required: true, type: ObjectId, ref: 'User' },
  email:            { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  emailVerified:    { type: Boolean, required: true, default: false },
  name:             { type: String, trim: true },
  initials:         { type: String, lowercase: true, trim: true },
  username:         { type: String, lowercase: true, trim: true },
  localization:     { location: String, timezone: String },
  social:       {
      gh: {     username: { type: String } },
      so: {     link: { type: String } },
      bb: {     username: { type: String } },
      in: {     id: { type: String } },
      tw: {     username: { type: String } },
      al: {     username: { type: String } },
      gp: {     id: { type: String } }
  }
}

module.exports = mongoose.model('Expert', new Schema({

  userId:         { unique: true, required: true, type: ObjectId, ref: 'User' },

  lastTouch:      Shared.Touch,
  actvity:        [Shared.Touch],

  rate:           Number,
  brief:          String,
  tags:           [{}],
  gmail:          { type: String },
  pic:            { type: String },

  user:           UserCopy,
  // deprecated v0 user props
  name:           { type: String },
  username:       { type: String },
  email:          { type: String },
  timezone:       String,
  location:       String,
  homepage:       String,
  gp:             {},          // googleplus
  gh:             {},          // github
  so:             {},          // stackoverflow
  bb:             {},          // bitbucket
  in:             {},          // linkedIn
  tw:             {},          // twitter

  settings:       {},
  // deprecated v0 settings props
  minRate:        Number,
  status:         String,
  availability:   String,
  hours:          String,
  busyUntil:      { type: Date, default: Date },
  updatedAt:      { type: Date, default: Date },

  // matching
  karma:          { required: true, type: Number, default: 0 },
  matching:       {
    replies:      {
      suggested:  Number,
      replied:    Number,
      lastSuggest:Date,
      lastReply:  Date,
      last10:     [{replied:Date,status:String,comment:String,requestId:ObjectId}]
    },
    experience:   {
      hours:      Number,
      customers:  Number,
      workshops:  [{workshopId:ObjectId,url:String}],
      posts:      [{postId:ObjectId,url:String}]
    },
    internal:     {
      weight:     Number, // allow staff to boost experts
      incident:   [{requestId:ObjectId,comment:String,severity:Number}]
    }
  },

  // deprecated other
  bookMe:         { required: false, type: Bookme },

}))
