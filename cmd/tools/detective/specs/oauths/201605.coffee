DESCRIBE "Jun 12", ->

  IT 'GH Failed', ->
    @timeout(10000)
    ips = ip: {$in:['93.159.238.19','154.65.34.197']}
    ISSUES ips, (issues) ->
      sIds = $in: []
      for {ip,sId} in issues
        sIds['$in'].push sId

      $log('sId'.white, sIds)
      q = $or: [ips,sIds]
      VIEWS q, (views) ->
        EVENTS q, (events) ->
      # USERS Q.user.sessions(issues.map((s)=>s.sId)), (users) ->
          DONE()


