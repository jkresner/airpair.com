var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CHAT_TYPE = ['im','group']
var CHAT_PROVIDER = ['slack']


module.exports = mongoose.model('Chat', new Schema({

  synced:       { type: Date,   required: true },
  // lastMgs:      { type: Date,   required: true },
  type:         { type: String, required: true, enum: CHAT_TYPE },
  provider:     { type: String, required: true, enum: CHAT_PROVIDER },
  providerId:   { type: String, required: true, index: true, unique: true },
  info:         { type: {},     required: true },
  history:      { type: []      },
  // memberIds:    { type: [ObjectId], required: true },

}))


// migrate 2015.07.13
// db.chats.update({ adminId: { $exists:1 } },{ $unset: { adminId: "" } },{ 'multi': true })
