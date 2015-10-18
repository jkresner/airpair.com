
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

  describe 'Migrating posts fields'.white.bold, ->

    IT "Fixes objectIds", fixesObjectIds
