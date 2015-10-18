

checkCONSISTENT = ->
  Payouts.find({}, {'userId':1,'lines':1}).toArray (e, all) ->
    unique = {}
    count = 0
    jk = 0
    for o in all
      count++
      if UserGraph[o.userId]?
        refIncrement UserGraph[o.userId], 'paidout'

      for line in o.lines
        expect(line.info.expert._id).to.exist
        if (line.info.expert._id.constructor == ObjectId)
          expect(line.info.expert._id.constructor == ObjectId, "info.expert._id expecting ObjectId #{o._id}").to.be.true
        else
          $log("#{idToMoment(o._id,'YY.MM')} [#{o._id}]")

        if line.info.expert.userId?
          $log("#{idToMoment(o._id,'YY.MM')} [#{o._id}]")
        else
          expect(line.info.expert.userId, "info.expert.userId should be undefined #{o._id}").to.be.undefined

        # if UserGraph[line.info.released.by._id]
        expect(line.info.released.by._id.constructor == ObjectId, "release.by._id expecting ObjectId got #{line.info.released.by._id.constructor} #{o._id}").to.be.true
        if UserGraph[line.info.released.by._id]?
          if !unique[o._id]?
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id
          else if unique[o._id] is not line.info.released.by._id
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id

    DONE()




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


  # DESCRIBE 'MIGRATE', ->
    # IT "Fixes objectIds", fixesObjectIds


  DESCRIBE 'CHECK', ->
    IT "Consistent", checkCONSISTENT

