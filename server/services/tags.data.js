var data = {

  select: {
    listCache: {
      '_id':1,
      name: 1,
      slug: 1
    },
    search: {
      '_id': 1,
      'name': 1,
      'slug': 1,
      'desc': 1,
      'short': 1,
      score: { $meta: "textScore" }
    },
    cb: {
      search(cb) {
        return (e,r) => {
          if (e) return cb(e)
          cb(null, util.selectFromObject(r, data.select.search))
        }
      }
    }
    // inflateTags(tags, cb) {
    //   cache.ready(['tags'], () => {

    //     for (var t of (user.tags || []))
    //     {
    //       var tt = cache['tags'][t.tagId]
    //       if (tt) {
    //         var {name,slug} = tt
    //         tags.push( _.extend({name,slug},t) )
    //       }
    //       else
    //         $log(`tag with Id ${t.tagId} not in cache`)
    //         // return cb(Error(`tag with Id ${t.tagId} not in cache`))
    //     }

    //     cb(null, _.extend(user, {tags, bookmarks}))
    //   })
    // },

  },

  data: {
    encodes: ['c%2B%2B','c%23','f%23'],
  },
}


module.exports = data
