var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APPosts", ['APShare', 'APTagInput'])

.config(function(apRouteProvider) {

  var authd = resolver(['session']);

  var route = apRouteProvider.route
  route('/posts/me', 'PostsList', require('./list.html'))
  route('/posts/new', 'PostNew', require('./info.html'), { resolve: authd })
  route('/posts/review', 'PostsInReview', require('./inreview.html'), { resolve: authd })
  route('/posts/in-community-review', 'PostsInReview', require('./inreview.html'), { resolve: authd })
  route('/posts/submit/:id', 'PostSubmit', require('./submit.html'), { resolve: authd })
  route('/posts/fork/:id', 'PostFork', require('./fork.html'), { resolve: authd })
  route('/posts/info/:id', 'PostInfo', require('./info.html'), { resolve: authd })
  route('/posts/edit/:id', 'PostEdit', require('./edit.html'), { resolve: authd })
  route('/posts/tag/:tagslug', 'PostsTagList', require('./listTag.html'))
  route('/posts/publish/:id', 'PostPublish', require('./publish.html'), { resolve: authd })

})


.directive('postStepHelper', function(PostsUtil) {
  return {
    template: require('./postStepHelper.html'),
    scope: { p: '=post' },
    controller($rootScope, $scope) {

      $scope.calcDraftStep = () => {
        if ($scope.p.submitted) return false

        $scope.wordcount = PostsUtil.wordcount($scope.p.md)
        $scope.wordstogo = PostsUtil.wordsTogoForReview($scope.wordcount)
        if ($scope.wordcount < 500)
          return $scope.wordcountTooLow = true

        if (!$scope.p.assetUrl || !$scope.p.tags || $scope.p.tags.length == 0) {
          $scope.needInfo = true
          if (!$scope.p.tags || $scope.p.tags.length == 0) return $scope.needTags = true
          if (!$scope.p.assetUrl) return $scope.needAssetUrl = true
        }

        return $scope.submitForReview = true
      }

      $scope.calcReviewStep = () => {
        if ($scope.p.published || !$scope.p.submitted) return false

        return $scope.getReviews = true
      }
    }
  }
})


.controller('PostsListCtrl', function($scope, $location, DataService, SessionService) {

  DataService.posts.getMyPosts({}, function (r) {
    $scope.myposts = _.where(r, (p)=> p.by.userId == $scope.session._id)
    $scope.recent = _.difference(r, $scope.myposts)

    if ($location.search().submitted && $scope.session._id)
    {
      $scope.submitted = _.find(r, (p)=> p._id == $location.search().submitted)
    }
  })

  if ($scope.session._id && $scope.session.social && $scope.session.social.gh)
  {
    DataService.posts.getMyForks({}, function (forks) {
      $scope.forks = forks

      var toForkId = $location.search().fork
      if (toForkId && !_.find(forks, (f) => toForkId == f._id))
      {
        DataService.posts.addForker({_id:$location.search().fork}, function (r) {
          $scope.forked = r
          $scope.forks = _.union($scope.forked, [r])
        })
      }
    })
  }

  $scope.delete = (_id) =>
    DataService.posts.deletePost({_id}, (r) => window.location = '/posts/me')

})

.controller('PostsTagListCtrl', function($scope, $routeParams, DataService) {

  $scope.tagslug = $routeParams.tagslug;
  DataService.posts.getTagsPosts({tagSlug:$scope.tagslug}, function (result) {
    $scope.tag = result.tag;
    $scope.tagposts = result.posts;
  })

})


.controller('PostsInReviewCtrl', function($scope, DataService) {

  DataService.posts.getInReview({}, function (r) {
    $scope.inreview = r;
  })

})

.controller('PostNewCtrl', function($scope, $location, DataService, StaticDataService) {

  $scope.post = { md: StaticDataService.defaultPostMarkdown, by: $scope.session }

  $scope.save = () =>
    DataService.posts.create($scope.post, (result) => {
      $location.path('/posts/edit/'+result._id)
    })

})

.controller('PostInfoCtrl', function($scope, $routeParams, $location, DataService, PostsUtil) {
  var exampleImageUrl = '//www.airpair.com/static/img/css/blog/example2.jpg';
  var exampleYoutubeUrl = 'http://youtu.be/qlOAbrvjMBo';
  var _id = $routeParams.id

  $scope.save = () =>
    DataService.posts.update($scope.post, (result) => {
      $location.path('/posts/edit/'+result._id)
    })

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
      $scope.preview.asset = `<span>Paste an image url or short link to a youtube movie<br /><br />Example<br /> ${exampleYoutubeUrl}<br /> ${exampleImageUrl}</span>`
      return
    }
    else if (value.indexOf('http://youtu.be/') == 0) {
      var youTubeId = value.replace('http://youtu.be/', '');
      $scope.preview.asset = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
    }
    else
    {
      $scope.preview.asset = `<img src="${value}" />`;
    }

    $scope.post.meta.ogImage = value;
    if (value.indexOf('http://youtu.be/') == 0) {
      var youTubeId = value.replace('http://youtu.be/','');
      $scope.post.meta.ogImage = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
      // ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`;
    }

  });

  $scope.exampleImage = function() { $scope.post.assetUrl = exampleImageUrl }
  $scope.exampleYouTube = function() { $scope.post.assetUrl = exampleYoutubeUrl }

  DataService.posts.getById({_id}, (r) => {

    if (r.meta)
    {
      if (r.meta.ogImage) r.meta.ogImage = r.meta.ogImage.replace('http://','https://')
    }
    else
    {
      r.meta = {
        title: r.title,
        canonical: '',
        ogType: 'article',
        ogTitle: r.title,
        ogImage: (r.assetUrl) ? r.assetUrl.replace('http://','https://') : null,
        ogVideo: null,  // we don't want facebook to point to the original moview, but the post instead
        ogUrl: ''
      };
    }

    if (r.assetUrl)
    {
      if (r.assetUrl.indexOf('http://youtu.be/') == 0) {
        var youTubeId = r.assetUrl.replace('http://youtu.be/','');
        r.meta.ogImage = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
        // ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`;
      }
    }

    $scope.post = r
  })

  // PostsService.getToc(md, function (tocMd) {
  //   if (tocMd.toc)
  //   {
  //     marked(tocMd.toc, function (err, tocHtml) {
  //       if (err) throw err;

  //       tocHtml = tocHtml.substring(4, tocHtml.length-6)
  //       $scope.preview.toc = tocHtml;
  //     });
  //   }
  // });

})


