var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

// Legacy v0 collections
module.exports = {

	Settings: mongoose.model('Settings', new mongoose.Schema({

	  userId: 				{ type: ObjectId, ref: 'User', index: true, sparse: true },
	  paymentMethods: []

	})),

}
