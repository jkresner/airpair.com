module.exports = ->

  before (done) ->
    STUB.allGitPublisherAPIcalls()
    DB.ensureDoc 'User', FIXTURE.users.jkg, ->
      done()


  DESCRIBE("SUBMIT", () => require('./review/submit'))
  DESCRIBE("REPLY", () => require('./review/reply'))
  DESCRIBE("VOTE", () => require('./review/vote'))
