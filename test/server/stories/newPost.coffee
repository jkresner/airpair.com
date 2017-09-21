UNIQUIFY_POST = (seedKey) ->
  assign({key},FIXTURE.posts[key])


ENSURE_AUTHOR = (key, cb) ->
  if key
    DB.ensureDocs 'User', [FIXTURE.users[key]], -> LOGIN key, cb
  else
    STORY.newAuthor 'tst1', { ghKey: 'author1', login: true }, cb



module.exports = (key, opts, done) ->
  if !done and opts.constructor is Function
    done = opts
    opts = {}

  suffix = moment().format('X')
  {data,author,submit,publish,fork,review} = opts
  seedKey = FIXTURE.uniquify('posts', key, 'title slug md')
  d = FIXTURE.posts[seedKey]
  # $log('UNIQUIFY_POST', d.title, opts.data)
  ENSURE_AUTHOR author, (s) ->
    post =
      _id:          ObjectId()
      by:           assign(d.by, {_id:s._id,name:s.name,avatar:s.avatar})
      title:        d.title
      assetUrl:     d.assetUrl
      tags:         d.tags
      subscribed:   [{userId:s._id,email:s.email}]
      reviews:      []
      forkers:      []
      md:           d.md + DATA.lotsOfWords('## test #{suffix}')
      log:          history: [], last: {}
      history:      { created:      new Date(), updated:      new Date() }


    if (submit)
      post.slug      = d.slug || "testit-#{key}-#{suffix}"
      post.history.submitted = new Date()
      post.github    = repoInfo: {}
      post.stats     = { words: FIXTURE.posts[key].stats.words }

    if (publish)
      post.history.published = new Date()
      post.history.live =
        by: s._id
        published:  new Date()
        commit: {}

    # if (review)
    assign(FIXTURE.posts[seedKey], post, opts.data||{})

    DB.Collections.posts.insert FIXTURE.posts[seedKey], (e, r) ->
      if (e)
        $log('newPost.e'.red, e)
      done post, s
