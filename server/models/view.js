var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema

var objectType = ['post','workshop','expert','tag','landing']


module.exports = mongoose.model('View', new mongoose.Schema({

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


// cleanup 2015.07.13

// db.views.update({ __v: { $exists:1 } },{ $unset: { __v: "" } },{ 'multi': true })
// db.views.update({ userId: null },{ $unset: { userId: "" } },{ 'multi': true })
// db.views.remove({ utc: { $lt:ISODate('2015-03-02 10:00:00.002Z') }, userId: { $exists: false }, campaign: { $exists: false }, referer: { $exists: false }  })
//-- (Don't need utc if already have the _id)
// db.views.update({ utc: { $exists:1 } },{ $unset: { utc: "" } },{ 'multi': true })
