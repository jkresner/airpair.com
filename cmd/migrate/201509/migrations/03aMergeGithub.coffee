MERGE = require('../merge')

$log('merges', _.keys(FIXTURE.merges))


getDups = (key, githubId, cb) ->
  domain.create().on('error', DONE)
    .run ->
      uaId = FIXTURE.merges[key].a.user._id
      ubId = FIXTURE.merges[key].b.user._id
      Users.findOne {_id:uaId}, (e,uA) ->
        Users.findOne {_id:ubId}, (e,uB) ->
          if (uA) then expect(uA.linked.gh.id).to.equal(githubId)
          if (uB) then expect(uB.linked.gh.id).to.equal(githubId)
          # $log('going.in', key, uA != null, uB != null)
          cb uaId, ubId, uA, uB



mergeDups = (uaId, ubId, githubId, overrides, mergedExpertId, expects, cb) ->
  domain.create().on('error', DONE).run ->
    Users.findOne {_id:ObjectId(uaId)}, (e,uA) ->
      Users.findOne {_id:ObjectId(ubId)}, (e,uB) ->
        # $log('uA'.red, uA)
        if (uA) then expect(uA.linked.gh.id).to.equal(githubId)
        if (uB) then expect(uB.linked.gh.id).to.equal(githubId)
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
    # $log('mergeDups'.cyan, key, U.A, U.B, U.G, O, U.E, _.omit(R,'fn'))
    mergeDups U.A, U.B, U.G, O, U.E, _.omit(R,'fn'), (e, r) ->
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






# 1404.17   E R7   nmeans    nmeans@gmail.com          Nickolas Means  534edf9b1c67d1a4859d2daa
# 1310.03          nmeans    nick@heliumsyndicate.com  Nickolas Means  524c75a766a6f999a465f8b8
merge_nmeans = ->
  overrides =
    linked: gp:{email:'nmeans@gmail.com'}
  getDups 'nmeans', 568, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) ->
      M = merged.user || replay
      expectObjIdsEqual(M,uB)
      expect(M.primaryPayMethodId).to.be.undefined
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('nmeans@gmail.com')
      expect(M.emails[0].primary).to.be.true
      expect(M.emails[0].verified).to.be.true
      expect(M.emails[1].value).to.equal('nick@heliumsyndicate.com')
      expect(M.emails[1].primary).to.be.undefined
      expect(M.emails[1].verified).to.be.false

      checkMergeMergedGraph M, FIXTURE.merges.nmeans.a.expert._id, { paymethods: 0, suggests: 7 }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uA)
        checkMergeRemovedGraph removed, ->
          DONE()

# A:: 1408.11 53e7bc088f8c80299bcc4085     E R3   jarektkaczyk    jarek@softonsofa.com     Jarek Tkaczyk,
# B:: 1407.11 53bea6778f8c80299bcc38c6     E      jarektkaczyk    jarek.tkaczyk@gmail.com  Jarek Tkaczyk
merge_jarektkaczyk = ->
  overrides =
    linked: { gp:{email:'jarek@softonsofa.com'}}
  getDups 'jarektkaczyk', 6928818, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) ->
      M = merged.user || replay
      expectObjIdsEqual(M,uB)
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('jarek@softonsofa.com')
      expect(M.emails[0].primary).to.be.true
      expect(M.emails[0].verified).to.be.true
      expect(M.emails[1].value).to.equal('jarek.tkaczyk@gmail.com')
      expect(M.emails[1].primary).to.be.undefined
      expect(M.emails[1].verified).to.be.true
      expect(M.tags.length).to.equal(6)
      expect(M.username).to.be.undefined
      expect(M.initials).to.be.undefined
      expect(M.bio).to.be.undefined
      expect(M.location).to.be.undefined
      expect(M.name).to.equal('Jarek Tkaczyk')
      expectExactFields(M.linked, ['password','gh','gp','so','tw'])
      checkMergeMergedGraph M, FIXTURE.merges.jarektkaczyk.b.expert._id, { suggests: 3 }, ->
        if replay then return DONE()
        checkMergeRemovedGraph removed, ->
          DONE()


