module.exports = -> describe "API: ", ->


  before () ->
    SETUP.analytics.stub()

  after ->
    SETUP.analytics.restore()

  it.skip 'Can search users', (done) ->
    done()
