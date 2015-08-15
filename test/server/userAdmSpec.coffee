module.exports = -> describe "ADM: ".subspec, ->



  describe "Combine Accounts", ->


    it.only 'User combine customer', itDone ->
      # Story
      # User[uid1] signs up with gmail, creates incomplete request
      # Comes back a week later, creates new work email account[uid2]
      # Creates new complete request with uid2
      # Adds paymethod with uid1
      # Adds paymethod with uid2
      # Creates credit order with uid1
      # Creates booking order wth uid2
      db.ensureTestDocs @testKey, (docs) ->
        userId1st = '5537ec60079dc61100fd93db'
        userId2nd = '5592c4bd0ae3231100ce5230'

        uSvc = require('../../server/services/users')
        $log('uSvc', docs[0].objectType, docs[2].objectType)
        uSvc.combineAccounts docs[0], docs[2], ->

          # expect('orders.by not set', since might
          # be screwing company admin or airpair admin credit)

          # expect('user2 marked as combined')
          DONE()



    it.skip 'User combines expert'


    it.skip 'User combine author'


    it.skip 'Combines cohort and views'
