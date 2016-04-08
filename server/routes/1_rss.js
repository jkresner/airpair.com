var logging               = true
var PostsSvc              = null
var RSS                   = require('rss')

var allFeedOptions = {
  site_url: 'https://www.airpair.com',
  image_url: 'https://www.airpair.com/static/img/css/airpair-circle.png',
  copyright: '2016 AirPair Inc',
  language: 'en',
  ttl: '60'
}



var mixedFeedOptions = {
  title: 'AirPair Software Coding Tutorials & More',
  description: 'Posts by Software Experts from AirPair',
  feed_url: 'https://www.airpair.com/rss',
  categories: []
}

function defineRssFeed(options) {
  return new RSS(_.extend(allFeedOptions, options));
}

function generatePostFeedItem(data) {
  // $log('generatePostFeedItem',data)
  return {
    title: data.title,
    description: (data.htmlHead) ? data.htmlHead.description : 'No meta',
    author: data.by.name,
    date: data.published,
    url: data.url,
    categories: _.pluck(data.tags, 'name')
  }
}


var rssCache = {}

function rssRenderer() {
  var render = (res, the_feed) => {
    res.status(200)
      .type('application/rss+xml')
      .send(the_feed.xml())
  }

  var populate = (the_feed, items, generateFeedItem) => {
    the_feed.pubDate = moment().toDate(); // whenever we regenerate the feed
    var catNames = []
    for (var item of items) {
      var feed_item = generateFeedItem(item);
      if (!feed_item.url) $log('feed_item_URL_PROBLEM'.red, item.title.white, item.categories)
      if (feed_item.categories.length == 0) $log('feed_item_TAGS_PROBLEM'.red, item.title.white)
      catNames = _.union( catNames, feed_item.categories )
      the_feed.item(feed_item)
    }
    the_feed.categories.push(_.unique( catNames ))
  }

  var feeds = {}


  var _rss = {

    posts(req, res) {
      if (!PostsSvc) PostsSvc = require('../services/posts')

      feeds.posts = defineRssFeed( mixedFeedOptions || postsFeedOptions )
      feeds.posts.items = []
      feeds.posts.categories = []

      if (rssCache.posts)
      {
        if (logging) $log(`RSS[${rssCache.posts.length}] posts from cache`)
        populate(feeds.posts, rssCache.posts, generatePostFeedItem)
        return render(res, feeds.posts)
      }

      PostsSvc.getRecentPublished((e, posts) => {
        if (e) {
          $log(('error retrieving posts for rss feed:' + e).red)
          return render(res, feeds.posts)
        }

        $log(`RSS[${posts.length}] posts from db`)
        rssCache = _.extend(rssCache,{posts})
        populate(feeds.posts, posts, generatePostFeedItem)
        render(res, feeds.posts)
      })
    },


    mixed(req, res) {
      return _rss.posts(req, res)

    }
  }

  return  _rss
}

module.exports = function(app, mw) {
  if (config.routes.rss !== true) return

  var rss = rssRenderer()
  app.get('/rss', rss.mixed)

  $logIt('cfg.route', `rss:GET`, '/rss')
}
