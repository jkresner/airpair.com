
slackUsers = ->

  # IT 'Can get Slack team info', ->
  #   stub = STUB.slack('teamInfo', FIXTURE.wrappers.slack_team_info)
  #   Wrappers.Slack.teamInfo (e, t) ->
  #     expect(t.name).to.equal('AirPair Test')
  #     stub.restore()
  #     DONE()


  # IT 'Can get Slack me info', ->
  #   stub = STUB.slack('meInfo', FIXTURE.wrappers.slack_me_info)
  #   Wrappers.Slack.meInfo config.chat.slack.pairbot, (e, me) ->
  #     # $log('e', e, 'me', me) # uncomment with withoutStubs=true to get user info
  #     expect(me.user).to.equal('pairbot')
  #     stub.restore()
  #     DONE()


  # # it.skip 'Can update Slack me info', itDone ->
  # #   # stub = SETUP.stubSlack('updateMe', data.wrappers.slack_me_info)
  # #   $log('config.chat.slack.support', config.chat.slack.support)
  # #   Wrappers.Slack.updateMe config.chat.slack.support, 'Customer Servivce', 'Yo', (e, me) ->
  # #     $log(e,me)
  # #     expect(me.user).to.equal('customer-support')
  # #     stub.restore()
  # #     DONE()


  # IT 'Can get all team users', ->
  #   Wrappers.Slack.getUsers (e, users) ->
  #     idx = 2
  #     $log('team.users', users)
  #     expect(users.length>0).to.be.true
  #     expect(users[idx].id).to.equal('U06UCSHL0')
  #     expect(users[idx].name).to.equal('customer-support')
  #     expect(users[idx].deleted).to.equal(false)
  #     expect(users[idx].real_name).to.equal('{} Customer Support')
  #     expect(users[idx].tz_label).to.equal('Pacific Daylight Time')
  #     expect(users[idx].profile.email).to.equal('support@airpair.com')
  #     DONE()


  # IT 'Pending inviation by email comes back as null', ->
  #   Wrappers.Slack.checkUser {email:"jkresner@yahoo.com.au"}, (e, user) ->
  #     expect(user).to.be.null
  #     DONE()


  # IT 'Can check for an active user by email', ->
  #   Wrappers.Slack.checkUser {email:"experts@airpair.com"}, (e, user) ->
  #     expect(user.id).to.equal('U06UBH472')
  #     expect(user.name).to.equal('experts')
  #     expect(user.deleted).to.equal(false)
  #     expect(user.real_name).to.equal('Experts AirPair')
  #     expect(user.tz_label).to.equal('Pacific Daylight Time')
  #     expect(user.profile.email).to.equal('experts@airpair.com')
  #     DONE()


  # IT 'Can check for an active user by name', ->
  #   Wrappers.Slack.checkUser {email:"jkresner@yahoo.co",name:'Jonathon Gmail'}, (e, user) ->
  #     expect(user.id).to.equal('U06UCKSSF')
  #     expect(user.name).to.equal('jkgmail')
  #     expect(user.deleted).to.equal(false)
  #     expect(user.real_name).to.equal('Jonathon Gmail')
  #     expect(user.tz_label).to.equal('Pacific Daylight Time')
  #     expect(user.profile.email).to.equal("jkresner@gmail.com")
  #     DONE()


  # IT 'Can check for an active user by id', ->
  #   Wrappers.Slack.checkUser {id:"U06U2HQQK"}, (e, user) ->
  #     expect(user.id).to.equal('U06U2HQQK')
  #     expect(user.name).to.equal('jk')
  #     expect(user.deleted).to.equal(false)
  #     expect(user.real_name).to.equal('{} Jonathon Kresner')
  #     expect(user.tz_label).to.equal('Pacific Daylight Time')
  #     expect(user.profile.email).to.equal("jk@airpair.com")
  #     DONE()


  IT 'Can invite new user to slack network', ->
    Wrappers.Slack.inviteToTeam "Jonny Five", "airpairtest1@gmail.com", (e, response) ->
      if e
        expect(e.message).to.equal("already_invited")
      else
        expect(response).to.exist
      DONE()


  # it.skip 'Can not deactivate current user from slack network', itDone ->
  #   Wrappers.Slack.deactivateUser jk_gmail_id, (e, response) ->
  #     expect(e.message).to.equal 'paid_only'
  #     DONE()


  # it.skip 'Can check other users presence', itDone ->
  #   # Wrappers.Slack.getUserPresence {slackId:"U02ASLW2Z"}, (e, u) ->
  #     # console.log(e, u)
  #   # { presence: 'away' }
  #   # { presence: 'active' }
  #     # DONE()


  # it.skip 'Can get my presence', itDone ->
  #   # Wrappers.Slack.getUserPresence {slackId:"U03KKUVBJ",token:jkresner_gmail_token}, (e, u) ->
  #   #   console.log(e, u)
  #   # { presence: 'active',
  #   #   online: true,
  #   #   auto_away: false,
  #   #   manual_away: false,
  #   #   connection_count: 1,
  #   #   last_activity: 1433656202 }
  #   #   DONE()


