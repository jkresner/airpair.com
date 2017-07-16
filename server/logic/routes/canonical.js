module.exports = (DAL, {Query, Opts, Project}, DRY) => ({


  exec(cb) {
    var cfg = honey.cfg('routes.canonical')
    if (!cfg.posts) return cb(null, {})

    DAL.Post.getManyByQuery(Query.postsPublished(), Opts.postTiles, (e, posts) => {        
      //-- used for post/thumb/{_id}
      cache.posts = {}
      posts.forEach(p => cache.posts[p._id] =
        { slug: p.slug, ogImg: p.htmlHead.ogImage, url: p.htmlHead.canonical, by: p.by._id, title: p.title })

      var tagged = {}, by = {};
      for (var {tags,by} of posts) {
        by[by._id] = by[by._id] ? by[by._id]+1 : 1

        for (var {_id} of tags)
          tagged[_id] = tagged[_id] ? tagged[_id]+1 : 1
      }

      r = { stats: { posts: { published: posts.length, by, tagged } } }
      r.post = posts.map(p => ({ id: p.slug,
        url: p.htmlHead.canonical.replace(/^(https|http)/,'')
                                  .replace('://www.airpair.com','')
                                  .replace('++','\\+\\+') }))

      var tag = Object.keys(tagged).map(_id => ({ _id, posts: tagged[_id] }))
      return cb(null, assign(r,{tag}))
    })
  },


  project: Project.tagged


})
