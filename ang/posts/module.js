require('./myPostsList.js');
require('./editor.js');

var resolver = require('./../common/routes/helpers.js').resolveHelper;


angular.module("APPosts", ['APFilters','APShare',
  'APMyPostsList','APPostEditor','APPost', 'APBookmarker','APSvcSession',
  'APSvcPosts', 'APTagInput'])

  .config(function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/posts', {
      template: require('./list.html'),
      controller: 'IndexCtrl as index'
    });

    $routeProvider.when('/posts/new', {
      template: require('./author.html'),
      controller: 'NewCtrl as author',
      resolve: authd
    });

    $routeProvider.when('/posts/edit/:id', {
      template: require('./author.html'),
      controller: 'EditCtrl as author',
      resolve: authd
    });

    $routeProvider.when('/posts/publish/:id', {
      template: require('./publish.html'),
      controller: 'PublishCtrl as author',
      resolve: authd
    });

    $routeProvider.when('/posts/tag/:tagslug', {
      template: require('./listTag.html'),
      controller: 'TagIndexCtrl'
    });

  })

  .run(function($rootScope, SessionService) {

    SessionService.onAuthenticated( (session) => {
      $rootScope.editor = _.contains(session.roles,'editor');
    })

  })


  .controller('IndexCtrl', function($scope, PostsService, SessionService) {

    PostsService.getRecentPosts(function (result) {
      $scope.recent = result;
    })

    SessionService.onAuthenticated( (session) => {
      PostsService.getMyPosts(function (result) {
        $scope.myposts = result;
      })
    });
  })

  .controller('TagIndexCtrl', function($scope, PostsService, $routeParams) {
		$scope.tagslug = $routeParams.tagslug;

    PostsService.getTagsPosts($scope.tagslug, function (result) {
      $scope.tag = result.tag;
      $scope.tagposts = result.posts;
    })

  })


  .controller('NewCtrl', function($scope, PostsService, $location, session) {

    $scope.preview = { mode: 'edit' };
    $scope.post = { md: "Save post to start authoring markdown ... ", by: $scope.session };

    var social = {}
    if (session.github) social.gh = session.github.username
    if (session.linkedin) social.in = session.linkedin.d9YFKgZ7rY
    if (session.stack) social.so = session.stack.link.replace('http://stackoverflow.com','')
    if (session.twitter) social.tw = session.twitter.username
    if (session.google) social.gp = session.google.id

    $scope.post.by = _.extend(session, social)

    $scope.save = () => {
      $scope.post.md = "Type markdown ..."
      PostsService.create($scope.post, (result) => {
        $location.path('/posts/edit/'+result._id);
      });
    }

  })

  .controller('EditCtrl', function($scope, PostsService, $routeParams, $location, session) {

    $scope.preview = { mode: 'edit' };

    PostsService.getById($routeParams.id, (r) => {
      $scope.post = _.extend(r, { saved: true});
    });

    $scope.delete = () => {
      PostsService.delete($scope.post._id, (r) => {
        $location.path('/posts');
      });
    }

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
      PostsService.update($scope.post, (r) => {
        $scope.post = _.extend(r, { saved: true});
      });
    }

  })


  .controller('PublishCtrl', function($scope, PostsService, $routeParams, session) {

    $scope.post = { tags: [] };

    $scope.setPublishedOverride = () => {
      if (!$scope.post.publishedOverride)
        $scope.post.publishedOverride = $scope.post.published || moment().format()
    }

    //-- TODO also figure out to add social later
    // $scope.user = () => { return $scope.post.by }
    $scope.selectUser = (user) => {
      $scope.post.by = {
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        username: user.username
      };
    }

    PostsService.getById($routeParams.id, (r) => {

      if (!r.slug) r.slug = r.title.toLowerCase().replace(/ /g, '-');

      if (r.meta)
      {
        if (r.meta.canonical) r.meta.canonical = r.meta.canonical.replace('http://','https://')
        if (r.meta.ogImage) r.meta.ogImage = r.meta.ogImage.replace('http://','https://')

        $scope.canonical = r.meta.canonical;
        r.url = r.meta.canonical;
      }
      else
      {
        r.meta = {
          title: r.title,
          canonical: '',
          ogType: 'article',
          ogTitle: r.title,
          ogImage: r.assetUrl.replace('http://','https://'),
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

      $scope.post = _.extend(r, { saved: false });


      $scope.$watch('post.meta.canonical', (value) => $scope.post.meta.ogUrl = value );
    });


    $scope.$watch('post.tags', function(value) {
      // console.log('post.tags.changed', value)
      if (value.length > 0 && !$scope.post.published)
        $scope.post.meta.canonical = `https://www.airpair.com/${$scope.post.tags[0].slug}/posts/${$scope.post.slug}`;
    })

    $scope.save = () => {
      $scope.post.meta.ofUrl = $scope.post.meta.canonical
      PostsService.publish($scope.post, (r) => {
        r.url = r.meta.canonical
        $scope.post = _.extend(r, { saved: true});
      });
    }

    $scope.tags = () => $scope.post ? $scope.post.tags : null;
    $scope.updateTags = (scope, newTags) => {
      if (!$scope.post) {
        return;
      }

      $scope.post.tags = newTags;
    }

    $scope.selectTag = function(tag) {
      var tags = $scope.post.tags;
      if ( _.contains(tags, tag) ) $scope.post.tags = _.without(tags, tag)
      else $scope.post.tags = _.union(tags, [tag])
    };

    $scope.deselectTag = (tag) => {
      $scope.post.tags = _.without($scope.post.tags, tag);
    };

  })

//-- this will be refactored out of the posts module
.controller('ProfileCtrl', function($scope, PostsService, $routeParams, session) {

    $scope.username = $routeParams.username;

    PostsService.getByUsername($routeParams.username, (posts) => {
      $scope.posts = posts;
    });

  })

;
