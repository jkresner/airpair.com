var resolver = require('./../common/routes/helpers.js').resolveHelper;


angular.module("APPosts", ['APShare', 'APTagInput'])

.config(function(apRouteProvider) {

  var authd = resolver(['session']);

  var route = apRouteProvider.route
  route('/posts', 'PostsList', require('./list.html'))
  route('/posts/new', 'PostNew', require('./info.html'), { resolve: authd })
  // route('/posts/info/:id', 'PostInfo', require('./info.html'), { resolve: authd })
  route('/posts/edit/:id', 'PostEdit', require('./edit.html'), { resolve: authd })
  route('/posts/tag/:tagslug', 'PostsTagList', require('./listTag.html'))
  route('/posts/publish/:id', 'PostPublish', require('./publish.html'), { resolve: authd })

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


.controller('PostNewCtrl', function($scope, $location, DataService) {

  $scope.post = { md: "Type markdown ...", by: $scope.session }
  console.log('post', $scope.post)

  $scope.save = () =>
    DataService.posts.create($scope.post, (result) => {
      $location.path('/posts/edit/'+result._id)
    })

})

.controller('PostEditCtrl', function($scope, $routeParams, $location, DataService) {
  var _id = $routeParams.id
  var firstRender = true

  // var social = {}
  // if (session.github) social.gh = session.github.username
  // if (session.linkedin) social.in = session.linkedin.d9YFKgZ7rY
  // if (session.stack) social.so = session.stack.link.replace('http://stackoverflow.com','')
  // if (session.twitter) social.tw = session.twitter.username
  // if (session.google) social.gp = session.google.id
  // $scope.post.by = _.extend(session, social)

  var previewMarkdown = function(md, e) {
    if ($scope.post)
    {
      if (firstRender) firstRender = false
      else $scope.post.saved = false
    }
    console.log('previewMarkdown', $scope.post.saved, md)

    if (md)
    {
      $scope.renderedMD = md
      marked(md, function (err, postHtml) {
        if (err) throw err;
        $scope.preview.body = postHtml;
        // console.log('preview', $scope.preview.body)
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
    }
  }

  DataService.posts.getById({_id}, (r) => {

    $scope.post = _.extend(r, { saved: true })
    $scope.preview = {}

    $scope.aceLoaded = function(_editor) {
      $scope.previewMarkdown = previewMarkdown

    // $scope.$watch('post.md', $scope.previewMarkdown)
    }
  })

  $scope.delete = () =>
    DataService.posts.deletePost({_id}, (r) => $location.path('/posts'))

  $scope.save = () => {
    // $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
    DataService.posts.update($scope.post, (r) => {
      $scope.post = _.extend(r, { saved: true});
    });
  }

  $scope.aceChanged = function(e) {
    if ($scope.post.md == $scope.renderedMD) return
    console.log('aceChanged', $scope.post.md)
    $scope.previewMarkdown($scope.post.md)
    // $scope.previewMarkdown()
  };

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

//       if (!r.slug) r.slug = r.title.toLowerCase().replace(/ /g, '-');

//       if (r.meta)
//       {
//         if (r.meta.canonical) r.meta.canonical = r.meta.canonical.replace('http://','https://')
//         if (r.meta.ogImage) r.meta.ogImage = r.meta.ogImage.replace('http://','https://')

//         $scope.canonical = r.meta.canonical;
//         r.url = r.meta.canonical;
//       }
//       else
//       {
//         r.meta = {
//           title: r.title,
//           canonical: '',
//           ogType: 'article',
//           ogTitle: r.title,
//           ogImage: r.assetUrl.replace('http://','https://'),
//           ogVideo: null,  // we don't want facebook to point to the original moview, but the post instead
//           ogUrl: ''
//         };
//       }

//       if (r.assetUrl)
//       {
//         if (r.assetUrl.indexOf('http://youtu.be/') == 0) {
//           var youTubeId = r.assetUrl.replace('http://youtu.be/','');
//           r.meta.ogImage = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
//           // ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`;
//         }
//       }

//       $scope.post = _.extend(r, { saved: false });


//       $scope.$watch('post.meta.canonical', (value) => $scope.post.meta.ogUrl = value );
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
