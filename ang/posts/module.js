var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APPosts", ['APShare', 'APTagInput'])

.config(function(apRouteProvider) {

  var authd = resolver(['session']);

  var route = apRouteProvider.route
  route('/posts/me', 'PostsList', require('./list.html'))
  route('/posts/new', 'PostInfo', require('./info.html'), { resolve: authd })
  route('/posts/review', 'PostsInReview', require('./inreview.html'), { resolve: authd })
  route('/posts/in-community-review', 'PostsInReview', require('./inreview.html'), { resolve: authd })
  route('/posts/submit/:id', 'PostSubmit', require('./submit.html'), { resolve: authd })
  route('/posts/fork/:id', 'PostFork', require('./fork.html'), { resolve: authd })
  route('/posts/info/:id', 'PostInfo', require('./info.html'), { resolve: authd })
  route('/posts/edit/:id', 'PostEdit', require('./edit.html'), { resolve: authd })
  route('/posts/tag/:tagslug', 'PostsTagList', require('./listTag.html'))
  route('/posts/publish/:id', 'PostPublish', require('./publish.html'), { resolve: authd })
  route('/posts/contributors/:id', 'PostContributors', require('./contributors.html'), { resolve: authd })

})


.directive('postStepHelper', function(PostsUtil) {
  return {
    template: require('./postStepHelper.html'),
    scope: { p: '=post' },
    controller($rootScope, $scope) {

      $scope.isAuthor = $scope.p.by.userId == $rootScope.session._id

      $scope.calcDraftStep = () => {
        $scope.submitForReview = false
        $scope.wordcountTooLow = false
        $scope.needInfo = false
        $scope.needTags = false
        $scope.needAssetUrl = false

        if ($scope.p.submitted) return false

        if ($scope.p.md && !$scope.p.wordcount)
          $scope.p.wordcount = PostsUtil.wordcount($scope.p.md)

        if ($scope.p.published) $scope.submitForReview = true
        else if ($scope.p.wordcount && $scope.p.wordcount < 400) {
          $scope.wordstogo = PostsUtil.wordsTogoForReview($scope.p.wordcount)
          $scope.wordcountTooLow = true
        }
        else if (!$scope.p.assetUrl || !$scope.p.tags || $scope.p.tags.length == 0) {
          $scope.needInfo = true
          if (!$scope.p.tags || $scope.p.tags.length == 0) return $scope.needTags = true
          if (!$scope.p.assetUrl) return $scope.needAssetUrl = true
        }
        else
          $scope.submitForReview = true

        return true
      }

      $scope.calcReviewStep = () => {
        if ($scope.p.published || !$scope.p.submitted) return false
        if (!$scope.p.stats || $scope.p.stats.reviews < 3)
          return $scope.needReviews = true
        else {
          if ($scope.p.by.userId == $rootScope.session._id)
          return $scope.publishReady = true
        }

        return $scope.getReviews = true
      }
    }
  }
})


