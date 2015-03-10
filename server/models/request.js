var mongoose = require('mongoose')
var Shared = require('./_shared')
var Schema = mongoose.Schema
var {ObjectId} = Schema


var REPLY_STATUS = ['waiting','opened','busy','abstained','underpriced','available','chosen','released']


var Suggestion = new Schema({
  // events:             [{}]
  expert: {
    _id:         { required: true, type: ObjectId, ref: 'Expert' },
    userId:      { required: true, type: ObjectId, ref: 'User' },
    name:        { required: true, type: String },
    email:       { required: true, type: String },
    gmail:       { required: true, type: String },
    rate:        { required: true, type: Number },
    location:    { type: String },
    timezone:    { type: String },
    tags:        { type: [TagSlim] },
    gh:          { username: String },
    so:          { link: String },
    bb:          { id: String },
    in:          { id: String },
    tw:          { username: String }
  },
  // expertRating:       Number,
  // expertFeedback:     String
  reply:         {
    time:        Date
  },
  //-- TODO, move these guys into the reply object
  expertStatus:       { required: true, enum: REPLY_STATUS, type: String, default: 'waiting' },
  expertAvailability: String,    // todo change to dates
  expertComment:      String,
  suggestedRate:      {},           // can be altered by admin or expert
  // customerRating:     Number,    // Survey customer on qaulity of rating
  // customerFeedback:   String,
  matchedBy:          {}

  // v0 should migrate for experts algorithm
  //events:            [{}]
})


var TagSlim = new Schema({
  _id:          { required: true, type: ObjectId, ref: 'Tag'},
  slug:         { type: String, required: true },
  sort:         { type: Number, required: true },
})


var V0_REQUEST_STATUS = [

  //v1
  'received',       //: requires review by airpair
  'waiting',        //: no experts available yet
  'review',         //: customer must review & choose one or more experts
  'booked',      //: one or more calls already scheduled
  'consumed',       //: feedback on all calls collected, but lead still warm for up-sell
  'complete',       //: transaction final and time to archive
  'canceled',       //: company has canceled the request
  'deferred',       //: customer indicated they need more time
  'junk',

  //v0
  'holding',        //: waiting for go ahead by customer
  'scheduling',     //: call needs to be scheduled
  'scheduled',      //: one or more calls already scheduled
  'incomplete',     //: more detail required
  'pending',        //: [bookme] customer put in request and expert has to confirm
]


var REQUEST_TYPE = [
  'troubleshooting',
  'mentoring',
  'code-review',
  'resources',
  'advice',
  'vetting',
  'other'
]


var REQUEST_EXPERIENCE = [
  'beginner',
  'proficient',
  'advanced'
]


var REQUEST_TIME = [
  'regular',
  'rush',
  'later'
]

var Request = new Schema({

  userId:           { required: true, type: ObjectId, ref: 'User', index: true },
  by:               {},
  type:             { required: true, type: String, enum: REQUEST_TYPE },
  tags:             [TagSlim],
  experience:       { type: String, enum: REQUEST_EXPERIENCE },
  brief:            { type: String   },
  hours:            { type: String   },
  time:             { type: String, enum: REQUEST_TIME },
  budget:           { type: Number   },

  status:           { required: true, type: String, enum: V0_REQUEST_STATUS },
  suggested:        [Suggestion],
  adm:              {
    active:         { type: Boolean, index: true, sparse: true },
    owner:          String,
    lastTouch:      Shared.Touch,
    // newcustomer:    String,
    submitted:      { type: Date },
    received:       { type: Date },
    farmed:         { type: Date },
    reviewable:     { type: Date },
    booked:         { type: Date },
    paired:         { type: Date },
    feedback:       { type: Date },
    closed:         { type: Date },
  },
  messages:        [Shared.Message],  // TODO, un-nest this
  title:            String,
  canceledDetail:   String,
  lastTouch:        Shared.Touch,
  // New v1

  //company:          { required: true, type: {} }
  // contacts { userId, fullName, email }

  marketingTags:    { type: [{}], default: [] },

  // v0 used for expert stats need to migrate to booking
  calls:            [{}]

})

module.exports = mongoose.model('Request', Request)


// v0 attrs
// availability:     String
// timezone:         String
// calls:            [Call]
// incompleteDetail: String
// pricing:          { required: true, type: String, enum: VALID_CALL_TYPES   }
