cull = ->

  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) -> expect(o).to.exist
    mateiPavel: (o, orig) -> expect(o).to.be.null
    harryMoreno: (o, orig) -> expect(o).to.be.null
    seanLinsley: (o, orig) -> expect(o).to.exist
    jonathanChhabra: (o, orig) -> expect(o).to.be.null

  toCull = $or: [   {userId:{$exists:0}},
                    {rate:{$exists:0},tags:{$eq:[]}}  ]

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
    seanLinsley: (o, orig) ->
      expectExactFields(o, ['_id','availability','rate','tags','userId','activity'])


  attrs = ['bookMe','email','homepage','timezone','location','user','mojo',
           'username','matching','pic','name','lastTouch','minRate','reviews',
            # 'activity.utc',
           'bb','gh','in','so','tw','gp']

  $unset = {}
  $unset[attr] = 1 for attr in attrs
  $log('unset.EXPERT.attrs'.magenta, attrs.join(',').gray)
  Experts.updateMany {}, {$unset}, checks



consistentData = ->
  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) ->
      expectExactFields(o, ['_id','availability','brief','gmail','rate','tags','userId'])
    seanLinsley: (o, orig) ->
      expectExactFields(o, ['_id','rate','tags','userId','activity'])

  Experts.updateMany { 'availability.status': { $exists: 0} }, { $unset: {availability:1} }, checks


migratesOlderTags = ->

  checks = -> expectAllPromises resolveResult('Experts','experts'),
    ashokVarma: (o, orig) ->
      expect(o.tags.length).to.equal(8)
      expectIdsEqual(o.tags[0]._id, FIXTURE.tags.android._id)
      expect(o.tags[0].sort).to.equal(0)
      expectIdsEqual(o.tags[3]._id, FIXTURE.tags.javascript._id)
      expect(o.tags[3].sort).to.equal(3)
      expectIdsEqual(o.tags[5]._id, FIXTURE.tags["ruby-on-rails"]._id)
      expect(o.tags[5].sort).to.equal(5)
      expectIdsEqual(o.tags[7]._id, "5181d0aa66a6f999a465ece5")
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
  newSlimTag = (tId, sort) -> { _id: tId, sort }

  Experts.find({}, {tags:1}).toArray (e, all) ->
    ops = []
    for o in all
      q = {_id:o._id}
      migrate = false
      consistentTags = []
      sort = 0
      for t in o.tags
        if t.sort?
          expectExactFields t, ['_id','sort']
          consistentTags.push t
        else
          if t._id?
            expect(tagIds[t._id], "tag._id expected to exist #{JSON.stringify(t)}").to.exist
            consistentTags.push newSlimTag(t._id,sort++)
          else
            expect(tagsBySlug[t.soId]?||_.contains(changed, t.soId))
            if t.soId.indexOf('c#') != -1
              t.soId = t.soId.replace('c#','c%23')
            if t.soId == 'f#'
              t.soId =  'f%23'
            if t.soId == 'ionic-framework'
              t.soId = 'ionic'
            consistentTags.push newSlimTag(tagsBySlug[t.soId]._id,sort++)
          migrate = true

      if migrate
        ops.push updateOne: { q, u: { $set: { tags: consistentTags } }, upsert: false }

    if ops.length == 0 then return checks()
    Experts.bulkWrite ops, {ordered:false}, (e,r) ->
      $log('bulk.EXPERTS.modified'.yellow, r.modifiedCount)
      checks()




module.exports = ->

  specInit(@)

  describe 'Migrating expert fields'.white.bold, ->

    before (done) ->
      done()

    IT "Cull experts without userId", cull
    IT "Can unset undesired attrs", unsets
    IT "Consistentify experts", consistentData
    IT "All tags are slim", migratesOlderTags
    # IT "Reattach orphened profiles", reattach

