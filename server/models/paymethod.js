var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var methodType = ['stripe','braintree','paypal']


module.exports = mongoose.model('PayMethod', new mongoose.Schema({

  name: 			{ type: String, required: true }, // to help users choose between methods at purchase
  type: 			{ type: String, required: true, enum: methodType },
  info:   		{ type: {}, required: true },
  userId: 		{ type: ObjectId, ref: 'User', index: true, sparse: true },
  companyId: 	{ type: ObjectId, ref: 'Company', index: true, sparse: true }

}))
