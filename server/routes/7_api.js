module.exports = function(app, mw, {api}) {

  app.API('auth')
    .get ({ session:             ''                        })


  app.API('tags')
    .uses('noBot')
    .get (
          // { use: 'authd' },
          { tagSearch:           'query.q'                 })


  app.API('me')
    // .params('post')
    .uses('authd inflateMe')
    .get ({ use: 'inflateScopes' },
          { getHome:                ''                     })
    .get ({ getProfile:             '',
            getDrafts:              '',
            getPublished:           '',
            getForks:               ''                     })
            // getActivity:            'post'                 })


  app.API('author')
    .params('post')
    .uses('authd inflateMe')
    .post({ createPost:           'body'                   })
    .get ({ getInfo:              'post',
            getCollaborations:    'post',
            getMarkdown:          'post',
            getPublishing:        'post',
            // getPreview:           'post'
                              })
    .get ({ use: 'inflateScopes' },
          { getForking:           'post',
            // getForReview:         'post',
            getSubmitting:        'post query.slug'        })
    .put ({ use: 'jsonLimit' },
          { updateMarkdown:       'post body'              })
    .put ({ updateInfo:           'post body',
            updateSync:           'post',
            updateSubmit:         'post body.slug'         })
    .put ({ use:'inflateScopes' },
          { //updatePublish:        'post body'
            fork:                 'post'                   })
    .delete({ deletePost:         'post'                   })
    // .delete({ deleteForker:       'post'                   })


  app.API('posts')
    .params('post')
    .uses('authd inflateMe')
    .get ({ getPostsSubmitted:    '',
            getPostForReview:     'post'
          })


  // if ((reviews||{}).on)

  // app.API('reviews')
  //   .params('post')  //  vote
  //   .uses('authd')
  // //   .get({ getMyReviews:          ''})
  //   .put({ submitReview:          'post body'             })
  //   .put({ use: 'paramReviews' },
  //        { reviewComment:         'params.id postreviews body',
  //          reviewVote:            'params.id postreviews body'    })
  //   .delete({ use: 'paramReviews' },
  //           {'deleteReview':      'params.id postreviews'    })
  // // app.API('posts')
  //           // getActivity:            'post'                 })



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