.controller('PostsListCtrl', function($scope, $location, DataService, SessionService, PostsUtil, Roles) {

  DataService.posts.getMyPosts({}, function (r) {
    var meUserId = $scope.session._id
    var recent = []
    var all = []
    var mine = []
    var forks = []

    if ($scope.session._id)
    {
      for (var i=0;i<r.length;i++) {
        r[i] = PostsUtil.extendWithReviewsSummary(r[i])
        r[i].forked = Roles.post.isForker($scope.session, r[i])
        r[i].mine = r[i].by.userId == $scope.session._id
        if (!r[i].published && r[i].submitted)
          recent.push(r[i])
        if (r[i].mine)
          mine.push(r[i])
        if (r[i].forked) {
          forks.push(r[i])
          r[i].needsMyReview = !_.find(r[i].reviews,(rev)=>rev.by._id == meUserId)
          r[i].needsMyFork = !_.find(r[i].forkers,(f)=>f.userId == meUserId)
        }
      }

      if ($scope.session.social && $scope.session.social.gh)
      {
        if ($location.search().submitted)
          $scope.submitted = _.find(mine, (p)=> p._id == $location.search().submitted)

        var toForkId = $location.search().fork
        if (toForkId)
        {
          $scope.forked = _.find(forks, (f) => toForkId == f._id)
          // if (!$scope.forked)  //-- sometimes wew just want to refork it...
          DataService.posts.addForker({_id:$location.search().fork}, function (forked) {
            if (!$scope.forked) {
              $scope.forked = forked
              $scope.all = _.union($scope.all, [forked])
              $scope.forks = _.union($scope.forks, [forked])
              $scope.filterMyPosts($scope.filter)
            }
          })
        }
      }

    }

    $scope.all = _.sortBy(_.union(mine,forks),(p)=>moment(p.lastTouch.utc).format('X')*-1)
    $scope.mine = mine
    $scope.forks = forks
    $scope.filterMyPosts('all')
    $scope.recent = _.sortBy((recent.length > 0) ? recent : r,(p)=>moment(p.submitted).format('X')*-1)
  })

  $scope.delete = (_id) =>
    DataService.posts.deletePost({_id}, (r) => window.location = '/posts/me')

  $scope.filterMyPosts = (filter) => {
    $scope.filter = filter
    $scope.contributions = $scope[filter]
  }

})

.controller('PostsTagListCtrl', function($scope, $routeParams, DataService) {

  $scope.tagslug = $routeParams.tagslug;
  DataService.posts.getTagsPosts({tagSlug:$scope.tagslug}, function (result) {
    $scope.tag = result.tag;
    $scope.tagposts = result.posts;
  })

})


.controller('PostsInReviewCtrl', ($scope, DataService) => {

  DataService.posts.getInReview({}, (r) => $scope.inreview = r )

})


.controller('PostInfoCtrl', ($scope, $routeParams, $location, StaticDataService, DataService, PostsUtil) => {
  var _id = $routeParams.id

  $scope.save = () => {
    var redirectTo = (!$scope.post.submitted) ?
      '/posts/edit/' : '/posts/preview/'

    var saveFn = (_id) ? DataService.posts.update : DataService.posts.create
    saveFn($scope.post, (r) => window.location = redirectTo+r._id )
  }

  $scope.tags = () => $scope.post ? $scope.post.tags : null;
  $scope.updateTags = (scope, newTags) => {
    if (!$scope.post) return
    $scope.post.tags = newTags;
  }
  $scope.selectTag = function(tag) {
    var tags = $scope.post.tags;
    if ( _.contains(tags, tag) ) $scope.post.tags = _.without(tags, tag)
    else $scope.post.tags = _.union(tags, [tag])
  };
  $scope.deselectTag = (tag) => $scope.post.tags = _.without($scope.post.tags, tag)


  $scope.$watch('post.assetUrl', function(value) {
    $scope.preview = {}
    if (!value)
    {
      $scope.preview.asset = `<span>Paste an image url or short link to a youtube movie<br /><br />Example<br /> ${StaticDataService.examplePostYouTube}<br /> ${StaticDataService.examplePostImage}</span>`
      return
    }
    else if (value.indexOf('http://youtu.be/') == 0) {
      var youTubeId = value.replace('http://youtu.be/', '');
      $scope.preview.asset = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
    }
    else {
      $scope.post.assetUrl = value.replace('http:','https:')
      $scope.preview.asset = `<img src="${$scope.post.assetUrl}" />`
    }
  });

  $scope.exampleImage = () => $scope.post.assetUrl = StaticDataService.examplePostImage
  $scope.exampleYouTube = () => $scope.post.assetUrl = StaticDataService.examplePostYouTube

  $scope.clearDefaultTitle = () => {
    if ($scope.post.title == 'Title of your blog post ...')
      $scope.post.title = ''
  }

  if (_id)
    DataService.posts.getByIdForEditingInfo({_id}, (r) => {
      if ($scope.session._id == r.by.userId) { // don't wipe author with editor session
        var bio = r.by.bio
        r.by = _.extend(r.by, $scope.session)  // update new social links
        r.by.bio = bio // in case this post has it's own specific bio, don't wipe it!
      }
      $scope.post = r
    })
  else
    $scope.post = { title: 'Title of your blog post ...', by: $scope.session, assetUrl: '//www.airpair.com/static/img/css/blog/example2.jpg' }

})


