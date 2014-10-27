require('./myPostsList.js');
require('./editor.js');

var resolver = require('./../common/routes/helpers.js').resolveHelper;


angular.module("APPosts", ['ngRoute', 'APFilters','APShare',
  'APMyPostsList','APPostEditor','APPost', 'APBookmarker','APSvcSession', 'APSvcPosts','APTagInput'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

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
      template: require('./author.html'),
      controller: 'PublishCtrl as author',
      resolve: authd
    });

    $routeProvider.when('/posts/tag/:tagslug', {
      template: require('./listTag.html'),
      controller: 'TagIndexCtrl'
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {

    SessionService.onAuthenticated( (session) => {
      $rootScope.editor = _.contains(session.roles,'editor');
    })

  }])


  .controller('IndexCtrl', ['$scope','PostsService', 'SessionService',
      function($scope, PostsService, SessionService) {
    var self = this;

    PostsService.getRecentPosts(function (result) {
      $scope.recent = result;
    })

    SessionService.onAuthenticated( (session) => {
      PostsService.getMyPosts(function (result) {
        $scope.myposts = result;
      })
    });
  }])

  .controller('TagIndexCtrl', ['$scope','PostsService', '$routeParams',
      function($scope, PostsService, $routeParams) {
		$scope.tagslug = $routeParams.tagslug;

    PostsService.getTagsPosts($scope.tagslug, function (result) {
      $scope.tag = result.tag;
      $scope.tagposts = result.posts;
    })

  }])


  .controller('NewCtrl', ['$scope', 'PostsService', '$location', 'session',
      function($scope, PostsService, $location, session) {

    var self = this;

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

  }])

  .controller('EditCtrl', ['$scope', 'PostsService', '$routeParams', '$location',
    'session',
    function($scope, PostsService, $routeParams, $location, session) {

    var self = this;
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

  }])


  .controller('PublishCtrl', ['$scope', 'PostsService', '$routeParams',
    'session',
    function($scope, PostsService, $routeParams, session) {

    var self = this;
    $scope.preview = { mode: 'publish' };
    $scope.post = { tags: [] };

    $scope.setPublishedOverride = () => {
      if (!$scope.post.publishedOverride)
      {
        $scope.post.publishedOverride = $scope.post.published || moment().format()
      }
    }


    PostsService.getById($routeParams.id, (r) => {
      if (!r.slug) {
        r.slug = r.title.toLowerCase().replace(/ /g, '-');
      }

      $scope.canonical = 'http://www.airpair.com/v1/posts/' + r.slug;

      if (r.tags.length > 0)
      {
        $scope.canonical = `http://www.airpair.com/${r.tags[0].slug}/posts/${r.slug}`;
      }

      if (!r.meta) {
        var ogVideo = null;
        var ogImage = r.assetUrl;
        if (r.assetUrl && r.assetUrl.indexOf('http://youtub.be/') == 0)
        {
          var youTubeId = r.assetUrl.replace('http://youtu.be/','');
          ogImage = `http://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
          ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`
        }

        r.meta = {
          title: r.title,
          canonical: $scope.canonical,
          ogType: 'article',
          ogTitle: r.title,
          ogImage: ogImage,
          ogVideo: ogVideo,
          ogUrl: $scope.canonical
        }
      }
      $scope.post = _.extend(r, { saved: true});
    });


    $scope.$watch('post.tags', function(value){
      if (value.length > 0)
      {
        $scope.post.meta.canonical = `http://www.airpair.com/${$scope.post.tags[0].slug}/posts/${$scope.post.slug}`;
        $scope.post.meta.ogUrl = `http://www.airpair.com/${$scope.post.tags[0].slug}/posts/${$scope.post.slug}`;
      }
    })

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val();
      PostsService.publish($scope.post, (r) => {
        $scope.post = _.extend(r, { saved: true});
      });
    }

  }])

//-- this will be refactored out of the posts module
.controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams', 'session',
  function($scope, PostsService, $routeParams, session) {

    $scope.username = $routeParams.username;

    PostsService.getByUsername($routeParams.username, (posts) => {
      $scope.posts = posts;
    });

  }])

;
