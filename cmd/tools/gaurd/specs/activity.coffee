key       = e: 'red', a: 'yellow', v: 'cyan', i: 'dim'
time      = ({_id}) => "#{idToMoment(_id).format('YYMM/DD HH:mm.ss')}".white
lb        = (label, {app}) => " #{label}.#{(app||'apc').substr(0,3)} "[key[label]]
sesh      = ({ip,sId}) => "#{(sId||'_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _').dim} #{ip.split(',')[0]} ".cyan
uad       = ({ua}) => "\n         #{ua.gray}".dim
urlref    = (url,ref) => (url.msg||(url.url||url).replace('://www.airpair.com','').replace(/^(https|http)/,''))+" #{ref||''}".replace('www.','').replace(/^((https|http))\:\/\//,'').green
opref     = (name,data) => name + JSON.stringify(data).gray
traced    = (html) =>
  beforeIdx = html.indexOf('<h2>Location/Address Information</h2>')
  afterIdx = html.indexOf('<h2>IPv4/IPv6 Conversions</h2>')
  $log(html.length, beforeIdx, afterIdx, afterIdx - beforeIdx)
  lines = html.substr(beforeIdx, afterIdx - beforeIdx).split('\n')
  trace = []
  for ln in lines
    if !/(h2|DivTables|HeaderRow|Information|is the|CDATA|var|txt|script|google.maps|infowindow|onmouseover|zoom|map|\}|\{|\])/.test(ln)
      trace.push ln
  trace.join('').replace(/<\/(div|center)>/g,'')
                .replace(/>&nbsp;/g,'')
                .replace('.gif" width="18" height="12" border="0"',' ')
                .replace(/<div class="DivTableColumn" style="width:(3|7)0%;"/g,'')
                .replace('<div><center>','')
                .replace('<img src="http://www.iptrace.in/templates/2014/images/flags/','    ')
                .replace(/\n  \n/g,'\n')
                .replace('\n','')
                .replace('    ','')
                .replace(/      /g,'\n')
                .replace(/    /g,'\t')
                .split('>').join('')


ip = FIXTURE.activity["recent"].ip[0]
# ip = "91.200.12.11"

module.exports = ->


  IT "Basic - Issues Views Impressions Events", ->
    @timeout(600000)

    ID = user: [], ip: [], ua: [], sid: []
    sum = (name, separtor) =>
      sep= separtor || '\n\t'
      "\n> #{ID[name].length} #{name}s:\n#{sep}#{ID[name].join(sep)}#{sep}"
    collate = (set) =>
      set.forEach ({uId,ip,sId,ua}) =>
        ID.ip.push(ip.split(',')[0]) if ip && ID.ip.indexOf(ip.split(',')[0]) == -1
        ID.ua.push(ua)               if ua && ID.ua.indexOf(ua) == -1
        ID.sid.push(sId)             if sId && ID.sid.indexOf(sId) == -1
        ID.user.push("#{uId}")       if uId && ID.user.indexOf("#{uId}") == -1
      set.length


    $or = [
      { ip }
      # { ip:  /106.206.130.70|106.216.178.213|46.195.199.98|46.195.70.122|46.195.70.251/ }
      # { uId: ObjectId("56ed6c1840a6ef11005d6e40") }
      # { sId: FIXTURE.activity['paymethods'].sId[0] }
      # { sId: { $in: ["TRHfJy3Mjdphx2yGVVb-Jik4vYscuTVY","ivRpZU_q8Y_K1wLyTNyvhIhF9SnmwSUr"] } }
    ]
    $log('QUERY.$or'.yellow.dim, JSON.stringify($or).white)

    DB.Collections.issues.find({$or}).toArray (e, issues) =>
      DB.Collections.views.find({$or},{_id:1,ip:1,sId:1,ua:1,url:1,ref:1}).toArray (e, views) =>
        DB.Collections.impressions.find({$or}).toArray (e, impressions) =>
          DB.Collections.events.find({$or}).toArray (e, events) =>
            $log 'FOUND'.yellow.dim, "#{collate(events)} events".yellow, "#{collate(issues)} issues".red, "#{collate(views)} views".cyan, "#{collate(impressions)} impression".cyan.dim
            $log 'UNIQ_IDENTs'.yellow.dim, sum('user'), sum('sid').cyan.dim, sum('ip','|').cyan, sum('ua').gray

            items = []
            items.push(time(a)+lb("a",a)+sesh(a)+opref(a.name, a.data)+uad(a)) for a in events
            items.push(time(e)+lb("e",e)+sesh(e)+urlref(e.data, e.ref)+uad(e)) for e in issues
            items.push(time(v)+lb("v",v)+sesh(v)+urlref(v.url, v.ref)+uad(v))  for v in views
            items.push(time(i)+lb("i",i)+sesh(i)+urlref(i.ref||'', i.img)+uad(i))  for i in impressions
            items.sort()
            $log(item.replace('16','')) for item in items

            $or = [ { 'cohort.aliases' :        {$in:ID.sid} }
                    { 'cohort.firstRequest.ip': {$exists:1,$in:ID.ip} } ]
            $log('QUERY.$or'.dim.yellow, JSON.stringify($or).white)

            DB.Collections.users.find({$or}).toArray (e, r) =>
              $log("FOUND USERS #{r.length}".dim.yellow)
              (r||[]).forEach (u) =>
                username = if u.username then u.username.gray else ''
                console.log("#{u._id} #{u.name}".white, username, u.email.gray)
                console.log("gh[#{u.auth.gh.login}:#{u.auth.gh.id}]".gray) if u.auth.gh
                console.log(u.cohort.aliases.join(' ').cyan.dim)
                console.log(JSON.stringify(u.cohort.firstRequest||{}).dim.cyan) if u.cohort.firstRequest
              # expect(r.length).to.equal(1)
              DONE()


  IT "IP-Trace", ->
    @timeout(100000)
    req = require('superagent').get "http://iptrace.in/IPv4-IP-Address/#{ip}.html", (e, resp) ->
      # $log(resp.text)
      $log(traced(resp.text))
      DONE()


