CF = null
# user =
#   "id":"4ae20555bf887f19dafe8292348c5f0c",
#   "email":"team@airpair.com",
#   "username":"94cd149bc4b2ab44f3439ae4ce187d8c",


module.exports = ->

  before (done) ->
    CF = require("../../../../server/wrappers/cloudflare")
    CF.init()

    q = meta:{$exists:0}
    # q['ua'] = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
    q['ua'] = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
    # q['ip'] = new RegExp('5.196.226.')
    # q['data.msg'] = new RegExp('/user/insert.page')
    DB.Collections.issues.find(q, { limit: 10, sort:{'_id':-1}}).toArray (e,issues) =>
      $log("\n\m#{issues.length} for query ".yellow, q)
      for i in issues
        $log("\n\n#{i.data.msg||i.data.url}".yellow, "\n#{i._id} #{idToDate(i._id)}".yellow, "\n#{i.type}:#{i.name}\t#{i.ip}\t#{i.ua.dim}".gray) # , i)
      $log('\n\n')
      done()


  SKIP "Create firewall ip_range block", ->
    @timeout(10000)
    range = 'xxx.yyy.zzz'
    msg   = ""
    ua    = ""
    _id   = ObjectId("")
    issue = { _id, ua, data: {msg} }
    notes = "issue:#{issue._id}\n#{issue.data.msg}\n#{issue.ua}"
    CF.blockRange range, notes, (e, rule) =>
      $log(e, rule)
      DONE()


  SKIP "Create firewall ip block", ->
    @timeout(10000)
    _id   = ObjectId("")
    msg   = "Not Found /firebase/posts/yatodo-guidegsdl/cgi-bin/oaiserver?verb=Identify"
    ua    = "oai-finder https://github.com/stuartyeates/oai-finder"
    ip    = "60.234.84.192"
    issue = { _id, ip, ua, data: {msg} }
    notes = "issue:#{issue._id}\n#{issue.data.msg}\n#{issue.ip}\n#{issue.ua}"
    CF.blockIP issue.ip, notes, (e, rule) =>
      $log(e, rule)
      DONE()


  IT "Create firewall block for issue", ->
    query = _id: ObjectId("575ec9889a15a31100e04b0e"), meta:{$exists:0}
    DB.Collections.issues.findOne query, (e, issue) =>
      $log('block issue', issue)
      CF.blockIssue issue, (e, rule) =>
        expect(e).to.be.null
        $log(e, rule)
        meta = _id: ObjectId(), action: "ip_block"
        DB.Collections.issues.update query, {$set:{meta}}, (e, update) =>
          $log('blocked.issue'.cyan, if e then e else update.result)
          DONE()


  IT "Grabs firewall rules", ->
    CF.getFirewall (e, rules) =>
      $log("#{r.modified_on}\n".cyan, "#{r.notes}".white) for r in rules
      DONE()
