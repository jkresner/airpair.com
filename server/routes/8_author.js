module.exports = (app, mw, {author}) => {
  if (!author) return

  var router = honey.Router('author',{type:'html',mount:'/author'})
    .use(mw.$.livereload)
    .use(mw.$.abuser)
    .use(mw.$.session)
    .use(mw.$.authd)
    .use(mw.$.inflateMe)

    .get([   // '/library',
             '/',
             '/forks',
             '/drafts',
             '/published',
             '/profile'        ], mw.$.pageClient)
  //             //

    .get([
             '/new',
             '/post-info/*',
             '/editor/*',
             '/submit/*',
  //            '/promote/*',
  //            '/reviews/*',
  //            '/collaborate/*',
             // '/publish/*',
  //            //
             // '/fork/*'
        ]
        , (req,res,next) => next(null, req.locals.omitSiteNav = true)
        , mw.$.pageClient)


    // .get('/edit/:id', mw.$.logic('me.getForks'),
    //   function(req, res, next) {
    //     var match = _.find(req.locals.r.my||[], p => p._id.toString() == req.params.id)
    //     res.redirect(match ? `/editor/${req.params.id}` : `/fork/${req.params.id}`)
    //   })

    .get(['/editor/:post', '/preview/:post']
        , mw.data.recast('post','params.post', {required:true,dest:'params.post'})
        , mw.$.pd('author.getMarkdown')
        , mw.$.pagePost({tmpl:'editor',css:'edit preview'})
      )


}
