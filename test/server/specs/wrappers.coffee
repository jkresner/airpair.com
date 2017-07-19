module.exports = ->

  before ->
    global.org = global.config.wrappers.gitPublisher.org

  after ->
    delete global.org


  DESCRIBE "GIT PUBLISHER",      () => require('./wrappers/gitpublisher')
