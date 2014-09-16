require('./../directives/share.js');
require('./../directives/postsList.js');
require('./../directives/post.js')
require('./../directives/anchorLink.js');
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

    $routeProvider.when('/posts/author', {
      template: require('./author.html'),
      controller: 'AuthorCtrl as author'
    });
    
    $routeProvider.when('/posts/edit/:id', {
      template: require('./author.html'),
      controller: 'EditCtrl as author'
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
    SessionService.getSessionFull(function (r) {
      $rootScope.session = r;
      $rootScope.$broadcast('sessionUpdated', $rootScope.session);
    });
  }])


  .controller('IndexCtrl', ['$scope','PostsService', 
      function($scope, PostsService) {
    var self = this;
    PostsService.getMyPosts(function (result) {
      $scope.myposts = result;
    });
  }])


  .controller('AuthorCtrl', ['$scope', 'PostsService', '$location', 
      function($scope, PostsService, $location) {
    
    var self = this;
    $scope.preview = {};
    $scope.post = { title: "Type post title ... ", by: {} };
    
    $scope.$on('sessionUpdated', (event, session) => $scope.post.by = session );

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
      PostsService.create($scope.post, (result) => {
        $location.path('/posts/edit/'+result._id);
      });
    }

  }])

  .controller('EditCtrl', ['$scope', 'PostsService', '$routeParams',
    function($scope, PostsService, $routeParams) {
    
    var self = this;
    $scope.preview = {};
  
    PostsService.getById($routeParams.id, (result) => {
      $scope.post = result;
    });

    $scope.save = () => {
      $scope.post.md = angular.element(document.querySelector( '#markdownTextarea' ) ).val(),
      PostsService.update($scope.post, (result) => {
        $scope.post = result
      });
    }

  }])

;