# 1403.27 53334ae71c67d1a4859d29f8  E R20 B6 | P2  Johnsel  jammsimons@gmail.com John Simons
# 1310.11 5256d46566a6f999a465f9c3  E              Johnsel  johnny@totalitee.nl  Johnny Simons
merge_Johnsel = ->
  overrides =
    linked: { gp:{email:'jammsimons@gmail.com'}}, name: 'John Simons'
  getDups 'johnsel', 537075, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) ->
      M = merged.user || replay
      expectObjIdsEqual(M,uB)
      expectObjIdsEqual(M,FIXTURE.merges.johnsel.a.user,'primaryPayMethodId')
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('jammsimons@gmail.com')
      expect(M.emails[0].primary).to.be.true
      expect(M.emails[0].verified).to.be.true
      expect(M.siteNotifications.length).to.equal(1)
      expect(M.meta.activity.length).to.equal(1)
      expect(M.bookmarks).to.be.undefined
      expect(M.tags).to.be.undefined
      expect(M.username).to.equal('johnsel')
      expect(M.initials).to.equal('js')
      expect(M.bio).to.equal(FIXTURE.merges.johnsel.a.user.bio)
      expect(M.location.timeZoneId).to.equal('Europe/Amsterdam')
      expect(M.location.name).to.equal('Maastricht, Nederland')
      expect(M.location.shortName).to.equal('Maastricht')
      expect(M.name).to.equal('John Simons')
      expectExactFields(M.linked, ['gp','in','so','tw','bb','gh','sl'])

      checkMergeMergedGraph M, FIXTURE.merges.johnsel.b.expert._id, { paymethods: 2, suggests: 20, booked: 6, paidout: 5 }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uA)
        expectObjIdsEqual(removed.expert,FIXTURE.merges.johnsel.a.expert)
        checkMergeRemovedGraph removed, ->
          DONE()


 # B:: 1502.28 54f11fb54499800c00f1e9b9          carlsmith     csmith@thinkful.com  Carl Smith,
 # A:: 1406.17 539f1e9f1c67d1a4859d3505     E    carlsmith     carl.input@gmail.com Carl Smith
merge_carlsmith = ->
  overrides =
    linked: gp:{email:'carl.input@gmail.com'}
  getDups 'carlsmith', 7561668, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) =>
      M = merged.user || replay
      expectObjIdsEqual(M,uA)
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('carl.input@gmail.com')
      expect(M.siteNotifications.length).to.equal(1)
      expect(M.location.name).to.equal("Cambridge, Cambridge, UK")
      expect(M.initials).to.equal("cs")
      expect(M.username).to.equal("csmith")
      expect(M.bio).to.equal("I currently mentor Python and Front End Web Development, and work on an open source CoffeeScript shell. I'm strongest on the more abstract aspects of programming, but have industry experience building applications on App Engine too.")
      expect(M.cohort).to.exist
      expect(M.tags.length).to.equal(3)
      checkMergeMergedGraph M, FIXTURE.merges.carlsmith.a.expert._id, { }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uB)
        checkMergeRemovedGraph removed, -> DONE()


# B:: 1410.13 543b9c448f8c80299bcc4b6f  B3 R3    ddomit    ddomit@micheldomit.com   Daniel Domit,
# A:: 1402.05 52f17d9e1c67d1a4859d1f79  B1 R5 P1 ddomit    ddomit@gmail.com         Daniel Domit
merge_ddomit = ->
  overrides =
    linked: gp:{email:'ddomit@gmail.com'}
  getDups 'ddomit', 6592826, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) =>
      M = merged.user || replay
      expectObjIdsEqual(M,uA)
      expectObjIdsEqual(M,FIXTURE.merges.ddomit.a.user,'primaryPayMethodId')
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('ddomit@gmail.com')
      expect(M.emails[1].value).to.equal('ddomit@micheldomit.com')
      expect(M.username).to.equal("ddomit")
      expect(M.name).to.equal("Daniel Domit")
      expectExactFields(M.linked, ['gp','gh','tw','in'])
      checkMergeMergedGraph M, null, { bookings:4, requests: 8, paymethods: 1 }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uB)
        checkMergeRemovedGraph removed, -> DONE()


