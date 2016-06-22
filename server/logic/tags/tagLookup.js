module.exports = ({Tag}, Data, Shared) => ({


  validation(user, lookup) {
    if (!lookup) return `Tag lookup value undefined`
    if (lookup.constructor != String
     && lookup.constructor != Tag.NewId().constructor)
      `Tag lookup values of slug <String> or _id <ObjectId>`
  },


  exec(lookup, cb) {
    var tag = null
    var type = lookup.constructor
    if (type != String)
      return cb(null, cache.tags[lookup])

    // if (lookup.indexOf('#') != -1)
    //  lookup = encodeURIComponent(lookup)
    // Tag.getByQuery({slug:lookup}, null, cb)

    for (var _id in cache.tags)
      if (cache.tags[_id].slug == lookup)
        return cb(null, cache.tags[_id])

    // if (checkSO)
    // term = term.toLowerCase()
    // Wrappers.StackExchange.getTagByStackoverflowSlug(term, (e,r) => {
    //   if (!r) return cb()
    //   Tag.getByQuery({$or:[{soId:term},{ghId:term}]}, {}, (e,existing) => {
    //     // $log('getBy3rdParty.existing', existing)
    //     cb(null, _.extend(r, existing||{}))
    //   })
    // })

    return cb(null, null)
  },


  // project: Data['?']


})

