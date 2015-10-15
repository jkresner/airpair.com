
fixesObjectIds = ->
  Payouts.find({}, {lines:1}).toArray (e, all) ->
    ups = []
    for o in all
      {lines} = o
      for line in lines
        if line.info.released.by._id.constructor == String
          line.info.released.by._id = ObjectId(line.info.released.by._id)

        if line.info.expert._id.constructor == String
          line.info.expert._id = ObjectId(line.info.expert._id)

        delete line.info.expert.userId

      ups.push updateOne: { q: {_id:o._id}, u: { $set: {lines} }, upsert: false }

    if ups.length == 0 then return DONE()
    Payouts.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.Payouts.fixingObjectIds'.yellow, r.modifiedCount)
      DONE()



module.exports = ->

  specInit(@)

  describe 'Migrating payouts fields'.white.bold, ->

    IT "Fixes objectIds", fixesObjectIds

