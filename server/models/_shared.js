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

module.exports = {Touch}
