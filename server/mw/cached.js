module.exports = (app, mw) =>

  (ns, key, opts={}) =>
    mw.data.cached(key, honey.logic[ns][key].exec, opts)
