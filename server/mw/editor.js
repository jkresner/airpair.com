var editors = config.authoring.editors.split(',')


module.exports = (app, mw) =>

  mw.res.forbid('noneditor',

    ({user}) =>
      editors.indexOf(user._id) == -1 ? undefined : '!editor'

    , {})


