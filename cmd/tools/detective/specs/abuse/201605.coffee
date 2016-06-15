
SKIP 'Being Harassed', ->
  # db.views.find({$or:[{sId:{$in:["2de8RMuTC9ThmjfYRBzXtESFQUR9rJrC", "9768VHFOcS6k05A1teN5By0qA2Hu4Gv5", "XGBHWUFZ0w6mlFws_LOPMIfEZU2DpLhs"]}},{ip:{$in:['109.49.166.123','47.59.122.29','94.61.126.56','185.101.177.67','88.22.74.114']}}]}

  # logDate = (i) -> $log 'fucker', new Date(parseInt(i.slice(0, 8), 16) * 1000)

  # logDate(id) for id in ["574f650807febc1100ac935c", "57501ef14bd17111000f9aeb", "5751b7a695655711004bfb2c", "5751b7b295655711004bfb34"]

  # logDate(id) for id in ["574a9fb09efb20110003d600", "574a9fd39efb20110003d60a", "574b68f69efb201100041b6c", "57504c984bd17111000fb413", "575150ca68613211005fd5c8"]

    # ObjectId("574a9fb09efb20110003d600")


SKIP 'Another', ->
  # {AP} insertDocument :: caused by :: 11000 E11000 duplicate key error index: app33053049.users.$email_1 dup key: { : "boudewijn00@gmail.com" }
  # db.views.find({$or:[{sId:'tLf3Ojg7yrRXGFAYGVR--PvoseMP0USj'},{ip:'80.100.39.101'}]})


SKIP 'Changing UA for same IP', ->
  # {CST} Login fail: No airpair.com user found linked with GitHub login rdwash
  #  db.views.find({$or:[{sId:/2gbKowT3k4oDWisHMNP4SsgOatMB1ce5|vMcGfHutlsvdRfrpsDpakL5KFFSrnGpo|O1Sa-lTik29wQr_OZbThkCB0HmmYMdvY/},{ip:/50.148.24.244|172.56.12.29/}]})

SKIP 'Sus browsing', ->
# GET/auth/paypal/confirm?error_uri=https%3A%2F%2Fconsult.airpair.com%2Fauth%2Fpaypal%2Fconfirm&error_description=Authentication+failed&error=access_denied]
# << https://www.paypal.com/webapps/auth/loginauth?execution=e1s3
# 173.54.180.238
# Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36
# Binoy 5750c9213ffd211100f7273e


# [GET/auth/paypal/confirm?scope=https%3A%2F%2Furi.paypal.com%2Fservices%2Fpaypalattributes+address+openid+profile+email&code=sPXPIHXzWaQaD6FpeDK9gjmhMGyf4aZiHiQKfz5YPIfq2CX19LxMtTV4WwzunB3ekvnKG94etPaQayK6BaQVNgB4eH-ls7VmVlwAWnPqaQlsHBvnDksOqJLpV5s2jUrItLeRicrAn1eHVQsw63wUNkQivUkmFBdnw2f29S1d_0GPj65F]
# << https://www.paypal.com/webapps/auth/identity/consent?execution=e4s1
# 207.141.13.226
# Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36
# Brian Fenton 54278a4b8f8c80299bcc490c


SKIP 'Grouped IPS', ->
  # 208.100.26.236
  # 208.100.26.235
  # 208.100.26.233
  # 91.200.12.11


DESCRIBE "JUN 12", ->

  SKIP "Not Found /user/register << http://www.airpair.com/user/register", ->
    @timeout(10000)
    $or = [{ip:'222.77.246.119'},{sId:'HpCiNTPGxjFCQn39D6_bHtLQ6KUT_Udt'}]
    ISSUES {$or}, (issues) ->
      VIEWS {$or}, (views) ->
        EVENTS {$or}, (events) ->
          DONE()
      # USERS Q.user.sessions(issues.map((s)=>s.sId)), (users) ->

  SKIP '88.252.220.85', ->
    @timeout(10000)
    $log('malformed requested urls')
    $log('malformed refer urls')
    $log('variable user-agents')
    ISSUES {ip:"88.252.220.85"}, (issues) ->
      USERS Q.user.sessions(issues.map((s)=>s.sId)), (users) ->
        VIEWS {ip:"88.252.220.85"}, (views) ->
          DONE()


  SKIP "200.55.180.114", ->
    @timeout(10000)
    $log('Repeated abusive crawls')
    VIEWS {ip:"200.55.180.114"}, (views) ->
      $log(idToDate(_id), url, ua) for {_id,url,sId,ua} in views
      ISSUES {ip:"200.55.180.114"}, (issues) ->
        $log(idToDate(_id), data.msg, ua) for {_id,data,ua} in issues
        USERS {'cohort.aliases':"SiKLGy-jCxh4qXJn2Ld58GJttXOqo35X"}, (users) ->
          DONE()



