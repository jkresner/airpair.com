ips =
  feedly:
    issues:
      '8.29.198.25': 7,
      '8.29.198.26': 67,
      '8.29.198.27': 8,
      '65.19.138.33': 78,
      '65.19.138.35': 86,
      '65.19.138.34': 11
      '199.101.134.197': 1,
      '199.101.134.200': 1,
      '208.94.234.20': 1,
      '208.94.234.21': 1,


DESCRIBE "Jun 12", ->

  IT 'Feedly IPS', ->
    @timeout(10000)
    $log('malformed requested urls')
    $log('malformed refer urls')
    $log('variable user-agents')
    ISSUES {ua:/Feedly/i}, (issues) ->
      ips = {}
      sIds = {}
      for {ip,sId} in issues
        ips[ip] = if ips[ip] then ips[ip]+1 else 1
        sIds[sId] = if sIds[sId] then sIds[sId]+1 else 1

      $log('sId'.white, sIds)
      # USERS Q.user.sessions(issues.map((s)=>s.sId)), (users) ->
        # VIEWS {ip:"88.252.220.85"}, (views) ->
      DONE()


  IT '94.23.204.183', ->
    @timeout(10000)
    $log('malformed requested urls (imgs)')
    ips = "ip":"94.23.204.183"
    sIds = "sId":{"$in":["oXXBXXpRiNUFexqRvzCsBcAJTrPN-sVx","mkUTsf7eKomrFsK-naXBNXP-SFWXnYOs","d6zd5JGcIOkuK-EKgg44juLo1f3QREDB","kA5mFiWi6brU1iLF_hKG4VADpku3hLrE"]}
    q = "$or":[ips,sIds]
    # ISSUES {ip:/94.23.204.183/}, (issues) ->
    VIEWS q, (views) ->
      EVENTS q, (events) ->
        DONE()
