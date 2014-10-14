var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var objectType = ['post','workshop','expert']


module.exports = mongoose.model('view', new mongoose.Schema({

  utc:          { type: Date, required: true },
  userId:       { type: ObjectId, ref: 'User', index: true, sparse: true },
  anonymousId:  { type: String, ref: 'v1Session', index: true, sparse: true },
  objectId:     { type: ObjectId, required: true },
  type:         { enum: objectType, type: String, required: true, lowercase: true },
  url:          { type: String, required: true },
  campaign:     { type: {} },
  referer:      { type: String }

}))

// From here we can run a query to join to the original object and attach all the tags
// to figure out:
//
// 1) Tags a users been watching
// 2) Tags in aggregate that are performing well for the site
//
// We can also query this list and inject into the request to see what the user viewed
// leading up to making their request
