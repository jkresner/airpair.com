var mongoose = require('mongoose')
var Shared = require('./_shared')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var lineType = ['airpair','post'] //,'social','referral','adjustment'

var PayoutLine = {

  order: {
    _id:         { required: true, type: ObjectId, ref: 'Order' },
    by:          { required: true, type: {} },
    lineItemId:  { required: true, type: ObjectId, ref: 'LineItem' },
  },
  total:            { required: true, type: Number },  // Amount paid outs
  info:             { required: true, type: {} }, // Copy of original order.lineItem.info
  type:             { required: true, type: String, enum: lineType }

}

module.exports = mongoose.model('Payout', new Schema({

  // The user the payout belongs to
  userId:         { required: true, type: ObjectId, ref: 'User' },

  //
  lines:          { required: true, type: [PayoutLine] },

  // Total amount paid out
  total:          { required: true, type: Number },

  // How it was paid out
  payMethodId:    { required: true, type: ObjectId, ref: 'PayMethod' },

  // Info on payment
  payment:        { required: true, type: {} }

  // fee ?

}))
