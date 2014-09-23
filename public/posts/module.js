require('./../directives/share.js');
require('./../directives/post.js')
require('./../common/filters.js');
require('./../common/postsService.js');
require('./../common/postHelpers.js');
require('./../common/sessionService.js');
require('./myPostsList.js');
require('./editor.js');


angular.module("APPosts", ['ngRoute','APFilters','APShare',
  'APMyPostsList','APPostEditor','APPost', 'APSvcSession', 'APSvcPosts'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    var resolveSession = ['SessionService', '$window', '$q',
      function(SessionService, $window, $q) { 
        return SessionService.getSession().then(
          function(data) {
            return data;
          },
          function()
          {   
            $window.location = '/v1/auth/login?returnTo=/posts/new';
            return $q.reject();
          }
        ); 
    }]; 

    $locationProvider.html5Mode(true);

    $routeProvider.when('/posts', {
      templateUrl: 'index',
      controller: 'IndexCtrl as index'
    });

    $routeProvider.when('/posts/new', {
      template: require('./author.html'),
      controller: 'NewCtrl as author',
      resolve: { session: resolveSession }
    });
    
    $routeProvider.when('/posts/edit/:id', {
      template: require('./author.html'),
      controller: 'EditCtrl as author',
      resolve: { session: resolveSession }      
    });

    $routeProvider.when('/posts/publish/:id', {
      template: require('./author.html'),
      controller: 'PublishCtrl as author',
      resolve: { session: resolveSession }
    });

    $routeProvider.when('/me/:username', {
      template: require('../me/profile.html'),
      controller: 'ProfileCtrl as profile',
      resolve: { session: resolveSession }
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
    
    SessionService.onAuthenticated( (session) => {
      $rootScope.session = session;
    })
  
  }])


  .controller('IndexCtrl', ['$scope','PostsService', 'SessionService', 
      function($scope, PostsService, SessionService) {
    var self = this;

    SessionService.onAuthenticated( (session) => {
      PostsService.getMyPosts(function (result) {
        $scope.myposts = result;
      })  
    }); 
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
      if (!r.meta) {
        var ogVideo = null;
        var ogImage = r.assetUrl;
        if (r.assetUrl.indexOf('http://youtub.be/') == 0)
        {
          var youTubeId = r.assetUrl.replace('http://youtu.be/','');
          ogImage = `http://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
          ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`
        }

        $scope.canonical = 'http://www.airpair.com/v1/posts/' + r.slug;

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

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val();
      PostsService.publish($scope.post, (r) => {
        $scope.post = _.extend(r, { saved: true});
      });
    }

  }])

//-- this will be refactored out of the posts module
.controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams',
    'session',
  function($scope, PostsService, $routeParams, session) {  
    
    $scope.username = $routeParams.username;

    PostsService.getByUsername($routeParams.username, (posts) => {
      $scope.posts = posts;
    });
  
  }])

;