module.exports = ({ Id, Enum, Reftag, Log, Act },
  { asSchema, required, trim, lowercase, unique, sparse }) =>


asSchema({

  userId:         { type: Id, ref: 'User', unique, required },

  //-- legacy
  // lastTouch:      Touch,
  // activity:       [Touch],
  // notes:          { type: [Note] },
  //-- new
  log:            Log,

  rate:           { type: Number },
  brief:          { type: String },
  tags:           { type: [Reftag] },
  gmail:          { type: String },

  deals:            { required: false, type: {}},

  availability: {
    updated:        { type: Act },
    status:         { type: String },
    busyUntil:      { type: Date },
    times:          { type: String },
    minRate:        { type: Number },
    hours:          { type: String }
  },

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
  }
})