# 1412.19 549342348f8c80299bcc56c1 A2   P2  E S23 B8 O10 P1  O1                 jkresner     jkresner@gmail.com   Jonathon Kresner
# 1304.23 5175efbfa3802cc4d5a5e6ed A20      E S13 B6 O6      O26 B12 R38 r234   jkresner     jk@airpair.com       Jonathon Kresner
merge_jk = ->
  overrides =
      linked: { gp: { email:'jk@airpair.com'} }
      username: 'hackerpreneur'
  getDups 'jkresner', 979542, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) =>
      M = merged.user || replay
      expectObjIdsEqual(M,uA)
      expectObjIdsEqual(M,FIXTURE.merges.jkresner.b.user,'primaryPayMethodId')
      expect(M.bio).to.equal('AirPair.com Founder')
      expect(M.bookmarks.length).to.equal(13)
      expectSameMoment(M.cohort.engagement.visit_first,"2013-04-23T02:19:43.000Z")
      expectSameMoment(M.cohort.engagement.visit_signup,"2013-04-23T02:19:43.000Z")
      expect(M.cohort.aliases.length).to.equal(50)
      expect(M.cohort.firstRequest.url).to.equal('/posts')
      expect(M.tags.length).to.equal(2)
      expect(M.username).to.equal('hackerpreneur')
      expect(M.initials).to.equal('jk')
      expect(M.location.timeZoneId).to.equal('Australia/Sydney')
      expect(M.location.name).to.equal('Penrith NSW 2750, Australia')
      expect(M.location.shortName).to.equal('Penrith')
      expect(M.siteNotifications.length).to.equal(1)
      expect(M.emails.length).to.equal(2)
      expect(M.emails[0].value).to.equal('jk@airpair.com')
      expect(M.emails[0].primary).to.equal(true)
      expect(M.emails[0].verified).to.equal(true)
      expect(M.emails[1].value).to.equal('jkresner@gmail.com')
      expect(M.emails[1].primary).to.be.undefined
      expect(M.emails[1].verified).to.equal(true)
      expectExactFields(M.linked, ['password','so','gp','tw','in','bb','gh','al','sl'])
      expect(M.roles).to.be.undefined
      ## 14 Bookings w 16 Orders?
      checkMergeMergedGraph M, null, { posts:22, booked:14, requests:38, paymethods:2, suggests:36, ordered:16, orders:27, paidout: 1, bookings:12, released: 179 }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uB)
        checkMergeRemovedGraph removed, -> DONE()


