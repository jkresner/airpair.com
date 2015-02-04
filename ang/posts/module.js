var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APPosts", ['APShare', 'APTagInput'])

.config(function(apRouteProvider) {

  var authd = resolver(['session']);

  var route = apRouteProvider.route
  route('/posts/me', 'PostsList', require('./list.html'))
  route('/posts/new', 'PostNew', require('./info.html'), { resolve: authd })
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

      $scope.calcReviewStep = () => {
        if ($scope.p.reviewReady) return false

        $scope.wordcount = PostsUtil.wordcount($scope.p.md)
        $scope.wordstogo = PostsUtil.wordsTogoForReview($scope.wordcount)
        if ($scope.wordcount < 500)
          return $scope.wordcountTooLow = true

        if (!$scope.p.assetUrl) $scope.needAssetUrl = true
        if (!$scope.p.tags || $scope.p.tags.length == 0) $scope.needTags = true
        if ($scope.needAssetUrl || $scope.needTags)
          return $scope.needInfo = true

        var social = $rootScope.session.social
        if (!(social && social.gh && social.gh.username))
          return $scope.needGithub = true

        return $scope.submitForReview = true
      }
    }
  }
})


.controller('PostsListCtrl', function($scope, DataService, SessionService) {

  DataService.posts.getMyPosts({}, function (r) {
    $scope.myposts = _.where(r, (p)=> p.by.userId == $scope.session._id)
    $scope.recent = _.difference(r, $scope.myposts)
  })

})

.controller('PostsTagListCtrl', function($scope, $routeParams, DataService) {

  $scope.tagslug = $routeParams.tagslug;
  DataService.posts.getTagsPosts({tagSlug:$scope.tagslug}, function (result) {
    $scope.tag = result.tag;
    $scope.tagposts = result.posts;
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

    if (!r.slug)
      r.slug = r.title.toLowerCase().replace(/ /g, '_').replace(/\W+/g, '').replace(/_/g, '-')

    if (r.meta)
    {
      // if (r.meta.canonical) r.meta.canonical = r.meta.canonical.replace('http://','https://')
      if (r.meta.ogImage) r.meta.ogImage = r.meta.ogImage.replace('http://','https://')

      // $scope.canonical = r.meta.canonical;
      // r.url = r.meta.canonical;
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
    // console.log('$scope.post', $scope.post)
  })

})


.controller('PostEditCtrl', function($scope, $routeParams, $location, $timeout, DataService, mdHelper, PostsUtil) {
  var _id = $routeParams.id

  $scope.notReviewReady = function(post) {
    if (!$scope.preview.wordcount) return false
    console.log('readyForReview', post._id, $scope.preview.wordcount < 500
      || !post.tags || post.tags.length == 0
      || !post.assetUrl
      || !$scope.githubAuthed())
    return

  }

  // var social = {}
  // if (session.github) social.gh = session.github.username
  // if (session.linkedin) social.in = session.linkedin.d9YFKgZ7rY
  // if (session.stack) social.so = session.stack.link.replace('http://stackoverflow.com','')
  // if (session.twitter) social.tw = session.twitter.username
  // if (session.google) social.gp = session.google.id
  // $scope.post.by = _.extend(session, social)
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
        || !$scope.githubAuthed()
    })
  }
  $scope.previewMarkdown = previewMarkdown

  var setPostScope = (r) => {
    $scope.post = r
    $scope.savedMD = r.md
    if (!$scope.aceLoaded) {
      $scope.aceMD = r.md
      $scope.preview = { }
      $scope.aceLoaded = function(_editor) { }
    }
    $timeout(previewMarkdown, 20)

    $scope.throttleMS = r.md.length * 5
  }

  DataService.posts.getById({_id}, setPostScope)

  $scope.delete = () =>
    DataService.posts.deletePost({_id}, (r) => $location.path('/posts/me'))

  $scope.save = () =>
    DataService.posts.update($scope.post, setPostScope)

  $scope.aceChanged = function(e) {
    if (timer == null)
      timer = $timeout(previewMarkdown, $scope.throttleMS)
  };

  $scope.githubAuthed = () => {
    return $scope.session.social && $scope.session.social.gh &&
      $scope.session.social.gh.username
  }

  $scope.submitForReview = () => {
    //TODO handle GitHub redirect
    DataService.posts.submitForReview($scope.post, (r)=> {
      $scope.post = _.extend(r, {submittedForReview: true});
    })
  }

  $scope.submitForPublication = () => {
    console.log("submit post for publication");
  }
})


.controller('PostPublish', function($scope, PostsService, $routeParams) {

  $scope.post = { tags: [] };

//     $scope.setPublishedOverride = () => {
//       if (!$scope.post.publishedOverride)
//         $scope.post.publishedOverride = $scope.post.published || moment().format()
//     }

//     //-- TODO also figure out to add social later
//     // $scope.user = () => { return $scope.post.by }
//     $scope.selectUser = (user) => {
//       $scope.post.by = {
//         userId: user._id,
//         name: user.name,
//         avatar: user.avatar,
//         bio: user.bio,
//         username: user.username
//       };
//     }

//     PostsService.getById($routeParams.id, (r) => {

      // $scope.post = _.extend(r, { saved: false });


      // $scope.$watch('post.meta.canonical', (value) => $scope.post.meta.ogUrl = value );
//     });


//     $scope.$watch('post.tags', function(value) {
//       // console.log('post.tags.changed', value)
//       if (value.length > 0 && !$scope.post.published)
//         $scope.post.meta.canonical = `https://www.airpair.com/${$scope.post.tags[0].slug}/posts/${$scope.post.slug}`;
//     })

//     $scope.save = () => {
//       $scope.post.meta.ofUrl = $scope.post.meta.canonical
//       PostsService.publish($scope.post, (r) => {
//         r.url = r.meta.canonical
//         $scope.post = _.extend(r, { saved: true});
//       });
//     }

//     $scope.tags = () => $scope.post ? $scope.post.tags : null;
//     $scope.updateTags = (scope, newTags) => {
//       if (!$scope.post) {
//         return;
//       }

//       $scope.post.tags = newTags;
//     }

//     $scope.selectTag = function(tag) {
//       var tags = $scope.post.tags;
//       if ( _.contains(tags, tag) ) $scope.post.tags = _.without(tags, tag)
//       else $scope.post.tags = _.union(tags, [tag])
//     };

//     $scope.deselectTag = (tag) => {
//       $scope.post.tags = _.without($scope.post.tags, tag);
//     };

})

// //-- this will be refactored out of the posts module
// .controller('ProfileCtrl', function($scope, PostsService, $routeParams, session) {

//     $scope.username = $routeParams.username;

//     PostsService.getByUsername($routeParams.username, (posts) => {
//       $scope.posts = posts;
//     });

//   })
