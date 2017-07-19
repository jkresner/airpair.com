module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({


  exec(url, cb) {
    var url = url.split('?')[0].toLowerCase().replace('++','\\+\\+')
    var tag = _.find(cache['canonical'].tag, t => t.url == url)
    if (!tag) cb(assign(Error(`Not found ${url}`),{status:404}))
    var q = Query.published({'tags._id': tag._id})
    Post.getManyByQuery(q, Opts.publishedNewest(), (e, posts) => {
      cb(e, e?null:assign({}, tag, {posts}))
    })
  },


  project: Project.byTag


})
