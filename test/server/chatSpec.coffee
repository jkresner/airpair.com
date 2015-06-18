jkresner_gmail_token = "xoxp-2367523802-3665981392-6061437604-79c743"
jk_gmail_id = "U03KKUVBJ"
jk_airpair_id = "U02ASLW2Z"
pg_airpair_id = "U03K6GKBL"
apolishc_gmail_id = "U056VRCBX"

module.exports = -> describe "SlackAPI: ", ->

  @timeout(1000000)

  before (done) ->
    SETUP.initExperts done

  after ->

  describe.skip 'Wrapper Users', ->

    it 'Can get Slack team info', itDone ->
      Wrappers.Slack.teamInfo (e, t) ->
        expect(t.name).to.equal('AirPair')
        DONE()


    it 'Can get Slack me info', itDone ->
      Wrappers.Slack.meInfo config.chat.slack.pairbot, (e, me) ->
        expect(me.user).to.equal('pairbot')
        DONE()


    it 'Can get all team users', itDone ->
      Wrappers.Slack.getUsers (e, users) ->
        expect(users.length>0).to.be.true
        expect(users[0].id).to.equal('U03ME5Q7X')
        expect(users[0].name).to.equal('123peterkim')
        expect(users[0].deleted).to.equal(false)
        expect(users[0].real_name).to.equal('Peter Kim')
        expect(users[0].tz_label).to.equal('Pacific Daylight Time')
        expect(users[0].profile.email).to.equal('123peterkim@gmail.com')
        DONE()


    it 'Pending inviation by email comes back as null', itDone ->
      Wrappers.Slack.checkUser {email:"mmira@moobin.net"}, (e, user) ->
        expect(user).to.be.null
        DONE()


    it 'Can check active user status by email', itDone ->
      Wrappers.Slack.checkUser {email:"jkresner@gmail.com"}, (e, user) ->
        expect(user.id).to.equal('U03KKUVBJ')
        expect(user.name).to.equal('jkgmail')
        expect(user.deleted).to.equal(false)
        expect(user.real_name).to.equal('Jonathon Gmail')
        expect(user.tz_label).to.equal('Pacific Daylight Time')
        expect(user.profile.email).to.equal("jkresner@gmail.com")
        DONE()


    it 'Can check active user status by name', itDone ->
      Wrappers.Slack.checkUser {email:"jkresner@yahoo.co",name:'Jonathon Gmail'}, (e, user) ->
        expect(user.id).to.equal('U03KKUVBJ')
        expect(user.name).to.equal('jkgmail')
        expect(user.deleted).to.equal(false)
        expect(user.real_name).to.equal('Jonathon Gmail')
        expect(user.tz_label).to.equal('Pacific Daylight Time')
        expect(user.profile.email).to.equal("jkresner@gmail.com")
        DONE()


    it 'Can check active user status by id', itDone ->
      Wrappers.Slack.checkUser {id:"U02ASLW2Z"}, (e, user) ->
        expect(user.id).to.equal('U02ASLW2Z')
        expect(user.name).to.equal('jk')
        expect(user.deleted).to.equal(false)
        expect(user.real_name).to.equal('{} Jonathon Kresner')
        expect(user.tz_label).to.equal('Pacific Daylight Time')
        expect(user.profile.email).to.equal("jk@airpair.com")
        DONE()


    it 'Can invite new user to slack network', itDone ->
      Wrappers.Slack.inviteToTeam "Jonny Five", "airpairtest1@gmail.com", (e, response) ->
        expect(e).to.be.null
        expect(response).to.exist
        DONE()


    it 'Can not deactivate current user from slack network', itDone ->
      Wrappers.Slack.deactivateUser jk_gmail_id, (e, response) ->
        expect(e.message).to.equal 'paid_only'
        DONE()


  # it.skip 'Can check other users presence', itDone ->
  #   Wrappers.Slack.getUserPresence {slackId:"U02ASLW2Z"}, (e, u) ->
  #     console.log(e, u)
  #   # { presence: 'away' }
  #   # { presence: 'active' }
  #     DONE()

  # it.skip 'Can get my presence', itDone ->
    # Wrappers.Slack.getUserPresence {slackId:"U03KKUVBJ",token:jkresner_gmail_token}, (e, u) ->
    #   console.log(e, u)
    # { presence: 'active',
    #   online: true,
    #   auto_away: false,
    #   manual_away: false,
    #   connection_count: 1,
    #   last_activity: 1433656202 }
      # DONE()


  describe.skip 'Wrapper Groups', ->

    it 'Can get all groups', itDone ->
      Wrappers.Slack.getGroups {}, (e, groups) ->
        expect(groups.length>0).to.be.true
        expect(groups[0].id).to.equal('G03KMNM5N')
        expect(groups[0].purpose.value).to.equal('')
        expect(groups[0].topic.value).to.equal('')
        expect(groups[0].members.length>1).to.be.true
        expect(groups[0].is_archived).to.be.false
        expect(groups[0].creator).to.equal('U03K6GKBL')
        expect(groups[0].created).to.equal(1423517559)
        expect(groups[0].name).to.equal('-pipeline-')
        DONE()


    it 'Can search for a group by name', itDone ->
      Wrappers.Slack.searchGroupsByName 'Pipe', (e, groups) ->
        expect(groups.length==1).to.be.true
        expect(groups[0].id).to.equal('G03KMNM5N')
        expect(groups[0].purpose.value).to.equal('')
        expect(groups[0].topic.value).to.equal('')
        expect(groups[0].members.length>1).to.be.true
        expect(groups[0].is_archived).to.be.false
        expect(groups[0].creator).to.equal('U03K6GKBL')
        expect(groups[0].created).to.equal(1423517559)
        expect(groups[0].name).to.equal('-pipeline-')
        DONE()


    it 'Can get group by id with message history', itDone ->
      Wrappers.Slack.getGroupWithHistory 'G03KMNM5N', (e, result) ->
        {info,history} = result
        expect(history.length>1).to.be.true
        expect(info.id).to.equal('G03KMNM5N')
        expect(info.purpose.value).to.equal('')
        expect(info.topic.value).to.equal('')
        expect(info.members.length>1).to.be.true
        expect(info.is_archived).to.be.false
        expect(info.creator).to.equal('U03K6GKBL')
        expect(info.created).to.equal(1423517559)
        expect(info.name).to.equal('-pipeline-')
        DONE()


    it 'Can invite pairbot to RPs non-archived groups', itDone ->
      groupCount = 0
      invitedCount = 0

      invite = (group) ->
        Wrappers.Slack.inviteToGroup {token:rp_airpair_token},group.id,config.chat.slack.pairbot.id, (ee,ok)->
          if (ee && ee.message == "is_archived")
            $log 'is_achived', group.name
          else
            expect(ok.already_in_group).to.equal(true)
            expect(ok.group.id).to.equal(group.id)
          invitedCount++
          if invitedCount == groupCount then DONE()

      Wrappers.Slack.getGroups {token:rp_airpair_token}, (e, r) ->
        groupCount = r.length
        invite(g) for g in r


    it 'Can rename group', itDone ->
      Wrappers.Slack.renameGroup {}, "G063V8LGP", "z-test-suite", (e, r) ->
        if (e && e.message == 'name_taken')
          Wrappers.Slack.renameGroup {}, "G063V8LGP", "p-test-suite", (ee, group) ->
            expect(ee).to.be.null
            expect(group.id).to.equal("G063V8LGP")
            expect(group.name).to.equal("p-test-suite")
            DONE()
        else
          expect(r.id).to.equal("G063V8LGP")
          expect(r.name).to.equal("z-test-suite")
          DONE()


    it 'Can create a group with purpose and members', itDone ->
      groupInfo =
        name:"zz-test-#{newId()}"
        purpose:"I have a test purpose #{timeSeed()}"
      members = [jk_gmail_id,pg_airpair_id]
      Wrappers.Slack.createGroup {}, groupInfo, members, (e,r)->
        $log('createGroup', e, r)
        DONE()


    it 'Can message group as pairbot', itDone ->
      pipelineGroupId = 'G03KMNM5N'
      message = "I have updated bleah #{timeSeed()}"
      Wrappers.Slack.postMessage 'pairbot', pipelineGroupId, message, (e,r)->
        $log('postMessage', e, r)
        DONE()


  # it.skip 'Can associate and sync existing slack group not belonging to any other booking', itDone ->

  # it.skip 'Can associate and sync existing slack group already belonging to another booking', itDone ->

  # it.skip 'Can save slack info to user not yet oAuth connected', itDone ->

  # it.skip 'Can sync slack details to booking and create new users', itDone ->
    # IDEAL
    ## 1 Try sync on customer email or name
    ## 2 Grab from connect from expert / you've been booked email
    # Minimal
    ## 1 Try sync on customer email or name
    ## 2 Try sync on expert email or name
    ## 3 Manual add to room and link by participant in room
