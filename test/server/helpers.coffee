module.exports = (cb) ->

  global.UTIL =
    Date:         require("honeycombjs").Util.Date
    clearIP:      ->
      delete global.cache.abuse['::ffff:127.0.0.1']
      global.cache.abuse.ban = []
      global.cache.iplog = {}


  """
  DB
  """

  DB.noSession = ({sessionID}, cb) ->
    a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
    expect(sessionID).to.match(a_uid)
    DB.docsByQuery 'Session', {_id:sessionID}, (s) ->
      expect(s.length).to.equal(0)
      DB.docsByQuery 'View', { sId:sessionID }, (views) ->
        expect(views.length).to.equal(0)
        DB.docsByQuery 'Impression', { sId:sessionID }, (impressions) ->
          expect(impressions.length).to.equal(0)
          cb()


  DB.expectSession = ({sessionID}, cb) ->
    a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
    expect(sessionID).to.match(a_uid)
    DB.docsByQuery 'Session', {_id:sessionID}, (s) ->
      expect(s.length, "db.Session({_id:#{sessionID}).length == #{s.length}").to.equal(1)
      cb()


  """
  DATA
  """

  DATA.lotsOfWords = (seed) ->
    words = (seed || "Start")
    words += " stuff " for i in [0..501]
    words


  DATA.defaultGH = (name, login, suffix) ->
    profile = FIXTURE.users[FIXTURE.uniquify('users','ape1','auth.gh.email')].auth.gh
    profile.id = (profile.id||1)+moment().unix() + Math.random(2,20)
    profile.login = "#{login}#{suffix}"
    profile.name = profile.name || name || login
    profile.emails = [{email:profile.email,verified:true,primary:true}]
    profile


  # DATA.ghProfile = (login, uniquify) ->
  #   suffix = DATA.timeSeed()
  #   if uniquify is true
  #     u = FIXTURE.users[FIXTURE.uniquify("users", login, 'username name email auth.gh.email auth.gh.login auth.gh.id auth.gp.id auth.gp.email')] if !u
  #     # $log('u'.magenta, u.email)
  #     $log("FIXTURE.users.#{login} MISSING") if !u
  #     profile = u.auth.gh if u.auth && u.auth.gh
  #     profile = DATA.defaultGH(u.name || login, login, suffix) if !profile
  #     profile.emails = [{email:profile.email||u.email,verified:true,primary:true}]
  #   else
  #     profile = FIXTURE.users[login].auth.gh
  #     profile = DATA.defaultGH(login, login, suffix) if !profile
  #   # $log('profile', profile)
  #   # expect(profile.emails, "FIXTURE.ghProfile #{login} missing emails").to.exist
  #   profile


  """
  HTTP
  """

  global.ANONSESSION = (opts, cb) ->
    if !cb
      cb = opts
      opts = {}

    global.COOKIE = null
    GET '/auth/session', opts, cb


  global.HTML = ({test}, match, opts) =>
    status = (opts||{}).status || 200
    nomatch = (opts||{}).no || []
    PAGE test.title, { contentType: /html/, status }, (html) =>
      expect(html).inc(pattern) for pattern in match
      expect(html).not.match(pattern) for pattern in nomatch
      if test.parent.title.match(/noindex/i)
        expect(html,'noindex missing').to.have.string('<meta name="robots" content="noindex, follow">')
      else if test.parent.title.match(/index/i)
        expect(html,'index missing').to.have.string('<meta name="robots" content="index, follow">')
      DONE()


  global.IMG = ({test}, opts) =>
    status = (opts||{}).status || 200
    PAGE test.title, { contentType: /image/, status }, (image) =>
      DONE()


  global.BAN = ({test,optsExpect}, opts) =>
    status = (opts||{}).status || 500
    ua = optsExpect.ua
    PAGE test.title, {contentType: /text/, status, ua}, (txt) =>
      DONE()


  # global.REDIRECT = ({test}, to, opts) =>
  #   status = (opts||{}).status || 301
  #   PAGE test.title, { contentType: /text/, status }, (txt) =>
  #     if status == 301
  #       expect(txt).to.have.string("Moved Permanently\. Redirecting to #{to}")
  #     if status == 302
  #       expect(txt).to.have.string("Found\. Redirecting to #{to}")
  #     DONE()


  """
  STUB(s)
  """

  # analyticsCfg = _.clone(config.analytics)
  # STUB.analytics =
  #   stubbed: false,
  #   mute: () -> config.analytics.log.trk.event = false
  #   unmute: () -> config.analytics.log.trk.event = process.env['LOG_TRK_EVENT']
  #   on: () -> config.analytics = analyticsCfg
  #     # global.analytics = require('../../server/services/analytics')(global._analytics)
  #   off: () -> config.analytics = false
     # global.analytics = {
      # echo: ()=>{},
  #     event: ()=>{},
  #     view: ()=>{},
  #     alias: ()=>{},
  #     # identify: ()=>{}
  #   }
  # STUB.analytics.mute()


  STUB.allGitPublisherAPIcalls = () ->
    _API = STUB.wrapper('GitPublisher').api
    _API('repos.get').err('gh_repos_get_notfound')
    _API('user.get').success('gh_user_scopes')
    _API('repos.createFromOrg').success('gh_repos_createFromOrg_47260144')
    _API('repos.createFile').success('gh_repos_createFile_1449060354_readme')
    _API('gitdata.createReference').success('gh_gitdata_createReference_1449060354_editBranch')
    _API('orgs.createTeam').success('gh_orgs_createTeam_1449067207')
    _API('user.editOrganizationMembership').success('gh_user_editOrganizationMembership_JustASimpleTestOrg')
    _API('orgs.addTeamMembership').success('gh_orgs_addTeamMembership_1862308_airpairtest1')


  cb()
