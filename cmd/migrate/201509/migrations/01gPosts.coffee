
checkCONSISTENT = ->
  Posts.find({}, {'by':1}).toArray (e, all) ->
    count = 0
    for o in all
      count++
      expect(o.by._id, "by.user._id does not exist for #{o._id}").to.exist
      expect(o.by._id.constructor == ObjectId).to.be.true
      if UserGraph[o.by._id]?
        refIncrement UserGraph[o.by._id], 'posts'
      else
        # $log(o)
    DONE()



fixesObjectIds = ->
  Posts.find({}, {by:1}).toArray (e, all) ->
    ups = []
    for o in all
      newBy = _id: o.by.userId
      ups.push updateOne: { q: {_id:o._id}, u: { $set: {by:newBy} }, upsert: false }

    if ups.length == 0 then return DONE()
    Posts.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.POSTS.fixingByObjectIds'.yellow, r.modifiedCount)
      DONE()




module.exports = ->


  specInit(@)


  DESCRIBE 'MIGRATE', ->
    IT "Fixes objectIds", fixesObjectIds


  DESCRIBE 'CHECK', ->
    IT "Consistent", checkCONSISTENT

