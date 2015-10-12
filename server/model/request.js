var Shared = require('../models/_shared')

module.exports = ({ Id, Enum, Touch, Reftag },
  { asSchema, required, trim, index, sparse }) => {


var Suggestion = asSchema({
  // events:             [{}]
  expert: {
    _id:         { required: true, type: Id, ref: 'Expert' },
    userId:      { required: true, type: Id, ref: 'User' },
    name:        { required: true, type: String },
    email:       { required: true, type: String },
    gmail:       { required: true, type: String },
    username:    { required: true, type: String },
    rate:        { required: true, type: Number },
    location:    { type: String },
    timezone:    { type: String },
    tags:        [Reftag],
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
  expertStatus:       { type: String, required, enum: Enum.REQUEST.REPLY_STATUS, default: 'waiting' },
  expertAvailability: String,    // todo change to dates
  expertComment:      String,
  suggestedRate:      {},           // can be altered by admin or expert
  // customerRating:     Number,    // Survey customer on qaulity of rating
  // customerFeedback:   String,
  matchedBy:          {}

  // v0 should migrate for experts algorithm
  //events:            [{}]
})


return asSchema({

  userId:           { required: true, type: Id, ref: 'User', index: true },
  by:               {},
  type:             { required: true, type: String, enum: Enum.REQUEST.TYPE },
  tags:             [Reftag],
  experience:       { type: String, enum: Enum.REQUEST.EXPERIENCE },
  brief:            { type: String   },
  hours:            { type: String   },
  time:             { type: String, enum: Enum.REQUEST.TIME },
  budget:           { type: Number   },
  status:           { required: true, type: String, enum: Enum.REQUEST.STATUS },
  suggested:        [Suggestion],
  adm:              {
    active:         { type: Boolean, index, sparse },
    owner:          String,
    lastTouch:      Touch,
    submitted:      { type: Date },
    received:       { type: Date },
    farmed:         { type: Date },
    reviewable:     { type: Date },
    booked:         { type: Date },
    paired:         { type: Date },
    feedback:       { type: Date },
    closed:         { type: Date },
  },
  // messages:         [Shared.Message],  // TODO, un-nest this
  messages:         [{}],  // TODO, un-nest this
  title:            String,
  canceledDetail:   String,
  lastTouch:        Touch,

})

}

