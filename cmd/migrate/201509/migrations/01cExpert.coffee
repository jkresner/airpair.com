global.ExpertGraph = {}


checkClean = ->
  Experts.find({}).toArray (e, all) ->
    noRate = []
    crap = []
    for o in all
      expectObjectId(o._id)
      expectObjectId(o.userId)
      expect(o.rate && o.rate > 0, "rate for {o._id}").to.be.true
      # EXPECT.attr(o,'brief', String)
      EXPECT.attr(o,'tags')
      for t in o.tags
        EXPECT.attr(t,'_id',ObjectId)
        EXPECT.attr(t,'sort',Number)
        # expect(o.sort?, "tag no sort #{JSON.stringify(o)}").to.exist
      if !UserGraph[o.userId]
        $log('No user for Expert: '.red.dim, o)
      else
        expect(UserGraph[o.userId],"user doc for #{JSON.stringify(o)}").to.exist
        expect(UserGraph[o.userId].expert,"user already has expert[#{UserGraph[o.userId].expert}] #{JSON.stringify(o)}").to.be.undefined
        UserGraph[o.userId].expert = o._id
        ExpertGraph[o._id] = user: o.userId
    DONE()


cull = ->

  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) -> expect(o).to.exist
    mateiPavel: (o, orig) -> expect(o).to.be.null
    harryMoreno: (o, orig) -> expect(o).to.be.null
    seanLinsley: (o, orig) -> expect(o).to.exist
    jonathanChhabra: (o, orig) -> expect(o).to.be.null

  toCull = $or: [   {userId:{$exists:0}},
                    {rate:{$exists:0},
                    tags:{$eq:[]}}  ]

  Experts.find(toCull, {name:1,email:1}, q.sortById).toArray (e, experts) ->
    if experts.length == 0 then return checks()

    text = ''
    for o in experts
      text += "#{o._id} #{idToMoment(o._id, 'YYMMMDD|HH:mm')} \"#{o.name}\" <#{o.email}>\n"

    fileName = "#{__dirname}/../#{moment().format('YYYYMMDD')}culledExperts[#{experts.length}].txt"
    fs.writeFile fileName, text, ->
      Experts.remove toCull, (e,r) ->
        $log('delete.EXPERT.noUserId'.yellow, r.result.n)
        checks()


unsets = ->

  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) ->
      expectExactFields(o, ['_id','availability','brief','gmail','rate','tags','userId'])
    alexandruVladutu: (o, orig) ->
      expectExactFields(o, ['_id','availability','brief','gmail','rate','tags','userId','activity'])
      expectExactFields(o.availability, ['minRate','status','hours'])
    # seanLinsley: (o, orig) ->
      # expectExactFields(o, ['_id','availability','rate','tags','userId','activity'])


  attrs = 'bookMe email homepage timezone location user mojo '+
          'username matching pic name lastTouch minRate reviews '+
          'bb gh in so tw gp karam'
            # 'activity.utc',
            # deals


  $unset = {}
  $unset[attr] = 1 for attr in attrs.split(' ')
  $log('unset.EXPERT.attrs'.yellow, attrs.gray)
  Experts.updateMany {}, {$unset}, checks



consistentData = ->
  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) ->
      expectExactFields(o, ['_id','availability','brief','gmail','rate','tags','userId'])
    # seanLinsley: (o, orig) ->
      # expectExactFields(o, ['_id','availability','rate','tags','userId','activity'])

  Experts.updateMany { 'availability.status': { $exists: 0} }, { $unset: {availability:1} }, checks


# TODO BEFORE DEPLOY
migratesOlderTags = ->

  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) ->
      expect(o.tags.length).to.equal(8)
      EXPECT.equalIds(o.tags[0]._id, FIXTURE.tags.android._id)
      expect(o.tags[0].sort).to.equal(0)
      EXPECT.equalIds(o.tags[3]._id, FIXTURE.tags.javascript._id)
      expect(o.tags[3].sort).to.equal(3)
      EXPECT.equalIds(o.tags[5]._id, FIXTURE.tags["ruby-on-rails"]._id)
      expect(o.tags[5].sort).to.equal(5)
      EXPECT.equalIds(o.tags[7]._id, "5181d0aa66a6f999a465ece5")
      expect(o.tags[7].sort).to.equal(7)
    alexandruVladutu: (o, orig) ->
      expect(o.tags.length).to.equal(6)
      expectObjIdsEqual(o.tags[0], EXPERT.alexandruVladutu.tags[0])
      expect(o.tags[0].sort).to.equal(0)
      expectObjIdsEqual(o.tags[3], EXPERT.alexandruVladutu.tags[3])
      expect(o.tags[3].sort).to.equal(3)
      expectObjIdsEqual(o.tags[5], EXPERT.alexandruVladutu.tags[5])
      expect(o.tags[5].sort).to.equal(5)


  changed = ['c#','c#-4.0','f#','ionic-framework']
  ups = []
  newSlimTag = (tId, sort) -> { _id: ObjectId(tId.toString()), sort }

  Experts.find({}, {tags:1}).toArray (e, all) ->
    ops = []
    for o in all
      q = {_id:o._id}
      migrate = false
      consistentTags = []
      sort = 0
      for t in o.tags
        if t.sort? && (t._id.constructor is ObjectId)
          expectExactFields t, ['_id','sort']
          consistentTags.push t
        else
          if t._id?
            expect(TagIds[t._id], "tag._id expected to exist #{JSON.stringify(t)}").to.exist
            consistentTags.push newSlimTag(t._id,sort++)
          else
            expect(TagsBySlug[t.soId]?||_.contains(changed, t.soId))
            if t.soId.indexOf('c#') != -1
              t.soId = t.soId.replace('c#','c%23')
            if t.soId == 'f#'
              t.soId =  'f%23'
            if t.soId == 'ionic-framework'
              t.soId = 'ionic'
            consistentTags.push newSlimTag(TagsBySlug[t.soId]._id,sort++)
          migrate = true

      if migrate
        ops.push updateOne: { q, u: { $set: { tags: consistentTags } }, upsert: false }

    if ops.length == 0 then return checks()
    Experts.bulkWrite ops, {ordered:false}, (e,r) ->
      $log('bulk.EXPERTS.modified'.yellow, r.modifiedCount)
      checks()



module.exports = ->

  specInit(@)


  # DESCRIBE 'MIGRATE', ->
  #   IT "Cull experts without userId", cull
  #   IT "Can unset undesired attrs", unsets
  #   IT "Consistentify experts", consistentData
  #   IT "All tags are slim", migratesOlderTags


  DESCRIBE 'CHECK', ->
    IT "Clean", checkClean


