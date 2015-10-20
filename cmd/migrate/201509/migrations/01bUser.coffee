global.UserGraph = {}

MIGRATED =
  attrs_gone:  '__v local social googleId localization ' +
               'bitbucketId bitbucket githubId github linkedinId '+
               'linkedin stackId stack twitterId twitter '
  projectedGH: ["tokens","updated_at","created_at","following","followers","public_gists",
                "public_repos","bio","hireable","email","location","blog","company",
                "name","gravatar_id","avatar_url","id","login"]


# no (known) ditry data
checkCLEAN = ->
  unclean = $or: [
    'social':{$exists:1}
    'auth.gp.verified_email':{$eq:"true"}
  ]
  Users.find(unclean,{_id:1}).toArray (e,r) ->
    expect(r.length, 'found: '+r.length+', for '+JSON.stringify(unclean).gray).to.equal(0)
    DONE()


# expected fields exist
checkCONSISTENT = ->
  Users.find({}).toArray (e, all) ->
    for o in all
      expectObjectId(o._id)
      expectAttr(o, 'name')
      expectAttr(o, 'auth')

      expect(o[attr]).to.be.undefined for attr in MIGRATED.attrs_gone

      UserGraph[o._id] = { name: o.name || o.auth.gp.name }
      if _.get(o,'auth.gh.id')
        UserGraph[o._id]['gh'] = o.auth.gh.id

    Paymethods.find({}, {'userId':1}).toArray (e, all) ->
      count = 0
      for o in all
        count++
        if UserGraph[o.userId]?
          refIncrement UserGraph[o.userId], 'paymethods'
        else
          # $log(o)

      DONE()


renameAttrs = ->

  rename = renameModelAttr('Users')

  location = (cb) ->
    rename 'localization.timezoneData.timeZoneId', 'location.timeZoneId', true, ->
      rename 'localization.location', 'location.name', true, ->
        rename 'localization.locationData.name', 'location.shortName', true, ->
          rename 'localization.locationData', 'raw.locationData', true, cb

  social = (cb) ->
    rename 'google', 'social.gp', true,  ->
      rename 'bitbucket', 'social.bb', false,  ->
        rename 'github', 'social.gh', false, ->
          rename 'linkedin', 'social.in', false, ->
            rename 'stack', 'social.so', false, ->
              rename 'twitter', 'social.tw', false, cb
#                 # rename 'angel', 'social.al', false, ->

  auth = (cb) ->
    rename 'local.password', 'auth.password.hash', true, ->
      rename 'social.so', 'auth.so', true, ->
        rename 'social.gp._json', 'auth.gp', true, ->
          rename 'social.bb._json.user', 'auth.bb', true, ->
            rename 'social.gh._json', 'auth.gh', true, ->
              rename 'social.in._json', 'auth.in', true, ->
                rename 'social.tw._json', 'auth.tw', true, ->
                  rename 'social.al._json', 'auth.al', true, ->
                    rename 'social.sl', 'auth.sl', true, cb

  tokens = (cb) ->
    rename 'social.gp.token', 'auth.gp.tokens.apcom', true, ->
      rename 'social.gh.token', 'auth.gh.tokens.apcom', true, ->
        rename 'social.bb.token', 'auth.bb.tokens.apcom', true, ->
          rename 'social.in.token', 'auth.in.tokens.apcom', true, ->
            rename 'social.tw.token', 'auth.tw.tokens.apcom', true, ->
              rename 'social.al.token', 'auth.al.tokens.apcom', true, ->
                rename 'auth.so.token', 'auth.so.tokens.apcom', true, ->
                  rename 'auth.sl.token', 'auth.sl.tokens.apcom.token', true, cb

  legacy = (cb) ->
    rename 'siteNotifications', 'legacy.siteNotifications', true, ->
      rename 'tags', 'legacy.tags', true, ->
        rename 'bookmarks', 'legacy.bookmarks', true, cb


  location -> social -> auth -> tokens -> legacy ->

    expectAllPromises resolveResult('Users','premigrated'),
      maxAltschuler: (u, orig) ->
        expectIdsEqual(orig._id, FIXTURE.premigrated.maxAltschuler._id)
        expectIdsEqual(u._id, orig._id)
        expect(u.google).to.be.undefined
        expect(u.auth.gp.id).to.equal(orig.google.id)
        expect(u.auth.gp.provider).to.be.undefined
        expect(u.auth.gp.verified_email is true).to.be.true
      alyssaRavasio: (u, orig) ->
        expect(u.github).to.be.undefined
        expect(u.google).to.be.undefined
        expect(u.linkedin).to.be.undefined
        expect(u.cohort.engagement).to.exist
        expect(u.auth.gh.login).to.equal(orig.github.username)
        expect(u.auth.gh.username).to.be.undefined
        expect(u.auth.gp.verified_email).to.be.true
        expect(u.auth.in.id).to.equal(orig.linkedin.id)
        expect(u.auth.in.firstName).to.equal(orig.linkedin.name.givenName)
      steveLuu: (u, orig) ->
        expect(u.auth.gp.id).to.equal(orig.google.id)
        # expect(u.auth.gp.verified_email is "true").to.be.true
      katharineVanderDrift: (u, orig) ->
        expectExactFields(u.location,'name timeZoneId shortName')
        expect(u.location.name).to.equal('San Francisco, CA, USA')
        expect(u.location.shortName).to.equal('San Francisco')
        expect(u.location.timeZoneId).to.equal('America/Los_Angeles')



