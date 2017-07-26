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

    req.locals.htmlHead = req.locals.r.post.htmlHead
    // assign(req.locals, {css})
    // console.log('pagePost'.yellow, req.locals.r)

    mw.res.page(name, assign({layout:'hybrid'},req.locals))(req,res,next)
  }


