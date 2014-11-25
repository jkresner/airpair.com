var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var lineType = [
  //-- By $1000, use it how you like before it expires
  'credit',

  //-- Transaction that cosumes amount of transaction immediately
  'payg',

  //-- Buy a block of hours with specific experts
  'package',

  //-- Time with an expert, can be redeemed using credit or payg
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
  total:            { required: true, type: Number },  // Amount paid by customer
  balance:          { required: true, type: Number },  // Amount effecting customers balance
  profit:           { required: true, type: Number },  // Margin taken by AirPair
// balanceRemaining: { required: true, type: Number },  // Amount effecting customers balance

  info:             { required: true, type: {} }, // Amount effecting customers balance

  // backwards compatibal with v0
  suggestion:       { type: {} }

})

module.exports = mongoose.model('Order', new Schema({

  // The user the order belongs to
  userId:         { required: true, type: ObjectId, ref: 'User' },

  // The user that create the order (often same as userId, but can be an admin)
  by:             { required: true, type: {} },

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
  profit:         { required: true, type: Number }

  // legacy from v0
  // paymentStatus:  { required: true, type: String, default: 'pending' } # pending, received, paidout

}))