unsetAttrs = ->
  toUnset = MIGRATED.attrs_gone +
    'cohort.expert cohort.engagement.visits cohort.engagement.visit_last cohort.maillists'
  toUnset += v.replace(/ /g," auth.#{k}.") for k,v of {
    sl: ' provider'
    gp: ' token.attributes.refreshToken'
    so: ' is_employee provider'
    bb: ' is_staff is_team resource_uri'
    gh: ' site_admin type received_events_url events_url repos_url organizations_url'+
        ' subscriptions_url starred_url gists_url following_url followers_url html_url'+
        ' url collaborators plan private_gists total_private_repos owned_private_repos'+
        ' disk_usage token.attributes.refreshToken'
    tw: ' status statuses_count id_str entities profile_background_color' +
        ' profile_background_image_url profile_background_image_url_https' +
        ' profile_background_tile profile_image_url_https profile_sidebar_border_color' +
        ' profile_sidebar_fill_color profile_text_color profile_use_background_image' +
        ' default_profile default_profile_image contributors_enabled is_translator' +
        ' is_translation_enabled follow_request_sent profile_link_color'
  }

  $log('unsetAttrs'.yellow, toUnset.gray)
  Users.updateMany {}, q.unset(toUnset), ->
    expectAllPromises resolveResult('Users','premigrated'),
      maxAltschuler: (u, orig) ->
        expectExactFields(u, '_id auth')
        expectExactFields(u.auth, ['gp'])
        expectExactFields(u.auth.gp, ['tokens'], _.keys(orig.google._json))
      alyssaRavasio: (u, orig) ->
        expectExactFields(u, '_id auth cohort')
        expectExactFields(u.auth, 'gp in gh')
        expectExactFields(u.auth.in, 'id firstName lastName tokens')
        expectExactFields(u.auth.gh, MIGRATED.projectedGH)
      steveLuu: (u, orig) ->
        expectExactFields(u, '_id auth')
        expectExactFields(u.auth, ['gp'])
        expectExactFields(u.auth.gp, 'tokens', _.keys(orig.google._json))
        if u.auth.gp.verified_email is not true
          expect(u.auth.gp.verified_email).to.equal("true")
      katharineVanderDrift: (u, orig) ->
        expectExactFields(u,'_id cohort name email emailVerified legacy primaryPayMethodId raw location auth')
        expectExactFields(u.raw,['locationData'])
        expect(u.location.name).to.equal('San Francisco, CA, USA')
        expect(u.location.shortName).to.equal('San Francisco')
        expect(u.location.timeZoneId).to.equal('America/Los_Angeles')
      johnSimons2: (u, orig) ->
        expectExactFields(u, global.fields.user.known)
        expectExactFields(u.auth, 'gh gp tw bb in so sl')
        expect(u.auth.bb.tokens.apcom.token).to.exist
        expect(u.auth.bb.tokens.apcom.attributes.refreshToken).to.exist
        expect(u.auth.gh.tokens.apcom.token).to.exist
        expect(u.auth.gp.tokens.apcom.token).to.exist
        expect(u.auth.in.tokens.apcom.token).to.exist
        expect(u.auth.so.tokens.apcom.token).to.exist
        expect(u.auth.sl.tokens.apcom.token).to.exist
        expect(u.auth.tw.tokens.apcom.attributes.refreshToken).to.exist
        expectExactFields u.auth.sl, 'tokens', _.without(_.keys(orig.social.sl),'token')
        expectExactFields u.auth.gh, MIGRATED.projectedGH
      jkresnergmail: (u, orig) ->
        expectExactFields(u, _.without(global.fields.user.known,'siteNotifications','roles'))
        expectExactFields(u.auth, 'gh gp al sl password')
        expect(u.auth.al.provider).to.be.undefined
        expect(u.auth.al.tokens.apcom.token).to.exist
        expect(u.raw.timezoneData).to.be.undefined


