module.exports = (DAL, Data, Shared, Lib) => ({

  exec(cb) {

    var cfg = _.get(config,'routes.canonical')
    if (!cfg.posts) return cb(null, {})

    DAL.Post.getManyByQuery({'history.published':{$exists:true, $lt: new Date}},
      { select:'_id by._id slug title tags htmlHead.canonical htmlHead.ogImage' },
      (e, posts) => {
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

        if (!cfg.tags) return cb(null, assign(r,{tag:[]}))

        r.tag = _.sortBy(Object.keys(tagged)
          .map(id => cache.tags[id])
          .map(t => {
            var url = `/${t.slug}`.replace('++','\\+\\+')
            if (t.slug == 'angularjs')
              url = `/${t.slug}/posts`
            else
              cache.rules['301'].push({url:`^${url}/((post)|(workshop))s$`, to: url })

            return assign(t, { posts: tagged[t._id], url })
          }), 'name')

        cb(null, r)
      })
  }

})
