const Views = {
  postTile: '_id by._id slug title tags htmlHead.canonical htmlHead.ogImage'
}

const Query = {
  postsPublished: p => 
    ({ 'history.published': { $exists:true, $lt: new Date } })
}

const Opts = {
  postTiles: { select: Views.postTile }
}

const Projections = ({inflate},{chain,view}) => ({

  tagged: r => 
    assign(r, {tag: _.sortBy(r.tag.map(t => {
      tag = assign(t, cache.tags[t._id])
      var url = `/${t.slug}`.replace('++','\\+\\+')
      if (t.slug == 'angularjs') url = `/${t.slug}/posts`
      else
        cache.rules['301'].push({url:`^${url}/((post)|(workshop))s$`, to: url })

      return assign(t, { url })
    }), 'name')})

})

module.exports = { Views, Query, Opts, Projections }