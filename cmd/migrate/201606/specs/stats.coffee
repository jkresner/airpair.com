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