.controller('PostEditCtrl', ($scope, $routeParams, $timeout, $window, StaticDataService, DataService, PostsUtil) => {
  var _id = $routeParams.id
  $scope._id = _id

  var timer = null

  var previewMarkdown = function() {
    if (timer) {
      $timeout.cancel(timer)
      timer = null
    }

    var md = window.ace.edit($('#aceeditor')[0]).getSession().getValue()
    if (!$scope.post) return
    $scope.post.saved = $scope.savedMD == md
    if ($scope.post.saved && $scope.preview.body) return

    marked(md, function (err, postHtml) {
      if (err) throw err;
      $scope.post.md = md
      $scope.preview.body = postHtml
      $scope.preview.wordcount = PostsUtil.wordcount($scope.post.md)

      $scope.notReviewReady = $scope.preview.wordcount < 400
        || !$scope.post.tags || $scope.post.tags.length == 0
        || !$scope.post.assetUrl
    })
  }
  $scope.previewMarkdown = previewMarkdown

  var checkLocationChangeStart = null
  var setPostScope = function(r) {
    $scope.isAuthor = r.by.userId == $scope.session._id

    if ((r.published && !r.submitted) && ($scope.isAuthor))
      return $scope.editErr = { message: `Edits on published posts my be tracked in git. <br />Please <a href="/posts/submit/${r._id}">submit your post</a> to continue editing it.` }

    if (r.md == "new") r.md = StaticDataService.defaultPostMarkdown

    r.wordcount = PostsUtil.wordcount(r.md)
    r.commitMessage = ""
    $scope.post = r
    $scope.savedMD = r.md
    if (!$scope.aceLoaded) {
      $scope.aceMD = r.md
      $scope.preview = { }
      $scope.aceLoaded = function(_editor) { }
    }
    $timeout(previewMarkdown, 20)

    $scope.throttleMS = r.md.length * 5

    $window.onbeforeunload = function() {
      var md = window.ace.edit($('#aceeditor')[0]).getSession().getValue()
      var saved = $scope.savedMD == md
      if (!saved) return `It looks like haven't saved some changes...`
    }

    if (checkLocationChangeStart) checkLocationChangeStart()
    checkLocationChangeStart = $scope.$on("$locationChangeStart", function(event) {
      var md = window.ace.edit($('#aceeditor')[0]).getSession().getValue()
      var saved = $scope.savedMD == md
      if (!saved) {
        alert(`It looks like you have unsaved changes...`)
        event.preventDefault();
      }
    })
  }

  $scope.save = () => {
    var editSession = window.ace.edit($('#aceeditor')[0]).getSession()
    // var cols = editSession.getScreenWidth()
    //var md = PostsUtil.splitLines(editSession.doc.$lines.slice(0), cols, editSession.doc).join('\n')
    var md = window.ace.edit($('#aceeditor')[0]).getSession().getValue()
    var commitMessage = $scope.post.commitMessage
    if (commitMessage == "" && $scope.post.submitted) return alert('Commit message required')
    DataService.posts.updateMarkdown({_id,md,commitMessage}, setPostScope)
  }

  $scope.aceChanged = function(e) {
    if (timer == null)
      timer = $timeout(previewMarkdown, $scope.throttleMS)
  }

  DataService.posts.getByIdEditing({_id}, setPostScope, (e) => $scope.editErr = e)

})


