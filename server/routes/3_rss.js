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
    for (var {title,htmlHead,by,history,tags} of items) {
      var url = htmlHead.canonical
      var description = htmlHead ? htmlHead.description : 'No meta'
      var categories = _.map(tags||[], 'name')

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
    feed.categories = _.uniq(feed.categories)
    return feed.xml()
  }


  var getPosts = (query, cb) => cache.get('rss', function() {
    var select = '_id by.name by.avatar title tags htmlHead.canonical htmlHead.ogImage htmlHead.description history'
    var qOpts = { select, limit: 12, sort: { 'history.published': -1 }}
    var query = { 'tmpl': { $ne: 'blank', $ne: 'faq' },
      'history.published' : { $exists: true , $lt: new Date() },
      'by._id':  { $ne: '52ad320166a6f999a465fdc5' } }
    honey.model.DAL.Post.getManyByQuery(query, qOpts, cb)
  })


  var urls = rss.urls.split(',').map(url => `/${url}`)

  honey.Router('rss', { type:'rss' })
    .use(mw.$.abuser)
    .get(urls, mw.$.badBot, (req, res, next) =>
      getPosts(req.query || {}, (e, items) =>
        res.status(200)
           .type('application/rss+xml')
           .send(toFeed(items))
    ))

}
