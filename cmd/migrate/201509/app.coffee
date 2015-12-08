express                = require('express')
domain                 = require('domain')

module.exports =
  run: (config, done) ->

    global.config = config
    $log('APP ==> '+ config.model.mongoUrl.white)


    global.fields =
      user:
        known: ['_id','cohort','name','email','emailVerified','legacy','primaryPayMethodId','raw','location','auth','username','initials','bio','roles','photos','emails','meta']


    global.q =
      sortById: { sort: { _id: -1 } }
      exists: (fieldsStr) =>
        query = $or : []
        for attr in fieldsStr.split(' ')
          check = {}
          check[attr] = $exists: 1
          query['$or'].push check
        if query['$or'].length == 1
          query['$or']
        else
          query
      unset: (fieldsStr) =>
        $unset = {}
        $unset[attr] = "1" for attr in fieldsStr.split(' ')
        {$unset}

    global.inQuery = (ids, attr) ->
      attr = '_id' if !attr?
      q = {}
      q[attr] = { $in:_.map(ids,(id)->ObjectId(id)) }
      q


    global.renameModelAttr = (collectionName) ->
      (attrOld,attrNew,overwrite,cb) ->
        exists = {}
        exists[attrOld] = $exists: 1
        if !overwrite
          exists[attrNew] = $exists: 0
        up = $rename: {}
        up['$rename'][attrOld] = attrNew
        $log("rename.#{collectionName.toUpperCase()}.attr".magenta, attrOld.gray, '=>', attrNew.yellow)
        global[collectionName].updateMany exists, up, cb



    global.STRINGIFY = (obj) ->
      if !JSONSTRING[obj._id]
        JSONSTRING[obj._id] = JSON.stringify(obj).gray
      JSONSTRING[obj._id]


    EXPECT.attr = (obj, attr, constructor) ->
      expect(obj[attr], attr.white+" missing on: "+STRINGIFY(obj)).to.exist
      if (constructor)
        expect(obj[attr].constructor, "#{attr}.constuctor #{obj[attr].constructor.name.cyan} but expecting #{constructor.name.cyan} on: "+STRINGIFY(obj)).to.equal(constructor)


    # global.EXPECT.attrUndefined = (obj, attr) ->
    #   expect(obj[attr], attr.white+" shoud not be found on "+STRINGIFY(obj)).to.be.undefined


    global.refIncrement = (hashTable, key) ->
      if hashTable[key]
        hashTable[key]++
      else
        hashTable[key] = 1


    global.resolveResult = (collectionName, fixtureName) ->
      (key, expectsFn, cb) ->
        fixtureObj = FIXTURE[fixtureName][key]
        global[collectionName].findOne {_id:fixtureObj._id}, (e, r) ->
          if (r)
            expectObjIdsEqual(r, fixtureObj)
          expectsFn r, fixtureObj
          cb e, key


    global.expectObjectId = (val) ->
      expect(val, "Expected ObjectId null").to.exist
      expect(val.constructor is ObjectId, "Expected ObjectId #{val.toString().white}".gray+" #{val.constructor} not an ObjectId".gray).to.be.true


    global.expectAllPromises = (resolveFn, promObjList) ->
      newProm = (key) =>
        new Promise (resolve, reject) ->
          domain.create()
            .on('error', (e) ->
              console.log('UncaughtFail '.red, key, e.message.red)
              reject(e)
            )
            .run ->
              resolveFn key, promObjList[key], (e,r) ->
                if (e)
                  console.log('PassedFail '.red, key, e.message.re)
                  reject(e)
                else
                  console.log('Passed     '.green, key)
                  resolve(r)

      Promise.all(
          newProm(key) for key of promObjList
        )
        .then ((values)->$log('Passed     '.green, '(all)'||values);DONE()), DONE



    global.checkMergeRemovedGraph = (removed, cb) ->
      success = (r) ->
        # $log('inRemoved.success'.cyan)
        try
          opIdx = -1
          expect(r[++opIdx], "Removed USER should be removed").to.be.null
          expect(r[++opIdx], "Removed USER.Paymethods should be relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed USER.Posts should be removed or relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed USER.Requests should be relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed User.Bookings should be relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed User.Booking.participants should be relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed User.Orders should be relinked to Merged.userId").to.be.null
          expect(r[++opIdx], "Removed User.Payouts should be relinked to Merged.userId got #{r[opIdx]}").to.be.null
          expect(r[++opIdx], "Removed User.Payouts.released should be relinked to Merged.userId got #{r[opIdx]}").to.be.null
          expect(r[++opIdx], "Removed User.Expert should be relinked to Merged.userId").to.be.null
          if removed.expert?
            expect(r[++opIdx], "Removed Expert should be removed").to.be.null
            expect(r[++opIdx], "Removed Suggests[#{JSON.stringify(r[opIdx]).gray}] for [#{removed.expert._id}] should be relinked to Merged.expertId").to.be.null
            expect(r[++opIdx], "Removed Booked should be relinked to Merged.expertId").to.be.null
            expect(r[++opIdx], "Removed Expert payouts.lines.expert._id should be relinked to Merged.expertId [#{JSON.stringify(r[opIdx])}]").to.be.null
          cb()
        catch e
          DONE e

      ops = [
        Users.findOne('_id':removed.user._id),
        Paymethods.findOne({'userId':removed.user._id},{'userId':1}),
        Posts.findOne({'by._id':removed.user._id},{'by._id':1}),
        Requests.findOne({'userId':removed.user._id},{'userId':1}),
        Bookings.findOne({'customerId':removed.user._id},{'customerId':1}),
        Bookings.findOne({'participants.info._id':removed.user._id},{'expertId':1})
        Orders.findOne({$or:['userId':removed.user._id,'by._id':removed.user._id]},{'userId':1,'by':1}),
        Payouts.findOne({'userId':removed.user._id},{'userId':1}),
        Payouts.findOne({'lines.info.released.by._id':removed.user._id},{'lines.info.released':1}),
        Experts.findOne('userId':removed.user._id)
      ]

      if removed.expert?
        ops = ops.concat [
          Experts.findOne({'_id':removed.expert._id},{'userId':1}),
          Requests.findOne({'suggested.expert._id':removed.expert._id},{'suggested.expert':1}),
          Bookings.findOne({'expertId':removed.expert._id},{'expertId':1})
          Payouts.findOne({'lines.info.expert._id':removed.expert._id},{'expertId':1})
          # Orders.findOne({$or:['lines.info.expert._id':removed.expert._id,'lines.suggestion.expert._id':removed.expert._id]},{'userId':1,'lines':1}),
        ]

      Promise.all(ops).then(success, DONE)



    global.checkMergeMergedGraph = (u,expertId,{paymethods,posts,requests,bookings,suggests,booked,paidout,released}, cb) ->
      success = (r) ->
        try
          opIdx = -1
          expect(r[++opIdx].email).to.equal(u.email)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: paymethods mismatch").to.equal(paymethods||0)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: posts[#{posts}] mismatch").to.equal(posts||0)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: requests mismatch").to.equal(requests||0)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: bookings mismatch").to.equal(bookings||0)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: paidout mismatch").to.equal(paidout||0)
          expect(r[++opIdx].length, "#{u.name}[#{u._id}]: released mismatch").to.equal(released||0)
          if expertId?
            EXPECT.equalIds(r[++opIdx]._id, expertId)
            expect(r[++opIdx].length, "#{u.name}: suggests mismatch").to.equal(suggests||0)
            expect(r[++opIdx].length, "#{u.name}: booked mismatch").to.equal(booked||0)
          cb()
        catch e
          DONE e

      ops = [
        Users.findOne({'_id':u._id}),
        Paymethods.find({'userId':u._id},{'userId':1}).toArray(),
        Posts.find($or:[{'by._id':u._id},{'by.userId':u._id}],{'by':1}).toArray(),
        Requests.find({'userId':u._id},{'userId':1}).toArray(),
        Bookings.find({'customerId':u._id},{'customerId':1}).toArray()
        Payouts.find({'userId':u._id},{'userId':1}).toArray()
        Payouts.find({'lines.info.released.by._id':u._id},{'lines.info.released':1}).toArray()
      ]

      if expertId? then ops = ops.concat [
        Experts.findOne({'userId':u._id},{'userId':1}),
        Requests.find('suggested.expert._id':expertId,{'suggested.expert':1}).toArray(),
        Bookings.find({expertId},{'expertId':1}).toArray()
      ]

      Promise.all(ops).then(success, DONE)



    global.uInfoChain = (u) ->
      {posts,expert,suggests,booked,bookings,requests,paymethods,ordered,orders,paidout,released} = UserGraph[u._id]
      if !u.email&&!u.linked then u.email = ' '
      "\n#{idToMoment(u._id).format('YYMM.DD').gray}  " +
      "#{ (if posts then 'A'+posts else '--').yellow } " +
      "#{ (if paymethods then 'P'+paymethods else '--').white } " +
      "| ".gray +
      "#{ (if expert then 'E:' else '--').magenta } " +
      "#{ (if suggests then 'S'+suggests else '--').magenta } " +
      "#{ (if booked then 'B'+booked else '--').magenta } " +
      "#{ (if ordered then 'O'+ordered else '--').magenta } " +
      "#{ (if paidout then 'P'+paidout else '--').magenta } " +
      "| ".gray +
      "#{ (if orders then 'O'+orders else '--').green } " +
      "#{ (if bookings then 'B'+bookings else '--').green } " +
      "#{ (if requests then 'R'+requests else '--').green } " +
      "#{ (if released then 'r'+released else '--').green } " +
      "| ".gray +
      "#{ if u.linked && u.linked.gh then u.linked.gh.login.yellow+'\t' else ' '}" +
      "#{ if u.email then u.email.white else u.linked.gp.email.gray}" +
      "\t#{(u.name||'').cyan}" +
      "\t#{u._id}" +
      "#{ if UserGraph[u._id].expert then ':'.white+UserGraph[u._id].expert else ''}"



    if (done)
      done()

    express()