.controller('PostSubmitCtrl', ($scope, $q, $routeParams, ServerErrors, DataService) => {
  var _id = $routeParams.id
  $scope._id = _id

  DataService.posts.getByIdForSubmitting({_id}, (post) => {
    if (post.submitted)
      window.location = '/posts/me?submitted='+post._id
    $scope.post = post
    $scope.repoAuthorized = post.submit.repoAuthorized
    $scope.slugStatus = post.submit.slugStatus
  })

  $scope.checkSlugAvailable = (slug) => {
    DataService.posts.checkSlugAvailable({_id,slug}, (r) => $scope.slugStatus = r )
  }

  $scope.submitForReviewDeferred = () => {
    var deferred = $q.defer()

    DataService.posts.submitForReview($scope.post, (r) => {
      window.location = '/posts/me?submitted='+r._id
      deferred.resolve(r)
    },
    (e) => {
      ServerErrors.add(e)
      deferred.reject(e)
    })

    return deferred.promise
  }

})


.controller('PostForkCtrl', ($scope, $routeParams, DataService) => {
  var _id = $routeParams.id
  $scope._id = _id

  DataService.posts.getByIdForForking({_id}, (r) => {
    $scope.post = r
    $scope.isOwner = r.by.userId == $scope.session._id
    $scope.repoAuthorized = r.submit.repoAuthorized
  })

  $scope.fork = () =>
    DataService.posts.fork($scope.post, (result) =>
      window.location = '/posts/me?forked='+_id )


})


.controller('PostPublishCtrl', function($scope, DataService, $routeParams) {
  var _id = $routeParams.id

  $scope.setPublishedOverride = () => {
    if (!$scope.data.publishedOverride)
      $scope.data.publishedOverride = $scope.post.published || moment().format()
  }

  $scope.user = () => { return $scope.post.by }
  $scope.selectUser = (user) => {
    $scope.post.by = {
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      username: user.username
    };
    $scope.data.by = $scope.post.by
  }

  // if (r.assetUrl)
  // {
  //   if (r.assetUrl.indexOf('http://youtu.be/') == 0) {
  //     var youTubeId = r.assetUrl.replace('http://youtu.be/','')
  //     r.meta.ogImage = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
  //   }
  // }
    //   $scope.post.meta.ogImage = value;
    // if (value.indexOf('http://youtu.be/') == 0) {
    //   var youTubeId = value.replace('http://youtu.be/','');
    //   $scope.post.meta.ogImage = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
    // }



  var setScope = (r) => {
    var isAdmin =  _.contains($scope.session.roles, 'admin')
    var isEditor =  _.contains($scope.session.roles, 'editor')
    $scope.post = r
    $scope.data = _.pick(r, '_id', 'meta', 'tmpl', 'by')
    $scope.$watch('data.meta.description', (value) => $scope.data.meta.ogDescription = value )
    $scope.$watch('data.meta.ogImage', (value) => $scope.post.meta.ogImage = value )
    $scope.canPublish = r.reviews && r.reviews.length > 0 || isAdmin || isEditor
    $scope.canPropagate = isAdmin || isEditor || !r.published
    $scope.canChangeAuthor = isAdmin
    $scope.canSetTemplate = isAdmin
    $scope.canOverrideCanonical = isAdmin
    $scope.headPropagated = (r.mdHEAD) ? r.md == r.mdHEAD : true
  }

  DataService.posts.getByIdForPubishing({_id}, setScope)

  $scope.propagate = () =>
    DataService.posts.propagateFromHEAD({_id}, setScope)

  $scope.submitPublish = (formValid, data, postPublishForm) => {
    if (formValid)
      DataService.posts.publish(data, (r) => window.location = r.meta.canonical)
  }

})


.controller('PostContributorsCtrl', function($scope, $routeParams, DataService, PostsUtil) {
  var _id = $routeParams.id

  DataService.posts.getByIdForContributors({_id}, (r) => {
    if (r.url.indexOf('/posts/review') == 0) r.url = `https://www.airpair.com${r.url}`
    $scope.post = PostsUtil.extendWithReviewsSummary(r)
  })

})
