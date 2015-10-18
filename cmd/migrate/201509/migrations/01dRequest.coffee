

checkCONSISTENT = ->
  Requests.find({},{by:1,company:1,userId:1,status:1,tags:1,'suggested.expertStatus':1,'suggested.expert':1}).toArray (e, all) ->
    count = 0
    noUser = 0
    for o in all
      count++
      expect(o.by, "by does not exist for #{o._id}[#{count}]").to.exist
      expect(o.userId, "userId does not exist for #{o._id}[#{count}]").to.exist
      expect(o.userId.constructor == ObjectId).to.be.true
      expect(o.status, "status does not exist for #{o._id}[#{count}]").to.exist
      expect(o.tags, "tags does not exist for #{o._id}[#{count}]").to.exist

      # $log('request[]', UserGraph[o.userId])
      if !UserGraph[o.userId]?
        # $log("No user[#{o.userId}] for request[#{o._id}][#{count}]")
        noUser++
      else
        refIncrement UserGraph[o.userId], 'requests'

      for s in o.suggested || []
        expect(s.expert._id, "s.expert._id does not exist for #{o._id}").to.exist
        expect(s.expert._id.constructor == ObjectId, "s.expert._id no an ObjectId for #{o._id}").to.exist
        if (s.expert.userId)
          $log("#{idToMoment(o._id,'YY.MM')} [#{o._id}]")
        else
          expect(s.expert.userId, "s.expert.userId should not exist for #{o._id}").to.be.undefined

        expect(s.expertStatus, "s.expertStatus should exist for #{o._id}").to.exist
        # $log('ExpertGraph[s.expert._id]', ExpertGraph[s.expert._id])
        if ExpertGraph[s.expert._id]?
          userId = ExpertGraph[s.expert._id].user
          expect(userId, "s.expert._id => userId #{s}").to.exist
          refIncrement UserGraph[userId], 'suggests'

    $log('noUser', noUser)
    DONE()




