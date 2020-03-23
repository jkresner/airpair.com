//var bots = {
  /* http://www.bing.com/toolbox/verify-bingbot-verdict
  *  https://www.bing.com/webmaster/help/bing-content-removal-tool-cb6c294d  */
//  bing: /((157.55.39)|(40.77.167))\./,
  // https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml
  // yandex: '',
//}


const Views = {
  postTile: '_id by._id slug title tags htmlHead.canonical htmlHead.ogImage'
}

const Query = {
  postsPublished: p =>
    ({ 'history.published': { $exists:true },
       'history.published': { $lt: new Date } })
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
          let url = `/${t.slug}`

          if (t.slug == 'angularjs')
            url = `/${t.slug}/posts`
          // else if (t.slug.indexOf("++") == -1)
            // url = url.replace('++','\\+\\+')
          else
            cache.rules['301'].unshift({url:`^${url}/((posts$)|(workshops*))`, to:url})
          // let url = url.replace('.','\\.')
          // else

          return assign(cache.tags[t._id], {url})
      }), 'name')
    })

})

module.exports = { Views, Query, Opts, Projections }