cleanAuthGoogle = ->
  checks = ->
    expectAllPromises resolveResult('Users', 'premigrated'),
      steveLuu: (u, orig) ->
        expectObjIdsEqual(u, FIXTURE.premigrated.steveLuu)
        expect(u.auth.gp.verified_email).to.equal(true)

  Users.updateMany {'auth.gp.verified_email':{$eq:"true"}}, {$set:{'auth.gp.verified_email':true}}, (e,r) ->
    if r.result.nModified
      $log('update.USERS.gp.verified_email=="true"'.yellow, r.result.nModified)

    noGooleName = 'auth.gp':{$exists:1}, $or:[{'auth.gp.name':{$eq:null}},{'auth.gp.name':{$eq:''}}]
    Users.find(noGooleName, { 'auth.gp': 1 }).toArray (e, u1) ->
      if !u1 or u1.length == 0
        checks()
      else
        $log('update.USERS.auth.gp.name'.yellow, u1.length)
        ups = _.map u1, (u) -> updateOne: { q:{_id:u._id}, u:{$set:{'auth.gp.name':u.auth.gp.email.split('@')[0] }} }
        Users.bulkWrite ups, {ordered:false}, checks


setName = ->
  Users.find(name:{$exists:0},{'auth.gp.name':1,'auth.gh.name':1,'auth.gp.email':1}).toArray (e, users) ->
    $log('update.set.Name'.yellow, users.length)
    ups = []
    for u in users
      name = _.get(u,'auth.gh.name') || _.get(u,'auth.gp.name')
      if !name
        gmail = _.get(u,'auth.gp.email')
        expect(gmail).to.exist
        name = gmail.split('@')[0]
      # u.email = u.email || _.get(u,'linked.gp.email')
      # expect(u.email).to.exist
      ups.push
        updateOne:
          q: {_id:u._id},
          u: { $set: { name } },
          upsert : false

    Users.bulkWrite ups, {ordered:false}, (e, r) ->
      DONE(e)


module.exports = ->

  specInit(@)


  # DESCRIBE 'MIGRATE', ->
  #   IT "Rename login attrs", renameAttrs
  #   IT "Clean auth.google data", cleanAuthGoogle
  #   IT "Unset attrs gone", unsetAttrs
  #   IT "Sets name for all users", setName


  DESCRIBE 'CHECK', ->
    IT "Clean", checkCLEAN
    IT "Consistent", checkCONSISTENT



