module.exports = ->

  before (done) ->
    DB.removeDocs 'User', { email:'airpairtest1@gmail.com' }, ->
      DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'snug', ->
    DB.ensureExpert 'louf', ->
    DB.ensureExpert 'tmot', ->
    DB.ensureExpert 'gnic', ->
    DB.ensureExpert 'dros', ->
    DB.ensureExpert 'phlf', ->
    # LOGIN 'admin', (s) ->
    #   GET '/adm/requests/active', -> done() # force tmpl cache hack