# 1411.21 546e200d8f8c80299bcc518d A1P1  E S5 B1 O1   O3 B3 R5  josh-padnick   josh@phoenixdevops.com Josh Padnick
# 1410.23 544823048f8c80299bcc4cef       E S2                   josh-padnick   josh.padnick@gmail.com Josh Padnick
merge_joshpadnick = ->
  overrides =
      linked: { gp: { email:'josh@phoenixdevops.com'} }
      initials: 'jp'
  getDups 'joshpadnick', 4295964, (uaId, ubId, uA, uB) ->
    MERGE uA, uB, overrides, (e, {merged,removed,replay}) =>
      M = merged.user || replay
      expectObjIdsEqual(M,uB)
      expectObjIdsEqual(M,FIXTURE.merges.joshpadnick.a.user,'primaryPayMethodId')
      checkMergeMergedGraph M, null, { posts:1, booked:1, requests:5, paymethods:1, suggests:7, ordered:1, orders:3, bookings:3, released:0 }, ->
        if replay then return DONE()
        expectObjIdsEqual(removed.user,uA)
        checkMergeRemovedGraph removed, ->
          Experts.findOne {_id:merged.expert._id}, (ee,expert) ->
            $log('josh.expert', expert)
            expectObjIdsEqual(expert,merged.expert)
            expect(expert.brief).to.equal("I help software teams (and individuals) scale with Amazon Web Services and DevOps.  I can assist with AWS best practices, AWS architectures, DevOps training, build pipeline setup, docker, CoreOS, and pretty much anything else relating to infrastructure automation on AWS.")
            expect(expert.tags.length).to.equal(3)
            expect(expert.rate).to.equal(230)
            expect(expert.gmail).to.equal('josh@phoenixdevops.com')
            expect(expert.activity.length).to.equal(1)
            DONE()



 # 1509.04 55e8a205cb848c1100017211   E S1         thatrubylove    jim@onlinedevschool.com  Jim OKelly,
 # 1504.24 553a0a3960f927110034a493   E S1         thatrubylove    jim@rubycasts.io Jim OKelly,
 # 1405.30 5387ecb51c67d1a4859d3349   E            thatrubylove    thatrubylove@gmail.com Jim O'Kelly - RubyLove
merge_thatrubylove = ->
  thatrubylove = linked: { gp: { email:'thatrubylove@gmail.com'} }, username: 'thatrubylove', name: "Jim O'Kelly", initials: "jim"
  mergeDups "5387ecb51c67d1a4859d3349", "553a0a3960f927110034a493", 5987052, thatrubylove, "5522d28331447011006ba42e", { suggests: 1 }, (e, r1) ->
    if r1.replay then return DONE()
    expect(r1.merged.user.email).to.equal('thatrubylove@gmail.com')
    mergeDups "5387ecb51c67d1a4859d3349", "55e8a205cb848c1100017211", 5987052, thatrubylove, "5522d28331447011006ba42e", { suggests: 2 }, (e, r2) ->
      if !r2.replay
        expect(r2.merged.user.email).to.equal('thatrubylove@gmail.com')
        expect(r2.merged.user.initials).to.equal('jim')
        expect(r2.merged.user.username).to.equal('thatrubylove')
        expect(r2.merged.user.emails.length).to.equal(3)
      DONE()


# 1504.04 551e95a69acd5c1100464d20 P1  E S5           O1 B1 R2  ahalls   andrew@galtsoft.com              Andrew Halls
# 1409.25 5423b9ee8f8c80299bcc489e P1  E S1 B2 O2 P1        R1  ahalls   andrewhalls.galtsoft@gmail.com   Andrew Halls
# 1409.14 541514868f8c80299bcc472b     E S6           O1 B1 R1  ahalls   ahalls@thinkful.com              Andrew Halls
merge_ahalls = ->
  ahalls = linked: { gp: { email:'andrewhalls.galtsoft@gmail.com'} }, username: 'ahalls', name: "Andrew Halls", initials: "awh", username: 'ahalls'
  mergeDups "5423b9ee8f8c80299bcc489e", "541514868f8c80299bcc472b", 751181, ahalls, "", { paymethods: 1, suggests:7, booked:2, ordered:2, paidout:1, orders:1, bookings:1, requests:2 }, (e, r1) ->
    if r1.replay then return DONE()
    expect(r1.merged.user.email).to.equal('andrewhalls.galtsoft@gmail.com')
    mergeDups "541514868f8c80299bcc472b", "551e95a69acd5c1100464d20", 751181, ahalls, "", { paymethods: 2, suggests:12, booked:2, ordered:2, paidout:1, orders:2, bookings:2, requests:4 }, (e, r2) ->
      if !r2.replay
        expect(r2.merged.user.email).to.equal('andrewhalls.galtsoft@gmail.com')
        expect(r2.merged.user.initials).to.equal('awh')
        expect(r2.merged.user.username).to.equal('ahalls')
        expect(r2.merged.user.emails.length).to.equal(3)
      DONE()




