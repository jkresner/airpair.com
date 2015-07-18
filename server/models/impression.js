var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

module.exports = mongoose.model('Impression', new mongoose.Schema({

  img:          { type: String, required: true },
  uId:          { type: ObjectId, ref: 'User', index: true, sparse: true },
  sId:          { type: String, ref: 'v1Session', index: true, sparse: true },
  ip:           { type: String, required: true },
  ref:          { type: String, required: true },
  ua:           { type: String }

}))
