var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var Author = new mongoose.Schema({  
  userId:       { required: true, type: ObjectId, ref: 'User' },
  name:         { required: true, type: String },  
  avatar:       { required: true, type: String },  
  about:        { type: String }
});

export default mongoose.model('Post', new mongoose.Schema({
  
  by:           { required: true, type: [Author] },
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