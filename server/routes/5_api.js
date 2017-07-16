module.exports = function(app, mw, {api}) {
  // if (!api) return;
  // app.API('auth', api)
    // .uses('noBot')
    // .get({'session':             ''                       })

  app.API('tags')
    .uses('noBot')
    .get ({ search:               'query.q'               })

  // app.API('reviews')
  //   .params('post postreview')
  //   .uses('authd')
  //   .get({ getMyReviews:           ''})
  //   .put({ submitReview:          'post body'              })
           // reply:                 'post postreview',
           // upvote:                'post postreview'        })
    // .put({'deleteReview': ,        'post postreview'})     // TODO only editors

  // app.API('posts')
    // .get({ getForks:               '' })
            // getActivity:            'post'                 })

  // app.honey.Router('general:api', { mount: '/v1/api', type: 'api' })
    // .param('tag', mw.$.paramTag)
    // .useEnd(mw.$.apiJson)
  //   .put('/users/me/tag/:tag', mw.$.setAnonSessionData, API.Users.toggleTag)
  //   .put('/users/me/tags', mw.$.setAnonSessionData, API.Users.updateTags)
  //   .put('/users/me/bookmarks', mw.$.setAnonSessionData, API.Users.updateBookmarks)
  //   .put('/users/me/bookmarks/:type/:id', mw.$.setAnonSessionData, API.Users.toggleBookmark)
    // .use(mw.$.authd)
    // .get('/users/me/provider-scopes', populate.user, API.Users.getProviderScopes)
  //   .put('/users/me/email-verify', mw.$.onFirstReq, API.Users.verifyEmail)
    // .put('/users/me/initials', API.Users.changeInitials)
    // .put('/users/me/email', API.Users.changeEmail)
    // .put('/users/me/name', API.Users.changeName)
    // .put('/users/me/username', API.Users.changeUsername)
  //   .put('/users/me/bio', API.Users.changeBio)
    // .put('/users/me/location', API.Users.changeLocationTimezone)
    // .get('/experts/mojo/rank', mw.$.inflateMeExpert, API.Mojo.getRanked)
  //   .get('/experts/me', API.Experts.getMe)
  //   .get('/experts/search/:id', API.Experts.search)
    // .get('/experts/:id', API.Experts.getById)

}
