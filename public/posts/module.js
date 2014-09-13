require('./../directives/share.js');
require('./../common/filters.js');

var marked = require('marked')

angular.module("APPosts", ['ngRoute','APFilters','APShare'])

  .constant('API', '/v1/api')

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

  }])

  .run(['$rootScope', function($rootScope) {
  }])

  .controller('IndexCtrl', ['$scope', '$http', 'API', function($scope, $http, API) {
    var self = this;
    console.log('indexCrtl')
  }])

  .controller('AuthorCtrl', ['$scope', '$http', 'API', function($scope, $http, API) {
    var self = this;
    
    $scope.title = "Type post title"; 

    $scope.$watch('markdown', function(value) {
      if (value) 
      { 
        marked(value, function (err, content) {
          if (err) throw err;
          $scope.preview = content;
        });

        $http.post(API+'/posts-toc', { md: value } ).success(function (value) {
          console.log('got toc', value.toc)
          if (value.toc) 
          { 
            marked(value.toc, function (err, content) {
              if (err) throw err;
              $scope.previewTOC = content;
            });
          }
        });              
      }
    });

    
  }])

;