# slackGroups = ->


#   it 'Can get channels', itDone ->
#     Wrappers.Slack.getChannels (e, channels) ->
#       expect(channels.length > 2).to.be.true
#       DONE()


#   it 'Pairbot can get all groups', itDone ->
#     Wrappers.Slack.getGroups {}, (e, groups) ->
#       $log('groups', JSON.stringify(groups))
#       expect(groups.length>0).to.be.true
#       expect(groups[0].id).to.equal('G06UBFX8S')
#       expect(groups[0].purpose.value).to.equal('')
#       expect(groups[0].topic.value).to.equal('')
#       expect(groups[0].members.length>1).to.be.true
#       expect(groups[0].is_archived).to.be.false
#       expect(groups[0].creator).to.equal('U06U2HQQK')
#       expect(groups[0].created).to.equal(1435535644)
#       expect(groups[0].name).to.equal('-pipeline-')
#       DONE()


#   it 'Can search for a group by name', itDone ->
#     Wrappers.Slack.searchGroupsByName 'Pipe', (e, groups) ->
#       expect(groups.length==1).to.be.true
#       expect(groups[0].id).to.equal('G06UBFX8S')
#       expect(groups[0].purpose.value).to.equal('')
#       expect(groups[0].topic.value).to.equal('')
#       expect(groups[0].members.length>1).to.be.true
#       expect(groups[0].is_archived).to.be.false
#       expect(groups[0].creator).to.equal('U06U2HQQK')
#       expect(groups[0].created).to.equal(1435535644)
#       expect(groups[0].name).to.equal('-pipeline-')
#       DONE()


#   it 'Can get group by id with message history', itDone ->
#     Wrappers.Slack.getGroupWithHistory 'G06UBFX8S', (e, result) ->
#       {info,history} = result
#       expect(history.length>1).to.be.true
#       expect(info.id).to.equal('G06UBFX8S')
#       expect(info.purpose.value).to.equal('')
#       expect(info.topic.value).to.equal('')
#       expect(info.members.length>1).to.be.true
#       expect(info.is_archived).to.be.false
#       expect(info.creator).to.equal('U06U2HQQK')
#       expect(info.created).to.equal(1435535644)
#       expect(info.name).to.equal('-pipeline-')
#       DONE()


#   it 'Support can create a group with purpose and members', itDone ->
#     purpose = "I have a test purpose #{timeSeed()}"
#     name = "zz-test-#{newId()}".substring(0,21)
#     $log('pur', purpose)
#     stubData = _.extend {}, data.wrappers.slack_createGroup_wPurpose
#     stubData = _.extend stubData, { purpose: { value: purpose }, name }
#     stub = SETUP.stubSlack('createGroup', stubData)
#     {owner,support,pairbot} = config.chat.slack
#     members = [owner.id,support.id,pairbot.id]
#     Wrappers.Slack.createGroup {}, {purpose,name}, members, (e,r)->
#       expect(r.purpose.value).to.equal(purpose)
#       expect(r.name).to.equal(name)
#       expect(r.creator).to.equal(support.id)
#       stub.restore()
#       DONE()


