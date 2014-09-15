var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

export default mongoose.model('Post', new mongoose.Schema({
  
  by:           { required: true, type: ObjectId, ref: 'User' },
  created:      { required: true, type: Date, 'default': Date },
  updated:      { required: true, type: Date, 'default': Date },
  published:    { type: Date },  
  publishedBy:  { type: ObjectId, ref: 'User' },  
  slug:         { type: String, unique: true, sparse: true },
  title:        { required: true, type: String },
  md:           { required: true, type: String }, 
  assetUrl:     { type: String },   
  tags:         { type: [{}], 'default': [] }  

}))