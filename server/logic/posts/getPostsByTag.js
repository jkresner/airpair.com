module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({


  exec(url, cb) {
    let path = url.split('?')[0].toLowerCase()
    let tag = _.find(cache['canonical'].tag, t => t.url == path)
    if (!tag)
      return cb(DRY.NotFound(`Not found ${url}`))

    let q = Query.published({'tags._id': tag._id})
    Post.getManyByQuery(q, Opts.publishedNewest(), (e, posts) => {
      cb(e, e?null:assign({}, tag, {posts}))
    })
  },


  project: Project.byTag


})
