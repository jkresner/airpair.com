checkName =

module.exports = ->

  specInit(@)

  DESCRIBE 'CHECK', ->

    before (done) ->
      @timeout(10000)
      if !global.dupName
        throw Error("global.dupName undefined")
      require('../../../migrate/201509/graph')(done)


    IT "Name matches more than one user", ->
      Users.find({name:dupName}).toArray (e, users) ->
        text = ""
        text += uInfoChain(user) for user in users
        $log(text)
        $log("\n")
        expect(users.length, "Only #{users.length} matching name #{dupName}").to.be.at.least(2)
        $log("\nFound #{users.length} matching #{dupName}:\n".green)
        $log(("cmd/tools/merger/emails-check "+_.pluck(users,'email').join(',')).yellow)
        $log("\n")
        DONE()

