global.Q = {}
Q.user =
  firstIP: (ip) -> { 'cohort.firstRequest.ip': ip }
  github: (login) -> { 'auth.gh.login': login }
  sessions: (ids) -> { 'cohort.aliases': { $in: ids } }


module.exports = ->



  before (done) ->
    verbose = process.env.LOG_APP_VERBOSE

    global.USERS = (query, cb) =>
      DB.Collections.users.find(query).toArray (e,r) =>
        if (e) then throw e
        q = if verbose then "by #{JSON.stringify(query)}".gray else ''
        cb(r, $log("#{r.length} users".yellow, q, if verbose then r else ''))

    global.VIEWS = (query, cb) =>
      DB.Collections.views.find(query).toArray (e,r) =>
        if (e) then throw e
        q = if verbose then "by #{JSON.stringify(query)}".gray else ''
        cb(r, $log("#{r.length} views".yellow, q, if verbose then r else ''))

    global.ISSUES = (query, cb) =>
      DB.Collections.issues.find(query).toArray (e,r) =>
        if (e) then throw e
        q = if verbose then "by #{JSON.stringify(query)}".gray else ''
        cb(r, $log("#{r.length} issues".yellow, q, if verbose then r else ''))


    global.EVENTS = (query, cb) =>
      DB.Collections.events.find(query).toArray (e,r) =>
        if (e) then throw e
        q = if verbose then "by #{JSON.stringify(query)}".gray else ''
        cb(r, $log("#{r.length} events".yellow, q, if verbose then r else ''))


    global.IMPRESSION = DB.Collections.impressions


    global.DATA.uniqSessions = (arr) =>
      r = {}
      for id in arr
        r[id] = if r[id] then r[id] + 1 else 1
      $log(r)
      Object.keys(r)


    done()


  DESCRIBE('Abuse', () => require('./abuse/201605'))
  # DESCRIBE('Crawls', () => require('./crawls/201605'))
  # DESCRIBE('Readers', () => require('./readers/201605'))
  # DESCRIBE('OAUTH', () => require('./oauths/201605'))


  # IT "https://github.com/bidhan-a", ->
    # ObjectId("571f067d6d4bed1100858e78")
    # Figure out banning mechanism

"""
 DESCRIBE('HUNCHES', () =>

    IT "Impossible ref", ->
      /^https\:\/\/airpair.com\/
      /^http\:\/\/airpair.com\/
      /^https\:\/\/www.airpair.com\/

  )
"""
