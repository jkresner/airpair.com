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

	type:               { required: true, type: String, enum: lineType },
	total:              { required: true, type: Number },
	profit:             { required: true, type: Number },
	unitPrice:          { required: true, type: Number },
	qty:                { required: true, type: Number },
	info:         			{ required: true, type: {} }

})

module.exports = mongoose.model('Order', new Schema({

	userId:         { required: true, type: ObjectId, ref: 'User' },
	by:        			{ required: true, type: {} },
	lineItems:      { type: [LineItem] },
	utc:            { type: Date, 'default': Date },
	total:          { required: true, type: Number },
	profit:         { required: true, type: Number },
	payMethodId:    { required: true, type: ObjectId, ref: 'PayMethod' },
	payment:        { required: true, type: {} },
	// paymentStatus:  { required: true, type: String, default: 'pending' } # pending, received, paidout
	marketingTags:  { type: [{}], 'default': [] },
	owner:          { type: String, 'default': '' }

}))
