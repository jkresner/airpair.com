var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var TagSlim = {
  _id:          { required: true, type: ObjectId, ref: 'Tag'},
  name:         { required: true, type: String, trim: true },
  slug:         { required: true, type: String, lowercase: true, trim: true }
}

var Meta = {
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

var Author = {
  userId:       { required: true, type: ObjectId, ref: 'User', index: true },
  name:         { required: true, type: String },
  avatar:       { required: true, type: String },
  bio:          { required: true, type: String },
  username:     { type: String, lowercase: true }, // if they are an expert
  tw:           { type: String },
  gh:           { type: String },
  in:           { type: String },
  so:           { type: String },
  gp:           { type: String },
};

module.exports = mongoose.model('Post', new mongoose.Schema({

  by:           Author,
  created:      { required: true, type: Date, 'default': Date },
  updated:      { required: true, type: Date, 'default': Date },
  published:    { type: Date },
  publishedBy:  { type: ObjectId, ref: 'User' },
  slug:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  title:        { required: true, type: String, trim: true },
  md:           { required: true, type: String },
  assetUrl:     { type: String, trim: true },
  tags:         { type: [TagSlim], 'default': [] },
  meta:         Meta

}))
