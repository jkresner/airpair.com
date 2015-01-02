var mongoose = require('mongoose')
var Schema = mongoose.Schema
var {ObjectId} = Schema

var Touch = {
  utc:          { type: Date },
  action:       String,
  by:           {
    _id:        { type: ObjectId, ref: 'User' },
    name:       String
  }
}


var MESSAGE_TYPE = [
  'adm_received'
]


var Message = new Schema({
  type:         { require:true, type: String, enum: [MESSAGE_TYPE] },
  subject:      { require:true, type: String },
  body:         { require:true, type: String },
  fromId:       { require:true, type: ObjectId, ref: 'User' },
  toId:         { require:true, type: ObjectId, ref: 'User' }
})


module.exports = {Touch,Message}
