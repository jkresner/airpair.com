module.exports = function(app, mw, {rss}) {
  if (!rss) return

  var RSS  = require('rss')
  var feed = new RSS({
    site_url: 'https://www.airpair.com',
    image_url: 'https://static.airpair.com/img/icons/icon48.png',
    feed_url: 'https://www.airpair.com/rss',
    copyright: '2016 AirPair Inc',
    language: 'en',
    ttl: '60',
    title: 'AirPair Software Coding Tutorials & More',
    description: 'Posts by Software Experts from AirPair',
    categories: [],
    items: []
  })

  function toFeed(items) {
    feed.pubDate = moment().toDate() // whenever we regenerate the feed
    for (var {title,htmlHead,by,history,url,tags} of items) {
      var description = htmlHead ? htmlHead.description : 'No meta'
      var categories = _.pluck(tags||[], 'name')

      if (categories.length == 0) $log('feed_item_TAGS_PROB'.red, title)
      if (!url) $log('feed_item_URL_PROB'.red, title, categories)

      feed.item({ author: by.name,
                  categories,
                  description,
                  date: history.published,
                  title,
                  url })

      feed.categories.concat(categories)
    }
    feed.categories = _.unique(feed.categories)
    return feed.xml()
  }

  var getPosts = require('../services/posts').getRecentPublished
  var urls = rss.urls.split(',').map(url => `/${url}`)

  app.honey.Router('rss', { type:'rss' })
    .get(urls, mw.$.badBot, (req, res, next) =>
      cache.get('rssposts', getPosts, (e, items) =>
        res.status(200)
           .type('application/rss+xml')
           .send(toFeed(items))
    ))

}
