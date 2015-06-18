var mongoose = require('mongoose')
var Shared = require('./_shared')
var {ObjectId} = mongoose.Schema



var Recording = {
  type: { required: true, lowercase: true, trim:true, type: String },
  hangoutUrl: {required: false, type: String},
  youTubeAccount: {required: false, type: String},
  data: { required: true, type: {} } // YouTube's API response
}

var ATTENDEE_TYPES = ['expert','customer']


var Participant = {
  role: { required: true, type: String, enum: ATTENDEE_TYPES },
  info: Shared.UserByte,
  location:  String,
  timezone:  String,
  chat: {
    slack: { id: { type: String }, name: { type: String } }
  }
}


var BOOKING_TYPES = [
  'opensource','private','offline','chat','workshop']


var BOOKING_STATUS = [
  'pending',    // waiting for both parties to confirm time
  'confirmed',  // time agreed
  'followup',   // waiting to get feedback from customer (? and expert)
  'complete',   // all done
  'canceled'    // e.g. if the session was to be refunded
]


module.exports = mongoose.model('Booking', new mongoose.Schema({

  customerId:    { required: true, type: ObjectId, ref: 'User', index: true },
  expertId:      { required: true, type: ObjectId, ref: 'Expert', index: true },
  participants:  { required: true, type: [Participant] },
  type:          { required: true, type: String, enum: BOOKING_TYPES },
  minutes:       { required: true, type: Number },
  createdById:   { required: true, type: ObjectId, ref: 'User', index: true }, // Could be initiated by the expert or customer
  status:        { required: true, type: String, enum: BOOKING_STATUS },  // pending, confirmed, declined
  datetime:      { required: true, type: Date, index: true },
  gcal:          { required: true, type: {} },
  recordings:    { type: [Recording], default: [] },
  orderId:       { required: true, type: ObjectId, ref: 'Order' },
  chatId:        { type: ObjectId, ref: 'Chat' },
  notes:         { type: [Shared.Note] }

  // customerReview:   {}   # Customer's feedback on how the session went
  // customerShare:    {}   # Tacking Customer sharing activity
  // postId:           {}   # title, transcript, expertMeta, customerMeta
  // airpairRating:    { type: Number }  # How we sort session by awesomeness
}))
