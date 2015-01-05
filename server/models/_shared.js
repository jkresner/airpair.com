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
  'received',
  'review'
]


var Message = new Schema({
  type:         { require:true, type: String, enum: [MESSAGE_TYPE] },
  subject:      { require:true, type: String },
  body:         { require:true, type: String },
  fromId:       { require:true, type: ObjectId, ref: 'User' },
  toId:         { require:true, type: ObjectId, ref: 'User' }
})


var UserByte = {
  _id:        { type: ObjectId, ref: 'User' },
  name:       String,
  email:      { type: String, lowercase: true } // We can use the email to infalte the avatar
}



module.exports = {Touch,Message,UserByte}
