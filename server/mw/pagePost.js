module.exports = (app, mw) =>

  //     //-- temp hack
  //     if (req.user) req.user = req.session.passport.user
  //     postOpts.bundles = assign(
  //       {'css/page':css||tmpl,'css/size':'s320'}, postsbundles)
  //   }

  ({tmpl,css}) => function(req,res,next) {
    tmpl = tmpl||req.locals.r.tmpl||'v2'


    // $log('pagePost:req.locals'.yellow, req.locals)
    // $log('pagePost:req.r'.yellow, req.r)
    if (tmpl == 'faq')
      req.locals.noindex = true

    // req.locals.head = assign(req.locals.r.htmlHead||{},{title:req.locals.r.title})
    // assign(req.locals, {css})

    mw.res.page(`post_${tmpl}`, assign({layout:'posts'},req.locals))(req,res,next)
  }


