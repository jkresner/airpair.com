routes = ->

  IT 'Can hit routes adm bookings routes as spinner', ->
    SETUP.addAndLoginLocalUserWithEmailVerified 'nabk', (s1) ->
      GET "/adm/bookings/1434398823517/1439582823517", {status:403}, (e1) ->
        SETUP.addAndLoginUserWithRole 'adbk', 'spinner', (user) ->
          $log('going'.yellow, user)
          expect(user.roles.length).to.equal(1)
          expect(user.roles[0]).to.equal('spinner')
          GET "/adm/bookings/1434398823517/1439582823517", {}, (bookings) ->
            PUT "/adm/bookings/5592f5f520003a190cfb8735", { sendGCal: true }, {}, ->
              $log('bookings', bookings)
              # expect()
              DONE()


  it.skip 'Can hit only index routes as normal user', ->




module.exports = ->

  describe.skip("Routes: ".subspec, routes)
