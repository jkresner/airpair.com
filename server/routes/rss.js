var logging               = true
var PostsSvc              = null
// var WorkshopsSvc          = null
var RSS                   = require('rss')

var allFeedOptions = {
  site_url: 'https://www.airpair.com',
  image_url: 'https://www.airpair.com/static/img/css/airpair-circle.png',
  copyright: '2015 AirPair Inc',
  language: 'en',
  ttl: '60'
}

// var postsFeedOptions = {
//   title: 'AirPair Posts',
//   description: 'Blog Posts from AirPair',
//   feed_url: 'https://www.airpair.com/rss/posts',
//   categories: []
// }

// var workshopsFeedOptions = {
//   title: 'AirPair Workshops',
//   description: 'Workshops from AirPair',
//   feed_url: 'https://www.airpair.com/rss/workshops',
//   categories: []
// }

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
    description: (data.meta) ? data.meta.description : 'No meta',
    author: data.by.name,
    date: data.published,
    url: data.url,
    categories: _.pluck(data.tags, 'name')
  }
}

// function generateWorkshopFeedItem(data) {
//   // $log('generateWorkshopFeedItem',_.pluck(data.tags, 'name'))
//   return {
//     title: data.title,
//     description: data.description,
//     date: data.time,
//     author: data.speakers[0].name,
//     url: data.url,
//     categories: _.pluck(data.tags, 'name')
//   }
// }

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

    // workshops(req, res) {
    //   if (!WorkshopsSvc) WorkshopsSvc = require('../services/workshops')

    //   feeds.workshops = defineRssFeed( workshopsFeedOptions )
    //   feeds.workshops.items = []
    //   feeds.workshops.categories = []

    //   if (rssCache.workshops)
    //   {
    //     // $log('render workshops from cache', rssCache.workshops.length)
    //     populate(feeds.workshops, rssCache.workshops, generateWorkshopFeedItem)
    //     return render(res, feeds.workshops)
    //   }

    //   WorkshopsSvc.getAllForRss((e,workshops) => {
    //     $log('data access workshops')
    //     if (e) {
    //       $log(('error retrieving workshops for rss feed:' + e).red)
    //       return render(res, feeds.workshops)
    //     }

    //     rssCache = _.extend(rssCache,{workshops})
    //     populate(feeds.workshops, workshops, generateWorkshopFeedItem)
    //     render(res, feeds.workshops)
    //   })
    // },

    mixed(req, res) {
      return _rss.posts(req, res)
      // if (!PostsSvc) PostsSvc = require('../services/posts')
      // // if (!WorkshopsSvc) WorkshopsSvc = require('../services/workshops')

      // feeds.mixed = defineRssFeed( mixedFeedOptions )
      // feeds.mixed.items = []
      // feeds.mixed.categories = []

      // if (rssCache.posts && rssCache.workshops)
      // {
      //   if (logging) $log(`render ${rssCache.posts.length + rssCache.workshops.length} mixed from cache`)
      //   populate(feeds.mixed, rssCache.posts, generatePostFeedItem)
      //   populate(feeds.mixed, rssCache.workshops, generateWorkshopFeedItem)
      //   return render(res, feeds.mixed)
      // }

      // PostsSvc.getRecentPublished((e, posts) => {
      //   if (e) {
      //     $log(('error retrieving posts for mixed rss feed:' + e).red)
      //     return render(res, feeds.mixed)
      //   }
      //   WorkshopsSvc.getAllForRss((e, workshops) => {
      //     if (e) {
      //       $log(('error retrieving workshops for mixed rss feed:' + e).red)
      //       return render(res, feeds.mixed)
      //     }
      //     rssCache = _.extend(rssCache,{posts,workshops})
      //     if (logging) $log(`render ${rssCache.posts.length + rssCache.workshops.length} mixed from data access`)
      //     populate(feeds.mixed, posts, generatePostFeedItem)
      //     populate(feeds.mixed, workshops, generateWorkshopFeedItem)
      //     render(res, feeds.mixed)
      //   })
      // })
    }
  }

  return  _rss
}

module.exports = function(app) {
  var rss = rssRenderer()
  var router = require('express').Router()

  .get('/', rss.mixed)
  // .get('/posts', rss.posts)
  // .get('/workshops', rss.workshops)

  return router
}
