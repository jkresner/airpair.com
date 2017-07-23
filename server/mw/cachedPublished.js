module.exports = (app, mw) =>

  mw.data.cached('published', honey.logic.posts.recommended.exec)
