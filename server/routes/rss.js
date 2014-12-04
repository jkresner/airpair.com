import * as PostsSvc from '../services/posts'
import * as WorkshopsSvc from '../services/workshops'
var RSS  = require('rss')

var allFeedOptions = {
  site_url: 'http://www.airpair.com',
  image_url: 'http://www.airpair.com/v1/img/css/airpair-circle.png',
  copyright: '2014 AirPair Inc',
  language: 'en',
  ttl: '60'
}

var postsFeedOptions = {
  title: 'AirPair Posts',
  description: 'Blog Posts from AirPair',
  feed_url: 'http://www.airpair.com/rss/posts',
  categories: []
}

var workshopsFeedOptions = {
  title: 'AirPair Workshops',
  description: 'Workshops from AirPair',
  feed_url: 'http://www.airpair.com/rss/workshops',
  categories: []
}

var mixedFeedOptions = {
  title: 'AirPair Posts & Workshops',
  description: 'Posts & Workshops from AirPair',
  feed_url: 'http://www.airpair.com/rss',
  categories: []
}

function defineRssFeed(options) {
  return new RSS(_.extend(allFeedOptions, options));
}

function generatePostFeedItem(data) {
  return {
    title: data.title,
    description: data.meta.description,
    author: data.by.name,
    date: data.published,
    url: `http:\/\/www.airpair.com\/${data.url}`,
    categories: _.pluck(data.tags, 'name')
  }
}

function generateWorkshopFeedItem(data) {
  return {
    title: data.title,
    description: data.description,
    date: data.time,
    author: data.speakers[0].name,
    url: `http:\/\/www.airpair.com\/${data.url}`,
    categories: data.tags
  }
}

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
      catNames = _.union( catNames, feed_item.categories )
      the_feed.item(feed_item)
    }
    the_feed.categories.push(_.unique( catNames ))
  }

  var feeds = {}
  feeds.posts = defineRssFeed( postsFeedOptions )
  feeds.workshops = defineRssFeed( workshopsFeedOptions )
  feeds.mixed = defineRssFeed( mixedFeedOptions )

  return {
    posts: function(req, res) {
      PostsSvc.getRecentPublished((e, posts) => {
        feeds.posts.items = []
        feeds.posts.categories = []
        if (e) {
          $log(('error retrieving posts for rss feed:' + e).red)
          return render(res, feeds.posts)
        }

        populate(feeds.posts, posts, generatePostFeedItem)
        render(res, feeds.posts)
      })
    },

    workshops: function(req, res) {
      WorkshopsSvc.getAllForRss((e,workshops) => {
        feeds.workshops.items = []
        feeds.workshops.categories = []
        if (e) {
          $log(('error retrieving workshops for rss feed:' + e).red)
          return render(res, feeds.workshops)
        }

        populate(feeds.workshops, workshops, generateWorkshopFeedItem)
        render(res, feeds.workshops)
      })
    },

    mixed: function(req, res) {
      PostsSvc.getRecentPublished((e, posts) => {
        if (e) {
          $log(('error retrieving posts for mixed rss feed:' + e).red)
          return render(res, feeds.mixed)
        }
        WorkshopsSvc.getAllForRss((e, workshops) => {
          if (e) {
            $log(('error retrieving workshops for mixed rss feed:' + e).red)
            return render(res, feeds.mixed)
          }
          feeds.mixed.items = []
          feeds.mixed.categories = []
          populate(feeds.mixed, posts, generatePostFeedItem)
          populate(feeds.mixed, workshops, generateWorkshopFeedItem)
          render(res, feeds.mixed)
        })
      })
    }
  }
}

export default function(app) {
  var rss = rssRenderer()
  var router = require('express').Router()

  .get('/', rss.mixed)
  .get('/posts', rss.posts)
  .get('/workshops', rss.workshops)

  return router
}
