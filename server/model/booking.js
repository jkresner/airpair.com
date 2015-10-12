var {Survey,UserByte} = require("./../models/_shared")


module.exports = ({ Id, Enum, Touch, Note },
  { asSchema, required, trim, index, lowercase }) => {


var Recording = {
  type:             { type: String, required, lowercase, trim },
  hangoutUrl:       { type: String, required },
  youTubeAccount:   { type: String, required },
  data:             {} // YouTube's API response
}


var Participant = {
  role:         { type: String, required, enum:Enum.BOOKING.ATTENDEE_TYPE },
  info:         UserByte,
  location:     { type: String },
  timeZoneId:   { type: String },
  chat: {
    slack:      { id: { type: String }, name: { type: String } }
  }
}

var SuggestedTime = asSchema({
  time:           { type: Date, required },
  byId:           { type: Id, ref: 'User', required },
  confirmedById:  { type: Id, ref: 'User' },
})

return asSchema({

  createdById:    { type: Id, ref: 'User', index, required }, // Could be initiated by the expert or customer
  customerId:     { type: Id, ref: 'User', index, required },
  expertId:       { type: Id, ref: 'Expert', index },
  participants:   [Participant],
  type:           { type: String, required, enum: Enum.BOOKING.TYPE },
  minutes:        { type: Number, required },
  status:         { type: String, required, enum: Enum.BOOKING.STATUS },  // pending, confirmed, declined
  datetime:       { type: Date, required, index },
  suggestedTimes: [SuggestedTime],
  gcal:           {},
  recordings:     [Recording],
  orderId:        { type: Id, ref: 'Order', required },
  chatId:         { type: Id, ref: 'Chat' },
  notes:          [Note],

  lastTouch:      Touch,
  activity:       [Touch],

  // save different survey 'type' for customers & experts
  // reviews:        [Survey]

})

}
