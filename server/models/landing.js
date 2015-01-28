var mongoose = require('mongoose')
var Shared = require('./_shared')
var {ObjectId} = mongoose.Schema


module.exports = mongoose.model('Landing', new mongoose.Schema({

  launched:     { required: true, type: Date, 'default': Date },
  campaignId:   { type: ObjectId, ref: 'MarketingTag' },
  channelId:    { type: ObjectId, ref: 'MarketingTag' },
  slug:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  title:        { required: true, type: String, trim: true },
  meta:         Shared.PageMeta

}))
