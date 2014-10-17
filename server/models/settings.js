var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

// Settings is a Legacy v0 collection right now.
module.exports = mongoose.model('Settings', new mongoose.Schema({

  userId: 				{ type: ObjectId, ref: 'User', index: true, sparse: true },
  paymentMethods: []

}))
