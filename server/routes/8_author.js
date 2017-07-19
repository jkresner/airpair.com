module.exports = (app, mw, cfg) => {

  if (!cfg.author) return

  var router = honey.Router('author',{type:'html',mount:'/author'})
    .use(mw.$.livereload)
    .use(mw.$.session)
    .use(mw.$.authd)
    .use(mw.$.inflateMe)

    .get([   // '/library',
             '/',
  //            '/forks',
  //            '/drafts',
  //            '/published',
  //            '/profile',
  //             //
             '/new',
             '/post-info/*',
             '/submit/*',
  //            '/promote/*',
  //            '/reviews/*',
  //            '/collaborate/*',
  //            '/publish/*',
  //            //
             // '/fork/*'
        ], mw.$.pageAuthor('angular1'))

    // .get('/edit/:id', mw.$.logic('me.getForks'),
    //   function(req, res, next) {
    //     var match = _.find(req.locals.r.my||[], p => p._id.toString() == req.params.id)
    //     res.redirect(match ? `/editor/${req.params.id}` : `/fork/${req.params.id}`)
    //   })

    .get(['/editor/:post', '/preview/:post']
        , mw.data.recast('post','params.post', {required:true,dest:'params.post'})
        , mw.$.logic('author.getMarkdown')
        , mw.$.pagePost({tmpl:'editor',css:'edit preview'})
      )

  // app.get('/about', function(req, res, next) { ... }, mw.$.postPage)

}
