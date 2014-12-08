var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var type = ['enterpise','individual','startup','smb']


var Member = new Schema({
  userId:        { type: ObjectId, ref: 'User', index: true, required: true },
  name:          { type: String, required: true },
  companyEmail:  { type: String, required: true },
  enabled:       { type: String, required: true, default: true }
})



module.exports = mongoose.model('Company', new Schema({

  name:         { type: String, required: true },
  url:          { type: String },
  about:        { type: String },
  type:         { type: String, required: true, enum: type },
  adminId:      { type: ObjectId, ref: 'User', index: true, sparse: true },
  contacts:     { type: [] },         //-- v0 need to migrate and remove
  members:      { type: [Member] }    //-- Members belonging to the company

}))
