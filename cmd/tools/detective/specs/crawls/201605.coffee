DESCRIBE "Jun 12", ->

  SKIP "49.150.21.106", ->
    @timeout(10000)
    $log('malformed requested urls')
    $log('sets over multiple weeks')
    sIds = sId: { $in: ['KZZ-y6nWBAto9ox7qe48jraN-PaFb7Tn','yq3awNlrokeQDmm68wHQQiqAm_RrDg6i','Bg_sidc99Hq_yr8n7nf0OO35ZJtJybN6' ]}
    ips = ip: { $in: ["49.150.21.106"] }
    ISSUES sIds, (issues) ->
      VIEWS {$or:[ips,sIds]}, (views) ->
        # sIdsV = DATA.uniqSessions(views.map((v)=>v.sId))
        # $log(sIdsV)
        $log(idToDate(_id), ip, ua, data.msg, ref) for {_id,ip,data,ref,ua} in issues
        $log(idToDate(_id), ip, ua, url) for {_id,ip,url,sId,ua} in views
        DONE()
