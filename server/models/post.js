var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var Meta = {  
  title:        { required: true, type: String },  
  keyword:      { required: true, type: String },
  description:  { required: true, type: String },
  canonical:    { required: true, type: String },  
  ogTitle:      { type: String },     
  ogType:       { type: String },       
  ogImage:      { type: String },    
  ogVideo:      { type: String },      
  ogUrl:        { type: String }
};

var Author = {  
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  name:         { required: true, type: String },  
  avatar:       { required: true, type: String },
  username:     { type: String, lowercase: true }, // if they are an expert
  tw:           { type: String },   
  gh:           { type: String },     
  in:           { type: String },       
  gp:           { type: String },    
  bio:          { type: String }
};

export default mongoose.model('Post', new mongoose.Schema({
  
  by:           { required: true, type: Author },
  created:      { required: true, type: Date, 'default': Date },
  updated:      { required: true, type: Date, 'default': Date },
  published:    { type: Date },  
  publishedBy:  { type: ObjectId, ref: 'User' },  
  slug:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  title:        { required: true, type: String, trim: true },
  md:           { required: true, type: String }, 
  assetUrl:     { type: String, lowercase: true, trim: true },   
  tags:         { type: [{}], 'default': [] },  
  meta:         { type: Meta }

}))