.controller('PostEditCtrl', function($scope, $routeParams, $location, $timeout, $window, DataService, mdHelper, PostsUtil) {
  var _id = $routeParams.id

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

      $scope.notReviewReady = $scope.preview.wordcount < 500
        || !$scope.post.tags || $scope.post.tags.length == 0
        || !$scope.post.assetUrl
    })
  }
  $scope.previewMarkdown = previewMarkdown

  var setPostScope = (r) => {
    $scope.post = r
    $scope.post.commitMessage = ""
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
  }

  DataService.posts.getById({_id}, (r) => {
    if (!r.github) return setPostScope(r)
    DataService.posts.getGitHEAD({_id}, (h) => {
      $scope.head = h
      r.md = h.string
      setPostScope(r)
    }, (e) => {
      $scope.editErr = e.message;
      $scope.fork = `${$scope.session.social.gh.username}/${r.slug}`
    })
  }, (e) => {
    $scope.editErr = e.message;
    $scope._id = _id
  })

  $scope.save = () => {
    if (!$scope.post.submitted)
      DataService.posts.update($scope.post, setPostScope)
    else {
      if ($scope.post.commitMessage == "") return alert('Commit message required')
      DataService.posts.updateGitHEAD($scope.post, setPostScope)
    }
  }

  $scope.aceChanged = function(e) {
    if (timer == null)
      timer = $timeout(previewMarkdown, $scope.throttleMS)
  };

})

.controller('PostSubmitCtrl', function($scope, $q, $routeParams, $location, $timeout, DataService, mdHelper, PostsUtil) {
  var _id = $routeParams.id

  $scope.slugStatus = { checking: true }

  DataService.posts.getById({_id}, (r) => {
    if (r.submitted)
      $location.path('/posts/me?submitted='+_id)

    $scope.post = r

    $scope.$watch('post.slug', function(slug) {
      DataService.posts.checkSlugAvailable({_id,slug}, (r) => $scope.slugStatus = r )
    })

    if (!$scope.post.slug)
      $scope.post.slug = r.title.toLowerCase().replace(/ /g, '_').replace(/\W+/g, '').replace(/_/g, '-')

  })

  $scope.githubAuthed = () => {
    return $scope.session.social && $scope.session.social.gh &&
      $scope.session.social.gh.username
  }

  $scope.submitForReviewDeferred = () => {
    var deferred = $q.defer()

    DataService.posts.submitForReview($scope.post, (r) => {
      window.location = '/posts/me?submitted='+r._id
      deferred.resolve(r)
    },
    deferred.reject)

    return deferred.promise
  }

})


.controller('PostForkCtrl', function($scope, $routeParams, $location, DataService, PostsUtil) {
  var _id = $routeParams.id

  $scope.fork = () =>
    DataService.posts.fork($scope.post, (result) => {
      $location.path('/posts/me?forked='+result._id)
    })

  DataService.posts.getByIdForForking({_id}, (r) => {
    $scope.post = r
    $scope.tofork = [r]
  })

})


.controller('PostPublishCtrl', function($scope, DataService, $routeParams) {
  var _id = $routeParams.id

  $scope.setPublishedOverride = () => {
    if (!$scope.post.publishedOverride)
      $scope.post.publishedOverride = $scope.post.published || moment().format()
  }

  //-- TODO also figure out to add social later
  $scope.user = () => { return $scope.post.by }
  $scope.selectUser = (user) => {
    $scope.post.by = {
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      username: user.username
    };
  }

  var setScope = (r) => {
    $scope.post = r
    $scope.$watch('post.meta.description', (value) => $scope.post.meta.ogDescription = value )
    $scope.canPublish = r.reviews && r.reviews.length > 0 || _.contains($scope.session.roles, 'admin')
    $scope.canPropagate = _.contains($scope.session.roles, 'admin') || !r.published
    $scope.headPropagated = (r.mdHEAD) ? r.md == r.mdHEAD : true
  }

  DataService.posts.getByIdForPubishing({_id}, setScope)

  $scope.propagate = () =>
    DataService.posts.propagateFromHEAD($scope.post, setScope)

  $scope.publish = () =>
    DataService.posts.publish($scope.post, (r) => window.location = r.meta.canonical)

})

