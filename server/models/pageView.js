
export default mongoose.model('PageView', new mongoose.Schema({
  
  utc:          { type: Date, required: true },  
  userId:       { type: ObjectId, ref: 'User', index: true },  
  sessionId:    { type: ObjectId, ref: 'v1Session', index: true },    
  objectId:     { type: ObjectId, required: true },
  objectType:   { enum: objectType, type: String, required: true },  
  url:          { type: [TagSlim], 'default': [] },  
  utm:          { type: String }  
  referrer:     { type: String }  

}))

// From here we can run a query to join to the original object and attach all the tags
// to figure out:
//
// 1) Tags a users been watching
// 2) Tags in aggregate that are performing well for the site
//
// We can also query this list and inject into the request to see what the user viewed
// leading up to making their request


// ?
// export default mongoose.model('EmailSent', new mongoose.Schema({
  
//   utc:          { type: Date, required: true },  
//   userId:       { type: ObjectId, ref: 'User', index: true },  
//   objectId:     { type: ObjectId, required: true },
//   objectType:   { enum: objectType, type: String, required: true },  
//   utm:          { type: String }  

// }))