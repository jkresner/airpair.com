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

  //-- Sort tags into alphabetical list
  tagged: r =>
    assign(r, { tag:
      _.sortBy(
        r.tag.map(t => assign(cache.tags[t._id], t))
             .map(t => {
          var url = `/${t.slug}`.replace('++','\\+\\+')
          if (t.slug == 'angularjs')
            url = `/${t.slug}/posts`
          else
            cache.rules['301'].push({url:`^${url}/((post)|(workshop))s$`, to: url })
          return assign(cache.tags[t._id], {url})
      }), 'name')
    })

})

module.exports = { Views, Query, Opts, Projections }
