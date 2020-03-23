module.exports = function(app, mw, {robots}) {

  honey.projector['routes'].Project.tagged(cache.canonical)

  if (!(robots||{}).dir)
    return;


  let dir      = join(config.appDir, robots.dir)
  let routes   = cache.rules


  honey.Router('robots', robots)

    .files(['humans.txt'], {dir})
    .files(['robots.txt','sitemap.xml'], mw.$.seobot, {dir})

    // .use(mw.$.session)

    // rule.abe && .well-known && etc.
    .get(routes['501'], mw.$.foul(501))
    .head('*', mw.$.foul(501))
    .propfind('*', mw.$.foul(501))

    // Gone (deprecated foreseeable future)
    .get(routes['410'], mw.$.foul(410))

    // increment abuse counter when bait hit
    .get(routes['bait'], mw.$.foul(418))

    // immediately ban when hit
    .get(routes['ban'], mw.$.ipban('banurl'))
    // .post('/', mw.$.ipban("homepage"))
    // app.put('/*', mw.$.noBot)
    // app.delete('/*', mw.$.noBot)
}



