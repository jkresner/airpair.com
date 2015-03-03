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
  'review',
  'generic',
  'cancelfromwaiting'
]


var PageMeta = {
  title:        { type: String },
  description:  { type: String },
  canonical:    { type: String, lowercase: true, trim: true },
  ogTitle:      { type: String },
  ogType:       { type: String },
  ogDescription:{ type: String },
  ogImage:      { type: String, trim: true },
  ogVideo:      { type: String, trim: true },
  ogUrl:        { type: String, lowercase: true, trim: true }
};


var Message = new Schema({
  type:         { require:true, type: String, enum: MESSAGE_TYPE },
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

var SocialAccounts = {
  tw: {},
  so: {},
  gh: {},
  in: {},
  bb: {},
  al: {},
  gp: {},
}


var Survey = new Schema({
  type:         { require:true, type: String },
  by:           { require:true, type: UserByte },
  updated:      { type: Date },
  questions:    { require:true, type: [{
      idx:            { require:true, type: Number },
      key:            { require:true, type: String, lowercase:true },
      prompt:         { require:true, type: String },
      answer:         { require:true, type: {} }
    }]
  },
  replies:      { require:true, type: [new Schema({
      by:             { require:true, type: UserByte },
      comment:        { require:true, type: String }
    })]
  },
  votes:        { require:true, type: [new Schema({
      by:             { require:true, type: UserByte },
      val:            { require:true, type: Number }
    })]
  }
})


module.exports = {Touch,Message,UserByte,PageMeta,SocialAccounts,Survey}
