global._ = require('../../../../node_modules/meanair-server/node_modules/lodash')
postsUtil = require('../../../../shared/posts')

module.exports = ->

  before (done) ->
    global.Posts = DB.Collections.posts
    done()

  IT "Update all author ^// image urls to ^https://", ->
    @timeout(500000000)
    Posts.find({ 'by.avatar' : new RegExp('^//') }, {'_id':1,'by.avatar':1,'title':1}).toArray (e, all) =>
      ups = []
      for p in all
        $log(':', p.title.white, 'https:'.cyan+p.by.avatar)
        $set = { 'by.avatar': 'https:'+p.by.avatar }
        ups.push updateOne: { q: {_id:p._id}, u: { $set }, upsert: false }

      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts["by.avatar"]'.yellow, r.modifiedCount)
        DONE()

  # IT "Update all stats", ->
  #   @timeout(500000000)
  #   Posts.find({'stats':{$exists:0}}).toArray (e, all) =>
  #     ups = []
  #     for p in all
  #       # prev = p.stats || { words: 0 }
  #       # prev.reviews = prev.reviews || 0
  #       # prev.forkers = prev.forkers || 0
  #       stats = postsUtil.calcStats(p)
  #       # if (!p.stats)
  #       $log(':', p.title.white, stats)
  #       ups.push updateOne: { q: {_id:p._id}, u: { $set : {stats} }, upsert: false }

  #     Posts.bulkWrite ups, {ordered:false}, (e,r) ->
  #       $log('update.Posts["stats"]'.yellow, r.modifiedCount)
  #       DONE()
