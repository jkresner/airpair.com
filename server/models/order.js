var mongoose = require('mongoose')
var Shared = require('./_shared')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var lineType = [
  //-- Transaction that cosumes amount of transaction immediately
  'payg',

  //-- By $1000, use it how you like before it expires
  'credit',

  'redeemedcredit',

  //-- Block of time with a specific expert
  'deal',

  'redeemeddealtime',

  //-- Time (Booking) with an expert, can be redeemed using credit, payg or time
  'airpair',

  //-- Rescheduling
  'fee',

  //-- Get benfits like discounts
  'membership',

  //-- Attend a webinar
  'ticket',

  //-- Use a coupon to pay leff
  'discount',

  //-- When we give money back
  'refund'
]


var LineItem = new Schema({

  type:             { required: true, type: String, enum: lineType },
  qty:              { required: true, type: Number },
  unitPrice:        { required: true, type: Number },  // Amount paid per unit

  profit:           { required: true, type: Number },  // Margin taken by AirPair

  total:            { required: true, type: Number },  // Amount paid by customer
  balance:          { required: true, type: Number },  // Amount effecting customers balance
// balanceRemaining: { required: true, type: Number }, // Amount effecting customers balance

  info:             { required: true, type: {} },      // Arbitrary info about the line item

  bookingId:        { type: ObjectId, ref: 'Booking' },

  suggestion:       { type: {} }   // backwards compatibal with v0
})

LineItem.index({'info.expert._id': 1},{name: "ExpertPayoutsIndex"})


module.exports = mongoose.model('Order', new Schema({

  _id:            { required: true, type: ObjectId },

  // The user the order belongs to
  userId:         { required: true, type: ObjectId, ref: 'User' },

  // The user that create the order (often same as userId, but can be an admin)
  by:             { required: true, type: Shared.UserByte },

  //
  lineItems:      { type: [LineItem] },

  // when the order was made
  utc:            { type: Date, 'default': Date },

  // Total amount paid by customer
  total:          { required: true, type: Number },

  // How it was paid for, if null probably credit given by an admin
  payMethodId:    { type: ObjectId, ref: 'PayMethod' },

  // Info on payment
  payment:        { required: true, type: {} },

  // Revenue attribution
  marketingTags:  { type: [{}], 'default': [] },

  // AirPair staff member watching the transaction
  owner:          { type: String, 'default': '' },

  //-- PAYG booking are calculated at time of purchase
  //-- Membership are calculated at time of purchase
  //-- Package orders always start with 0 and update as experts are booked or expires
  //-- Credit orders always 0 and updated as experts are booked or expires
  profit:         { required: true, type: Number },

  // Optionally link order to request
  requestId:      { type: ObjectId, ref: 'Request' }

  // legacy from v0
  // paymentStatus:  { required: true, type: String, default: 'pending' } # pending, received, paidout

}))