migratesOlderTags = ->

  checks = -> expectAllPromises resolveResult('Requests','requests'),
    zesty1: (o, orig) ->
      expectIdsEqual(o._id, orig._id)
      expectExactFields(o.by,['name','email','avatar','org'])
      expect(o.by.name).to.equal("Chris Hollindale")
      expect(o.tags.length).to.equal(2)
      expectIdsEqual(o.tags[0]._id, FIXTURE.tags['ruby-on-rails']._id)
      expect(o.tags[0].sort).to.equal(0)
      expectIdsEqual(o.tags[1]._id, "5181d0aa66a6f999a465ed67")
      expect(o.tags[1].sort).to.equal(1)
      expectExactFields(o.tags[1],['_id','sort'])
      expect(o.events).to.be.undefined
      expect(o.suggested.length).to.equal(3)
      expectExactFields(o.suggested[0],['_id','expertRating','expertFeedback','expertComment','expertAvailability','expertStatus','expert'])
      expectExactFields(o.suggested[0].expert,['_id','email','rate'])
    btownsend: (o, orig) ->
      expect(o.type).to.equal("advice")
      expect(o.status).to.equal("complete")
      expect(o.title).to.equal("2 hour aws, angularjs and web-applications advice")
      expect(o.budget).to.equal(210)
      expectExactFields(o.by,['name','email','avatar'])
      expect(o.by.name).to.equal("Ben Townsend")
      expectIdsEqual(o.userId,"55e78240d409a1110093d252")
      expect(o.marketingTags).to.be.undefined
      expect(o.user).to.be.undefined
      expect(o.messages.length).to.equal(1)
      expect(o.adm).to.exist
      expect(o.lastTouch).to.exist
      expect(o.tags.length).to.equal(3)
      expectIdsEqual(o.tags[0]._id, "5181d0aa66a6f999a465ecfe")
      expect(o.tags[0].sort).to.equal(0)
      expectIdsEqual(o.tags[1]._id, "5398a4831c67d1a4859d3476")
      expect(o.tags[1].sort).to.equal(1)
      expectExactFields(o.tags[1],['_id','sort'])
      expectIdsEqual(o.tags[2]._id, "514825fa2a26ea0200000007")
      expect(o.tags[2].sort).to.equal(2)
      expect(o.suggested.length).to.equal(7)
      expectExactFields(o.suggested[0].expert,['_id','email','rate','location','timezone','tags'])
      expect(o.suggested[0].expert.email).to.equal("josh@phoenixdevops.com")
      expect(o.suggested[0].expert.tags.length).to.equal(3)
      expectIdsEqual(o.suggested[0].expert.tags[0]._id, "514825fa2a26ea0200000007")
      expect(o.suggested[0].expert.tags[0].sort).to.equal(0)
      expectExactFields(o.suggested[0].expert.tags[0],['_id','sort'])
      expectIdsEqual(o.suggested[0].expert.tags[1]._id, "5181d0ab66a6f999a465ef77")
      expect(o.suggested[0].expert.tags[1].sort).to.equal(1)
      expectExactFields(o.suggested[0].expert.tags[1],['_id','sort'])
      expectIdsEqual(o.suggested[0].expert.tags[2]._id, "5358c8081c67d1a4859d2f18")
      expect(o.suggested[0].expert.tags[2].sort).to.equal(2)
      expectExactFields(o.suggested[0].expert.tags[2],['_id','sort'])


  ups = []

  newSlimTag = (tId, sort) -> { _id: tId, sort }
  slimTagForT = (t, sort) ->
    if t.sort?
      # $log('t'.yellow, t)
      expect(t._id, "tag._id expected to exist #{JSON.stringify(t)}").to.exist
      # expectExactFields t, ['_id','sort']
      newSlimTag(t._id,sort)
    else if t._id?
      expect(TagIds[t._id], "tag._id expected to exist #{JSON.stringify(t)}").to.exist
      newSlimTag(t._id,sort++)
    else
      expect(t.soId, "tag.soId expected to exist #{JSON.stringify(t)}").to.exist
      expect(TagsBySlug[t.soId]).to.exist #?||_.contains(changed, t.soId)
      newSlimTag(TagsBySlug[t.soId]._id,sort++)


  Requests.find({}, {userId:1,tags:1,suggested:1,company:1,by:1}).toArray (e, all) ->
    toMigrate = {}
    for o in all
      expect(o.userId, "expecting userId exists for request #{o._id}").to.exist
      reqBy = o.by
      if !o.by? and o.company?
        reqBy =
          avatar: o.company.contacts[0].pic
          name: o.company.contacts[0].fullName
          email: o.company.contacts[0].email
          org: { name: o.company.name, _id: o.company._id }

      expect(reqBy.name, "expecting by.name exists for request #{o._id}").to.exist

      consistentTags = []
      sort = -1
      for t in o.tags
        consistentTags.push slimTagForT(t, ++sort)

      expect(o.suggested, "expecting suggested #{JSON.stringify(o)}").to.exist
      consistentSug = []
      for s in o.suggested
        sug = _.omit(s,'events','expert')
        sug.expert = _.pick(s.expert,'_id','rate','timezone','location','email')
        if s.expert.tags
          expertTagSort = -1
          tags = []
          expect(s.expert.tags.length, "expecting suggested expert to have tags #{JSON.stringify(s)}").to.exist
          for t in s.expert.tags
            tags.push slimTagForT(t, ++expertTagSort)
          sug.expert.tags = tags
        consistentSug.push sug

      toMigrate[o._id] = { by: reqBy, tags: consistentTags, suggested: consistentSug }

    for _id of toMigrate
      ups.push( updateOne: { q: {_id:ObjectId(_id)}, u: { $set: toMigrate[_id] }, upsert: false } )

    if ups.length == 0 then return checks()
    Requests.bulkWrite ups, {ordered:false}, ->
      Requests.updateMany {}, {$unset:{company:1}}, ->
        checks()


unsets = ->
  attrs = ['events','base','user',
    # 'suggested.expert.bookMe.enabled',
    'marketingTags']
  $unset = {}
  $unset[attr] = 1 for attr in attrs
  $log('unset.REQUEST.attrs'.yellow, attrs.join(','))
  Requests.updateMany {}, {$unset}, ->
    DONE()


culls = ->
  Requests.remove inQuery(FIXTURE.requests.unMigratedBookMe), (e,r) ->
    DONE()



module.exports = ->


  specInit(@)


  # DESCRIBE 'MIGRATE', ->
    # IT "Can unset undesired attrs", unsets
    # IT "Tags are all slim", migratesOlderTags
    # IT "Culls strange ones", culls


  DESCRIBE 'CHECK', ->
    IT "Consistent", checkCONSISTENT


