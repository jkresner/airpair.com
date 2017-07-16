module.exports = (DAL, Data, DRY) => ({


  validate(user, tags) {
    if (!user) return `Not authenticated`
    if (!tags) return `Tags required`
  },
  

  exec(tags, done) {
    //-- Used for saivng sort order
    // for (var t of tags) { if (!t.tagId) t.tagId = t._id } // if you pass in normal tags it breaks
    // updateAsIdentity.call(this, {tags}, null, cb)    
  },


  project: Data.Project.me


})