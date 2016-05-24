SKIP 'Link github with local user / password', ->
  profile = FIXTURE.clone('oauth.github_jk')._json
  profile.id += parseInt(profile.id+@timeSeed)
  profile.emails = [{email:'jk@gmail.com',verified:true},{email:'jk@airpair.com',primary:true,verified:true}]
  token = 'jkjk_token'
  STORY.newUser 'jkjk', (s) ->
    AuthService.link.call {user:s}, 'github', profile, {token}, (e,usr) ->
      FIXTURE.users[s.userKey] = usr
      GET '/session/full', (s1) ->
        EXPECT.equalIds(s._id, s1._id)
        expect(s1.auth.gh.username).to.be.undefined
        expect(s1.auth.gh.login).to.equal(profile.login)
        expect(s1.auth.gh.id).to.be.undefined
        DB.docById 'User', s._id, (r) ->
          EXPECT.attr(r.auth.gh, 'id', Number)
          expect(r.auth.gh.id).to.equal(profile.id)
          expect(r.auth.gh.username).to.be.undefined
          expect(r.auth.gh.login).to.equal(profile.login)
          expect(r.auth.gh.following_url).to.be.undefined
          DONE()
