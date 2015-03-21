var {isAdmin} = require('../roles')

var validation = {

  getRanked(user, expert, query)
  {
    if (!query || !query.tags || query.tags.length == 0)
      return `getRanked only supports queries with tags right now`

    if (query.rate)
      return `getRanked does not yet support rate`

    if (query.availability)
      return `getRanked does not yet support availability`

    if (query.level)
      return `getRanked does not yet support level`

    var tagIds = []
    for (var slug of query.tags.split(','))
    {
      var tag = cache.tagBySlug(slug)
      if (!tag) return `Tag ${slug} not valid to query`
      tagIds.push(tag._id.toString())
    }
    query.tags = tagIds

    if (query.exclude) query.exclude = query.exclude.split(',')

    if (isAdmin(user))
      query.limit = 500
    else if (!expert._id)
      query.limit = 3
    else if (expert._id && !expert.matching)
      query.limit = 4
    else if (expert._id && expert.matching)
      query.limit = 5 // can do better than this and calculate off karama
  },

  updateMatchingStats(user, original, ups)
  {

  },

}

module.exports = validation
