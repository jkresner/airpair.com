global.TagsBySlug = {}
global.TagIds = {}


migrated =
  attrs_gone: '__v',
  badSlugs:
    'objectivec': 'objective-c',
    'knockout': 'knockout.js',
    'sqlserver': 'sql-server',
    'mvc4': 'asp.net-mvc-4',
    'zend': 'zend-framework',
    'games': 'game-engine',
    'ef': 'entity-framework',
    'actionscript3': 'actionscript-3',
    'dynamodb': 'amazon-dynamodb',
    'dynamicscrm': 'dynamics-crm',


# no (known) ditry data
checkClean = ->
  badSlugs = _.keys(FIXTURE.tags.badSlugs)
  Tags.find(slug:{$in:badSlugs},{_id:1}).toArray (e,r) ->
    expect(r.length).to.equal(0)
    DONE()


# expected fields exist
checkConsistent = ->
  Tags.find({}).toArray (e, all) ->
    for o in all
      expectObjectId(o._id)
      expectAttr(o, 'name', String)
      expectAttr(o, 'slug', String)
      expect(o[attr]).to.be.undefined for attr in migrated.attrs_gone.split(' ')

      TagsBySlug[o.slug] = o
      TagIds[o._id] = true
    DONE()


cleanSlugs = (done) ->
  update = 0
  {badSlugs} = FIXTURE.tags
  for slug in _.keys(badSlugs)
    Tags.update { slug }, { $set: { slug: badSlugs[slug] } }, (e, r) ->
      expect(e).to.be.undefined
      if ++updated == badSlugs.length
        DONE()


unsetAttrs = ->
  Tags.updateMany {}, q.unset(attrs_gone), ->
    DONE()



module.exports = ->

  specInit(@)

  # DESCRIBE 'MIGRATE', ->
  #   IT "Clean tag slugs", cleanSlugs
  #   IT "Unset attrs gone", unsetAttrs

  DESCRIBE 'CHECK', ->
    IT "Clean", checkClean
    IT "Consistent", checkConsistent
