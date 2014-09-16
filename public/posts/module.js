require('./../directives/share.js');
require('./../directives/postsList.js');
require('./../directives/post.js')
require('./../common/filters.js');
require('./../common/postsService.js');
require('./../common/sessionService.js');
require('./editor.js');


angular.module("APPosts", ['ngRoute','APFilters','APShare',
  'APPostsList','APPostEditor','APPost', 'APSvcSession', 'APSvcPosts'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    $locationProvider.html5Mode(true);

    $routeProvider.when('/posts', {
      templateUrl: 'index',
      controller: 'IndexCtrl as index'
    });

    $routeProvider.when('/posts/new', {
      template: require('./author.html'),
      controller: 'NewCtrl as author'
    });
    
    $routeProvider.when('/posts/edit/:id', {
      template: require('./author.html'),
      controller: 'EditCtrl as author'
    });

    $routeProvider.when('/posts/publish/:id', {
      template: require('./author.html'),
      controller: 'PublishCtrl as author'
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
    SessionService.getSessionFull(function (r) {
      $rootScope.session = r;
      $rootScope.$broadcast('sessionUpdated', $rootScope.session);
    }, function(e) {
      $rootScope.session = { authenticated: false };
      $rootScope.$broadcast('sessionUnavailable', $rootScope.session);
    });
  }])


  .controller('IndexCtrl', ['$scope','PostsService', 
      function($scope, PostsService) {
    var self = this;

    $scope.$on('sessionUpdated', (event, session) => {
      PostsService.getMyPosts(function (result) {
        $scope.myposts = result;
      });  
    });

  }])


  .controller('NewCtrl', ['$scope', 'PostsService', '$location', 
      function($scope, PostsService, $location) {
    
    var self = this;

    if ($scope.session && $scope.session.authenticated == false) {
      return window.location = '/v1/auth/login?returnTo=/posts/new';
    }
    else
    {
      $scope.preview = { mode: 'edit' };
      $scope.post = { md: "Save post to start authoring markdown ... ", by: $scope.session };
      
      $scope.$on('sessionUpdated', (event, session) => {
        $scope.post.by = session 
      });

      $scope.$on('sessionUnavailable', (event, session) => {
        window.location = '/v1/auth/login?returnTo=/posts/new';
      });

      $scope.save = () => {
        $scope.post.md = "Type markdown ..."  
        PostsService.create($scope.post, (result) => {
          $location.path('/posts/edit/'+result._id);
        });
      }
    }
  }])

  .controller('EditCtrl', ['$scope', 'PostsService', '$routeParams',
    function($scope, PostsService, $routeParams) {
    
    var self = this;
    $scope.preview = { mode: 'edit' };
  
    PostsService.getById($routeParams.id, (r) => {
      $scope.post = _.extend(r, { saved: true});
    });

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
      PostsService.update($scope.post, (r) => {
        $scope.post = _.extend(r, { saved: true});
      });
    }

  }])


  .controller('PublishCtrl', ['$scope', 'PostsService', '$routeParams',
    function($scope, PostsService, $routeParams) {
    
    var self = this;
    $scope.preview = { mode: 'publish' };
  
    PostsService.getById($routeParams.id, (r) => {
      if (!r.slug) {
        r.slug = r.title.toLowerCase().replace(/ /g, '-');
      }
      if (!r.meta) {
        var ogVideo = null;
        var ogImage = r.assetUrl;
        if (r.assetUrl.indexOf('http://youtub.be/', 0))
        {
          var youTubeId = r.assetUrl.replace('http://youtu.be/','');
          ogImage = `http://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
          ogVideo = `https://www.youtube-nocookie.com/v/${youTubeId}`
        }

        r.meta= { 
          title: r.title,
          canonical: 'http://www.airpair.com/' + r.slug,
          ogTitle: r.title,
          ogImage: ogImage,
          ogVideo: ogVideo,
          ogUrl: 'http://www.airpair.com/' + r.slug
        }        
      }
      $scope.post = _.extend(r, { saved: true});
    });

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
      PostsService.publish($scope.post, (r) => {
        $scope.post = _.extend(r, { saved: true});
      });
    }

  }])

;