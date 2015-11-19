module.exports = ({ Id, Enum, Touch, Reftag, Note, Meta },
  { asSchema, required, trim, lowercase, unique, sparse }) => {


var DealSchema = asSchema({
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

  //-- legacy
  lastTouch:      Touch,
  activity:       [Touch],   // updates + views + (expert) shares

})


var ExpertSchema = asSchema({

  userId:         { type: Id, ref: 'User', unique, required },

  //-- legacy
  lastTouch:      Touch,
  activity:       [Touch],
  //-- new
  meta:           Meta,

  rate:           { type: Number },
  brief:          { type: String },
  tags:           { type: [Reftag] },
  gmail:          { type: String },

  // user:           {},

  // deprecated v0 user props
  // pic:            { type: String },
  // name:           { type: String },
  // username:       { type: String },
  // email:          { type: String },
  // timezone:       String,
  // location:       String,
  // homepage:       String,
  // gp:             {},          // googleplus
  // gh:             {},          // github
  // so:             {},          // stackoverflow
  // bb:             {},          // bitbucket
  // in:             {},          // linkedIn
  // tw:             {},          // twitter

  deals:            [DealSchema],

  availability: {
    updated:        { type: Touch },
    status:         { type: String },
    busyUntil:      { type: Date },
    times:          { type: String },
    minRate:        { type: Number },
    hours:          { type: String }
  },

  // deprecated v0 settings props
  // minRate:        Number,
  // status:         String,
  // availability:   String,
  // hours:          String,
  // busyUntil:      { type: Date, default: Date },
  // updatedAt:      { type: Date, default: Date },

  // to get rid of
  // matching
  mojo:           { required: true, type: Number, default: 0 },
  matching: {
    replies: {
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
  // bookMe:         {}

  // reviews:        [Shared.Survey]

})

// Does not work errrr.
// ExpertSchema.index({'_id':1,'reviews.by._id':1},{ unique, sparse })


return ExpertSchema

}
