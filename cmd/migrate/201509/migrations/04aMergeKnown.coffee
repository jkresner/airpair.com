MERGE = require('../merge')


mergeDupsByName = (uaId, ubId, fullName, overrides, mergedExpertId, expects, cb) ->
  domain.create().on('error', DONE).run ->
    Users.findOne {_id:ObjectId(uaId)}, (e,uA) ->
      Users.findOne {_id:ObjectId(ubId)}, (e,uB) ->
        if (uA) then expect(uA.name.toLowerCase().replace(/ /g,'')).to.equal(fullName)
        if (uB) then expect(uB.name.toLowerCase().replace(/ /g,'')).to.equal(fullName)
        MERGE uA, uB, overrides, (e, r) ->
          M = r.merged.user || r.replay
          if mergedExpertId is '' then mergedExpertId = r.merged.expert._id
          if mergedExpertId? then mergedExpertId = ObjectId(mergedExpertId)
          checkMergeMergedGraph M, mergedExpertId, expects, ->
            if r.replay then return cb(null, r)
            checkMergeRemovedGraph r.removed, (ee) ->
              cb ee, r


expectAllMerges = (promObjList) ->
  newProm = (key) -> new Promise (resolve, reject) ->
    {U,O,R} = promObjList[key]
    expectFn = R.fn || (->)
    mergeDupsByName U.A, U.B, key, U.O, O.E, _.omit(R,'fn'), (e, r) ->
      if (e)
        return reject(e)
      try
        if !r.replay
          expectFn r
          console.log('Passed     '.green, key)
        else
          console.log('Replay     '.green.dim, key)
        resolve key
      catch err
        reject(err)

  Promise.all(newProm(attr) for attr of promObjList)
    .then ((values)->$log('Passed     '.green, '(all)'||values);DONE()), DONE



merge_v1_active_customers = ->
  expectAllMerges FIXTURE.dupknown.v1ActiveCustomers



noDupKnownUsers = ->

  bookingNames = {}

  for uid of UserGraph
    $log(UserGraph[uid].name)
    hash = UserGraph[uid].name.toLowerCase().replace(/ /g,'')
    if bookingNames[hash]?
      bookingNames[hash].push {_id:uid}
    else
      bookingNames[hash] = [{_id:uid}]

  line = (name, dups) -> "#{ name.yellow }#{ uInfoChain(acc) for acc in dups }"
  dups = {}
  text = ''
  for name of bookingNames
    if bookingNames[name].length > 1
      add = false
      for u in bookingNames[name]
        if UserGraph[u._id].bookings || UserGraph[u._id].booked
          $log('u'.blue, u)
          add = true
      if add
        dups[name] = bookingNames[name]
        text += line(name, dups[name])+'\n'

  $log(text)
  expect(_.keys(dups).length).to.equal(0)
  DONE()



module.exports = ->

  specInit(@)

  describe 'Mergin on known dups', ->

    # IT "Merge v1 active experts", merge_v1_active_experts
    # IT "Merge v1 active customers", merge_v1_active_customers
    IT "No duplicate names of bookings left", noDupKnownUsers

