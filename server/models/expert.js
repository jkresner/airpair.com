var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var Shared = require("./_shared")


var DEAL_TYPE = ['airpair', 'offline', 'code-review', 'article', 'workshop']
var DEAL_TARGET_TYPE = ['all','user','company','newsletter','past-customers','code']


//-- If userIds.length == 0, then the deal is available to everyone
var Deal = new Schema({
  lastTouch:      Shared.Touch,
  expiry:         { type: Date },     // used as a flag that the deal is not longer available
  price:          { required: true, type: Number },
  minutes:        { required: true, type: Number },
  type:           { required: true, lowercase: true, type: String, enum: DEAL_TYPE },
  description:    { type: String },
  rake:           { required: true, type: Number },  // allow the expert commission deals
  tag:            {
    _id:          { type: ObjectId, ref: 'Tag' },
  },
  target:         {
    type:         { required: true, type: String, enum: DEAL_TARGET_TYPE },
    objectId:     { type: ObjectId },   // userId || companyId || code (required)
  },
  code:           { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  redeemed:       [{
    orderId:      { required: true, type: ObjectId, ref: 'Order' },
    by:           Shared.UserByte,
  }],
  activity:       [Shared.Touch]   // updates + views + (expert) shares
}, { strict: true })


var Bookme = {

  enabled:        { required: true, type: Boolean    },  // allow us or the expert to turn themselves off
  urlSlug:        { required: true, type: String, index: true }, // https://www.airpair.com/@domenic (urlSlug == 'domnic')
  noIndex:        { type: Boolean, default: false    },  // no index for crawlers
  rate:           { required: true, type: Number     },  // experts external rate
  rake:           { required: true, type: Number     },  // allow the expert commission deals
  coupons:        [{}],                                  // allow the expert to hand out promotions
  urlBlog:        String,                                // www.airpair.com/node.js/expert-training-domenic-denicola
  youTubeId:      String,                                // youtube movie
  // creditRequestIds: { type: [ObjectId] },  # Requests that credits can be applied for

}

var UserCopy = {
  _id:              { unique: true, sparse: true, required: true, type: ObjectId, ref: 'User' },
  email:            { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  emailVerified:    { type: Boolean, required: true, default: false },
  name:             { type: String, trim: true },
  bio:              { type: String },
  initials:         { type: String, lowercase: true, trim: true },
  username:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  localization:     { location: String, timezone: String },
  social:       {
    gh: {
      username:       { type: String },
      _json: {
        avatar_url:   { type: String },
        public_repos: { type: Number },
        public_gists: { type: Number },
        followers:    { type: Number },
      }
    },
    so: {
      link:           { type: String },
      reputation:     { type: String },
      badge_counts:   { type: {} }
    },
    bb: {
      username:       { type: String } },
    in: {
      id:             { type: String } },
    tw: {
      username:       { type: String },
      _json: {
        description:  { type: String },
        followers_count: { type: String }
      }
    },
    al: {
      username:       { type: String } },
    gp: {
      id:             { type: String },
      _json: {
        picture:      { type: String },
      }
    }
  }
}


//-- Need to fix this guy
var TagSlim = {
  _id:          { required: true, type: String}, //, type: ObjectId, ref: 'Tag'
  sort:         { type: Number }, //, required: true
}

module.exports = mongoose.model('Expert', new Schema({

  userId:         { unique: true, required: true, type: ObjectId, ref: 'User' },
  pic:            { type: String },

  lastTouch:      Shared.Touch,
  activity:       [Shared.Touch],

  rate:           Number,
  brief:          String,
  tags:           [TagSlim],
  gmail:          { type: String },

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

  deals:          [Deal],

  availability:   {
    lastTouch:    Shared.Touch,
    status:       String,
    busyUntil:    { type: Date },
    times:        String,
    minRate:      Number,
    hours:        String
  },

  // deprecated v0 settings props
  minRate:        Number,
  // status:         String,
  // availability:   String,
  // hours:          String,
  // busyUntil:      { type: Date, default: Date },
  // updatedAt:      { type: Date, default: Date },

  // to get rid of
  // matching
  mojo:           { required: true, type: Number, default: 0 },
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
      posts:      [{postId:ObjectId,url:String}],
      last10:     [{_id:ObjectId,status:String,datetime:Date,participants:[]}],
    },
    internal:     {
      weight:     Number, // allow staff to boost experts
      incident:   [{requestId:ObjectId,comment:String,severity:Number}]
    }
  },

  // deprecated other
  bookMe:         { required: false, type: Bookme },

}))




// migrate 2015.03.29
// db.experts.update({ karma: { $exists:1 } },{ $unset: { karma: "" } },{ 'multi': true })
// db.experts.update({ other: { $exists:1 } },{ $unset: { other: "" } },{ 'multi': true })
// db.experts.update({ stats: { $exists:1 } },{ $unset: { stats: "" } },{ 'multi': true })

// db.experts.update({ busyUntil: { $exists:1 } },{ $unset: { busyUntil: "" } },{ 'multi': true })
// db.experts.update({ updatedAt: { $exists:1 } },{ $unset: { updatedAt: "" } },{ 'multi': true })
// db.experts.update({ availability: { $exists:1 } },{ $set: { availability: {} } },{ 'multi': true })

// db.experts.update({ status: { $exists:1 } },{ $rename: { 'status':'availability.status' } },{ 'multi': true })
// db.experts.update({ status: { $exists:1 } },{ $unset: { status: "" } },{ 'multi': true })
// db.experts.update({ minRate: { $exists:1 } },{ $rename: { 'minRate':'availability.minRate' } },{ 'multi': true })
// db.experts.update({ minRate: { $exists:1 } },{ $unset: { minRate: "" } },{ 'multi': true })
// db.experts.update({ hours: { $exists:1 } },{ $rename: { 'hours':'availability.hours' } },{ 'multi': true })
// db.experts.update({ hours: { $exists:1 } },{ $unset: { hours: "" } },{ 'multi': true })


