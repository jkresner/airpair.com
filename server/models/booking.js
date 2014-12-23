var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var VALID_BOOKING_TYPES = ['opensource', 'private', 'nda', 'offline', 'chat']

var Recording = {
  type: { required: true, type: String },
  data: { required: true, type: {} } // YouTube's API response
}

module.exports = mongoose.model('Booking', new mongoose.Schema({

  customerId:    { required: true, type: ObjectId, ref: 'User', index: true },
  expertId:      { required: true, type: ObjectId, ref: 'Expert', index: true },
  type:          { required: true, type: String, enum: VALID_BOOKING_TYPES },
  minutes:       { required: true, type: Number },
  createdById:   { required: true, type: ObjectId, ref: 'User', index: true }, // Could be initiated by the expert or customer
  status:        { required: true, type: String },  // pending, confirmed, declined
  datetime:      { required: true, type: Date, index: true },
  gcal:          { required: true, type: {} },
  recordings:    { required: false, type: [Recording], default: [] },
  orderId:       { required: true, type: ObjectId, ref: 'Order' }
  // notes:         { required: true, type: String }

  // customerReview:   {}   # Customer's feedback on how the session went
  // customerShare:    {}   # Tacking Customer sharing activity
  // postId:           {}   # title, transcript, expertMeta, customerMeta
  // airpairRating:    { type: Number }  # How we sort session by awesomeness
}))


