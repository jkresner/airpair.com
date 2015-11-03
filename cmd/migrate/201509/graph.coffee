global.TagsBySlug = {}
global.TagIds = {}
global.UserGraph = {}
global.ExpertGraph = {}

module.exports = (done) ->


  tag = (cb) -> Tags.find({}).toArray (e, all) ->
    $log('graph'.gray, 'tags', all.length)
    for o in all
      TagsBySlug[o.slug] = o
      TagIds[o._id] = true
    cb()

  user = (cb) -> Users.find({},{_id:1,name:1,email:1,'auth.gh':1}).toArray (e, all) ->
    $log('graph'.gray, 'users', all.length)
    for o in all
      expect(o.name).to.exist
      UserGraph[o._id] = name: o.name
      UserGraph[o._id]['gh'] = o.auth.gh.id if _.get(o,'auth.gh.id')
    cb()

  paymethod = (cb) -> Paymethods.find({}, {'userId':1}).toArray (e, all) ->
    $log('graph'.gray, 'paymethod', all.length)
    for o in all
      refIncrement UserGraph[o.userId], 'paymethods' if UserGraph[o.userId]?
    cb()

  expert = (cb) -> Experts.find({},{_id:1,userId:1}).toArray (e, all) ->
    $log('graph'.gray, 'experts', all.length)
    for o in all
      expect(UserGraph[o.userId], "User for expert does not exist #{o._id}").to.exist
      UserGraph[o.userId].expert = o._id
      ExpertGraph[o._id] = user: o.userId
    cb()

  request = (cb) -> Requests.find({},{userId:1,'suggested.expert':1}).toArray (e, all) ->
    $log('graph'.gray, 'requests', all.length)
    for o in all
      expect(o.userId.constructor == ObjectId).to.be.true

      refIncrement UserGraph[o.userId], 'requests' if UserGraph[o.userId]?

      for s in o.suggested || []
        if s.expert && s.expert._id
          # expect(s.expert._id.constructor == ObjectId, "s.expert._id no an ObjectId for #{o._id}").to.be.true
          if ExpertGraph[s.expert._id]?
            userId = ExpertGraph[s.expert._id].user
            # expect(userId, "s.expert._id => userId #{s}").to.exist
            refIncrement UserGraph[userId], 'suggests'
    cb()

  booking = (cb) -> Bookings.find({},{participants:1,customerId:1,expertId:1}).toArray (e, all) ->
    $log('graph'.gray, 'bookings', all.length)
    for o in all
      expect(o.customerId.constructor == ObjectId, 'customerId should be ObjectId').to.be.true
      expect(o.expertId.constructor == ObjectId, 'expertId should be ObjectId for #{o._id}').to.be.true
      expect(o.participants, "participants does not exist for #{o._id}").to.exist
      expect(o.participants.length > 1, "participants length should be > 1 for #{o._id}").to.be.true
      for p in o.participants
        expect(p.info._id.constructor == ObjectId, "participant info._id should be ObjectId #{o._id}").to.be.true

      refIncrement UserGraph[o.customerId], 'bookings' if UserGraph[o.customerId]?
      refIncrement UserGraph[ExpertGraph[o.expertId].user], 'booked' if ExpertGraph[o.expertId]?
    cb()

  payout = (cb) -> Payouts.find({}, {'userId':1,'lines':1}).toArray (e, all) ->
    $log('graph'.gray, 'payouts', all.length)
    unique = {}
    for o in all
      refIncrement UserGraph[o.userId], 'paidout' if UserGraph[o.userId]?

      for line in o.lines
        expect(line.info.released.by._id.constructor == ObjectId, "release.by._id expecting ObjectId got #{line.info.released.by._id.constructor} #{o._id}").to.be.true
        if UserGraph[line.info.released.by._id]?
          if !unique[o._id]?
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id
          else if unique[o._id] is not line.info.released.by._id
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id
    cb()

  post = (cb) -> Posts.find({}, {'by':1}).toArray (e, all) ->
    $log('graph'.gray, 'posts', all.length)
    for o in all
      # expect(o.by._id.constructor == ObjectId).to.be.true
      # refIncrement UserGraph[o.by._id], 'posts' if UserGraph[o.by._id]?
      expect(o.by.userId.constructor == ObjectId).to.be.true
      refIncrement UserGraph[o.by.userId], 'posts' if UserGraph[o.by.userId]?
    cb()

  order = (cb) -> Orders.find({}).toArray (e, all) ->
    $log('graph'.gray, 'orders', all.length)
    for o in all
      expectObjectId(o.userId)
      refIncrement UserGraph[o.userId], 'orders' if UserGraph[o.userId]?
      if o.lines[0].type != 'ticket' && o.lines[0].type != 'credit'
        for li in o.lines
          expert = null
          if li.suggestion
            if li.suggestion.expert._id?
              expert = li.suggestion.expert
          else if li.info? && li.info.expert?
            expert = li.info.expert

          if expert? && ExpertGraph[expert._id]?
            refIncrement UserGraph[ExpertGraph[expert._id].user], 'ordered'
    cb()


  tag -> user -> paymethod -> expert -> request -> booking -> payout -> post -> order done



