module.exports = (app, mw) =>

  //     //-- temp hack
  //     if (req.user) req.user = req.session.passport.user
  //     postOpts.bundles = assign(
  //       {'css/page':css||tmpl,'css/size':'s320'}, postsbundles)
  //   }

  ({tmpl,css}) => function(req,res,next) {

    req.locals.css = css || { body: 'blogpost' }

    var {post,subscribed,similar,adTag} = req.locals.r
    let name = `post_${tmpl||req.locals.r.tmpl||post.tmpl||'v1'}`

    // $log('pagePost:req.locals'.yellow, req.locals)
    // $log('pagePost:req.r'.yellow, tmpl, post.tmpl, name, post.tmpl, post.title)  //req.r)

    if (tmpl == 'faq' || post.tmpl == 'faq') {
      req.locals.noindex = true
      req.locals.css.body = 'blogpost faq'
    }

    let htmlHead = req.locals.r.post.htmlHead
    if (!htmlHead) throw Error("post page req.locals.htmlHead required")
if (config.env != 'dev') {
    if (/apple/i.test(req.ctx.ud)) htmlHead.apple = true
    if (/android/.test(req.ctx.ud)) htmlHead.android = true
    if (/ms/.test(req.ctx.ud)) htmlHead.ms = true
}
    assign(req.locals,{htmlHead})
    // assign(req.locals, {css})
    // console.log('pagePost'.yellow, req.locals.r.post)

    mw.res.page(name, assign({layout:'hybrid'},req.locals))(req,res,next)

  }


