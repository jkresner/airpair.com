module.exports = ({ Id, Enum, Touch, Reftag },
  { asSchema, required, trim, index, sparse }) => {


var Suggestion = asSchema({
  // events:             [{}]
  expert: {
    _id:         { type: Id, ref: 'Expert', required },
    userId:      { type: Id, ref: 'User', required },
    name:        { type: String, required },
    email:       { type: String, required },
    gmail:       { type: String, required },
    username:    { type: String, required },
    rate:        { type: Number, required },
    location:    { type: String },
    timezone:    { type: String },
    tags:        { type: [Reftag] },
    gh:          { username: String },
    so:          { link: String },
    bb:          { id: String },
    in:          { id: String },
    tw:          { username: String }
  },
  // expertRating:       Number,
  // expertFeedback:     String
  reply:         {
    time:        { type: Date }
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

var admMeta = {
  active:         { type: Boolean, index, sparse },
  owner:          { type: String },
  lastTouch:      { type: Touch, required },
  submitted:      { type: Date },
  received:       { type: Date },
  farmed:         { type: Date },
  reviewable:     { type: Date },
  booked:         { type: Date },
  paired:         { type: Date },
  feedback:       { type: Date },
  closed:         { type: Date },
}

return asSchema({

  userId:           { type: Id, ref: 'User', required, index },
  by:               {},
  type:             { type: String, required, enum: Enum.REQUEST.TYPE },
  tags:             { type: [Reftag] },
  experience:       { type: String, enum: Enum.REQUEST.EXPERIENCE },
  brief:            { type: String },
  hours:            { type: String },
  time:             { type: String, enum: Enum.REQUEST.TIME },
  budget:           { type: Number },
  status:           { type: String, required, enum: Enum.REQUEST.STATUS },
  suggested:        { type: [Suggestion] },
  adm:              { type: admMeta, required: false },
  messages:         { type: [{}] }, // {type:[Message]}, // TODO, un-nest this
  title:            { type: String },
  canceledDetail:   { type: String },
  lastTouch:        { type: Touch, required: false },

})

}