merge_non_categorized = ->
  expectAllMerges FIXTURE.dupgithub.nonCategorizedUsers


merge_authors = ->
  expectAllMerges FIXTURE.dupgithub.authors


merge_single_profile_experts = ->
  expectAllMerges FIXTURE.dupgithub.singleProfileExperts


merge_easy_double_profile_experts = ->
  expectAllMerges FIXTURE.dupgithub.easyDoubleProfileExperts


merge_easy_customers = ->
  expectAllMerges FIXTURE.dupgithub.easyCustomers


merge_basic_mixed = ->
  expectAllMerges FIXTURE.dupgithub.basicMix


merge_v0_active_experts = ->
  expectAllMerges FIXTURE.dupgithub.v0ActiveExperts


merge_v0_active_customers = ->
  expectAllMerges FIXTURE.dupgithub.v0ActiveCustomers

merge_v1_active_experts = ->
  expectAllMerges FIXTURE.dupgithub.v1ActiveExperts

merge_v1_active_customers = ->
  expectAllMerges FIXTURE.dupgithub.v1ActiveCustomers


merge_fullmix_users = ->
  expectAllMerges FIXTURE.dupgithub.fullMix


noDupGithubs = ->
  Users.find({ 'linked.gh':{$exists:1} }, { 'linked', 'name', 'email' }, q.sortById).toArray (e, u1) ->
    $log('users.withGithub'.yellow, u1.length)
    hash = {}
    count = 0

    for u in u1
      expect(u.linked.gh.id)
      key = u.linked.gh.id.toString()

      if hash[key]?
        hash[key].push(u)
      else
        hash[key] = [u]


    dups = {}
    total = 0
    for githubId of hash
      if hash[githubId].length > 1
        dups[githubId] = hash[githubId]
        total += hash[githubId].length

    line = (githubId, dups) -> "#{ githubId.yellow }#{ uInfoChain(acc) for acc in dups }"
    text = _.reduce( _.keys(dups), ((memo,u) -> memo+line(u, dups[u])+'\n'), '')

    $log(text)
    # fs.writeFile fileName, text, ->
    $log('total dup names', total)
    expect(total).to.equal(0)
    DONE()



module.exports = ->

  specInit(@)

  describe 'Mergin on GH profiles', ->

    IT "Merge users(v01,v01) w 2 inactive(v0) profiles + 3 suggests", merge_jarektkaczyk
    IT "Merge jk", merge_jk
    IT "Merge user with everything", merge_joshpadnick
    IT "Merge users(v0,v0) having one expert profile(v0) with suggests", merge_nmeans
    IT "Merge users(a_v1,b_v0) having expert(a_v0)", merge_carlsmith
    IT "Merge users(v1,v0) w active(v1) + inactive(v0) expert profile", merge_Johnsel
    IT "Merge users(a_v01,b_v0) with requests and bookings across users", merge_ddomit
    IT "Merge users(a,b,c) with 3 expert profiles", merge_thatrubylove
    IT "Merge users(a,b,c) with 3 expert profiles and split bookings/orders", merge_ahalls
    IT "Merge non-categorized users", merge_non_categorized
    IT "Merge single profile experts with post", merge_authors
    IT "Merge single profile experts", merge_single_profile_experts
    IT "Merge easy double profile experts", merge_easy_double_profile_experts
    IT "Merge easy customers", merge_easy_customers
    IT "Merge basic mixed users (experts w requests)", merge_basic_mixed
    IT "Merge v0 active experts", merge_v0_active_experts
    IT "Merge v0 active customers", merge_v0_active_customers
    IT "Merge v1 active experts", merge_v1_active_experts
    IT "Merge v1 active customers", merge_v1_active_customers
    IT "Merge full mix users", merge_fullmix_users


    IT "No duplicate linked.GitHub ids left", noDupGithubs

