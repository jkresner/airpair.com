module.exports = ({ Id, Enum, Touch, Reftag, Note },
  { asSchema, required, trim, lowercase, unique, sparse }) => {


var DealSchema = asSchema({
  lastTouch:      Touch,
  expiry:         { type: Date, required },     // used as a flag that the deal is not longer available
  price:          { type: Number, required },
  minutes:        { type: Number, required },
  type:           { type: String, required, lowercase, enum: Enum.EXPERT.DEAL_TYPE },
  description:    { type: String },
  rake:           { type: Number, required },  // allow the expert commission deals
  tag:            Reftag,
  target:         {
    type:         { type: String, required, enum: Enum.EXPERT.DEAL_TARGET_TYPE },
    objectId:     { type: Id },   // userId || companyId || code (required)
    //-- if !objectId, then the deal is available to everyone
  },
  code:           { type: String, unique, sparse, trim, lowercase },
  redeemed:       [{
    orderId:      { type: Id, ref: 'Order', required },
    by: {
      _id:        { type: Id, ref: `User` },
      name:       { type: String }
    }
  }],
  activity:       [Touch]   // updates + views + (expert) shares
})


var ExpertSchema = asSchema({

  userId:         { type: Id, ref: 'User', unique, required },
  pic:            { type: String },

  lastTouch:      Touch,
  activity:       [Touch],

  rate:           { type: Number },
  brief:          { type: String },
  tags:           { type: [Reftag] },
  gmail:          { type: String },

  user:           {},

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

  deals:          [DealSchema],

  availability:   {
    // lastTouch:    Touch,
    status:       String,
    busyUntil:    { type: Date },
    times:        { type: String },
    minRate:      { type: Number },
    hours:        { type: String }
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
      last10:     [{replied:Date,status:String,comment:String,requestId:Id}]
    },
    experience:   {
      hours:      Number,
      customers:  Number,
      workshops:  [{workshopId:Id,url:String}],
      posts:      [{postId:Id,url:String}],
      last10:     [{_id:Id,status:String,datetime:Date,participants:[]}],
    },
    internal:     {
      weight:     Number, // allow staff to boost experts
      incident:   [{requestId:Id,comment:String,severity:Number}]
    }
  },

  notes:          { type: [Note] },

  // deprecated other
  bookMe:         {}

  // reviews:        [Shared.Survey]

})

// Does not work errrr.
ExpertSchema.index({'_id':1,'reviews.by._id':1},{ unique, sparse })


return ExpertSchema

}

// var UserCopy = {
//   _id:              { unique: true, sparse: true, required: true, type: ObjectId, ref: 'User' },
//   email:            { type: String, unique: true, sparse: true, trim: true, lowercase: true },
//   emailVerified:    { type: Boolean, required: true, default: false },
//   name:             { type: String, trim: true },
//   bio:              { type: String },
//   initials:         { type: String, lowercase: true, trim: true },
//   username:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
//   localization:     { location: String, timezone: String },
//   social:       {
//     gh: {
//       username:       { type: String },
//       _json: {
//         avatar_url:   { type: String },
//         public_repos: { type: Number },
//         public_gists: { type: Number },
//         followers:    { type: Number },
//       }
//     },
//     so: {
//       link:           { type: String },
//       reputation:     { type: String },
//       badge_counts:   { type: {} }
//     },
//     bb: {
//       username:       { type: String } },
//     in: {
//       id:             { type: String } },
//     tw: {
//       username:       { type: String },
//       _json: {
//         description:  { type: String },
//         followers_count: { type: String }
//       }
//     },
//     al: {
//       username:       { type: String } },
//     gp: {
//       id:             { type: String },
//       _json: {
//         picture:      { type: String },
//       }
//     }
//   }
// }


// var Bookme = {

//   enabled:        { required: true, type: Boolean    },  // allow us or the expert to turn themselves off
//   urlSlug:        { required: true, type: String, index: true }, // https://www.airpair.com/@domenic (urlSlug == 'domnic')
//   noIndex:        { type: Boolean, default: false    },  // no index for crawlers
//   rate:           { required: true, type: Number     },  // experts external rate
//   rake:           { required: true, type: Number     },  // allow the expert commission deals
//   coupons:        [{}],                                  // allow the expert to hand out promotions
//   urlBlog:        String,                                // www.airpair.com/node.js/expert-training-domenic-denicola
//   youTubeId:      String,                                // youtube movie
//   // creditRequestIds: { type: [ObjectId] },  # Requests that credits can be applied for

// }

