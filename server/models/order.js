var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var lineType = [
  'membership',
  'ticket',
  'credit',
  'payg',
  'fee',
  'discount',
  'refund',
  'airpair'
]


var LineItem = new Schema({

  type:           { required: true, type: String, enum: lineType },
  qty:            { required: true, type: Number },
  total:          { required: true, type: Number },  // Amount paid by customer
  unitPrice:      { required: true, type: Number },  // Amount paid per unit
  profit:         { required: true, type: Number },  // Margin taken by AirPair
  balance:        { required: true, type: Number },  // Amount effecting customers balance
  info:           { required: true, type: {} },

  suggestion:     { type: {} } // backwards compatibal with v0

})

module.exports = mongoose.model('Order', new Schema({

  userId:         { required: true, type: ObjectId, ref: 'User' }, // The user the order belongs to
  by:             { required: true, type: {} }, // The user that create the order (can be an admin)
  lineItems:      { type: [LineItem] },
  utc:            { type: Date, 'default': Date },
  total:          { required: true, type: Number },
  profit:         { required: true, type: Number },
  payMethodId:    { type: ObjectId, ref: 'PayMethod' },
  payment:        { required: true, type: {} },
  // paymentStatus:  { required: true, type: String, default: 'pending' } # pending, received, paidout
  marketingTags:  { type: [{}], 'default': [] },
  owner:          { type: String, 'default': '' }

}))
