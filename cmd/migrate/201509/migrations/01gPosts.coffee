
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


# unsets = ->
#   attrs = ['__v']
#   $unset = {}
#   $unset[attr] = 1 for attr in attrs
#   $log('unset.POST.attrs'.cyan, attrs.join(','))
#   Posts.updateMany {}, {$unset}, ->
#     DONE()


module.exports = ->

  specInit(@)

  describe 'Migrating posts fields'.white.bold, ->

    IT "Fixes objectIds", fixesObjectIds
    # IT "Can unset undesired attrs", unsets