#   it 'Can rename group', itDone ->
#     Wrappers.Slack.renameGroup {}, "G06UFJCQ2", "y-test-suite", (e, r) ->
#       if (e && e.message == 'name_taken')
#         Wrappers.Slack.renameGroup {}, "G06UFJCQ2", "p-test-suite", (ee, group) ->
#           expect(ee).to.be.null
#           expect(group.id).to.equal("G06UFJCQ2")
#           expect(group.name).to.equal("p-test-suite")
#           DONE()
#       else
#         expect(r.id).to.equal("G06UFJCQ2")
#         expect(r.name).to.equal("y-test-suite")
#         DONE()


#   it 'Pairbot can message group', itDone ->
#     pipelineGroupId = 'G06UBFX8S'
#     message = "I have updated bleah #{timeSeed()}"
#     Wrappers.Slack.postMessage 'pairbot', pipelineGroupId, message, (e,r)->
#       $log('postMessage', e, r)
#       expect(r.ts).to.exist
#       expect(r.text).to.equal(message)
#       DONE()


#   it.skip 'Pairbot can post attachment to group', itDone ->


# slackHelpers = ->

#   it.skip 'Can invite userB to all userA non-archived groups', itDone ->
#     groupCount = 0
#     invitedCount = 0
#     userAtoken = ""  # cannot be a bot
#     userB_id = "" # "U06UCKSSF" # jkgmail

#     invite = (group) ->
#       Wrappers.Slack.inviteToGroup {token:userAtoken},group.id,userB_id, (ee,ok)->
#         if (ee && ee.message == "is_archived")
#           $log 'is_achived'.yellow, group.name.white
#         else if (ee)
#           $log 'error'.red, ee
#         else
#           expect(ok.group.id).to.equal(group.id)
#           if (ok.already_in_group)
#             $log 'already_in_group'.cyan, group.name.white
#           else
#             $log 'invited to group'.green, group.name.white
#         invitedCount++
#         if invitedCount == groupCount then DONE()

#     Wrappers.Slack.getGroups {token:userAtoken}, (e, r) ->
#       groupCount = r.length
#       $log('groupCount'.magenta, groupCount)
#       invite(g) for g in r


#   it.skip 'Can auto remove messages with subtypes invite, join & purpose', itDone ->

#   it.skip 'Can sync all IMs', itDone ->
#     @timeout 500000
#     ChatSvc = require('../../server/services/chats')
#     ChatSvc.syncIMs (e,r) ->
#       $log('DONE.ChatSync'.cyan, e, r)
#       DONE()

# chatSvc = ->

#   it.skip 'Can associate and save chat from group sync options', itDone ->
#     SETUP.newLoggedInExpertWithPayoutmethod 'gior', (expert, expertSession, payoutmethod) ->
#       SETUP.newBookedExpert 'jkap', {expertId:expert._id, payoutmethodId:payoutmethod._id}, (s, booking1) ->
#         LOGIN "admin", ->
#           Wrappers.Slack.searchGroupsByName 'zz-test-5590bdcdb50c4', (e,groups) ->
#             expect(groups.length).to.equal(1)
#             PUT "/adm/bookings/#{booking1._id}/associate-chat", {type:'slack',providerId:groups[0].id}, {}, (b2) ->
#               expect(b2.chatId).to.exist
#               DONE()


#   it.skip 'Can associate and sync existing group', itDone ->

#   it.skip 'Can associate and sync existing slack group already belonging to another booking', itDone ->

#   it.skip 'Can save slack info to user not yet oAuth connected', itDone ->

#   it.skip 'Can sync slack details to booking and create new users', itDone ->
#     # IDEAL
#     ## 1 Try sync on customer email or name
#     ## 2 Grab from connect from expert / you've been booked email
#     # Minimal
#     ## 1 Try sync on customer email or name
#     ## 2 Try sync on expert email or name
#     ## 3 Manual add to room and link by participant in room





module.exports = ->

  @timeout 100000

  before ->
    STUB.slack = STUB.createStubApiWrapper 'Slack', (result, fnName) ->
      ->
        if fnName == "getUsers" then cache.slack_users = result
        if fnName == "getGroups" then cache.slack_groups = result
        cb = arguments[arguments.length-1]
        cb(null, result)


  describe "SlackWrapper: ".subspec, ->
    describe "Users & Team: ".subspec, slackUsers
    # describe "Groups & Channels: ".subspec, slackGroups
    # describe "Mirgration Helpers".subspec, slackHelpers

  # describe "ChatSvc: ".subspec, chatSvc


