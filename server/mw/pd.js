// pd == "page data"
module.exports = (app, mw) =>

  (path, opts) =>

    mw.data.page(path, opts)

