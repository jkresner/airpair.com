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
  }])

  .controller('AuthorCtrl', ['$scope', '$http', 'API', function($scope, $http, API) {
    var self = this;
    
    $scope.title = "Type post title ... "; 

    $scope.previewMarkdown = function(value) {
      if (!value) {
        value = angular.element(document.querySelector( '#markdownTextarea' ) ).val();
      }
      if (value) 
      { 
        marked(value, function (err, postHtml) {
          if (err) throw err;
          $scope.preview = postHtml;
        });

        $http.post(API+'/posts-toc', { md: value } ).success(function (tocMd) {
          if (tocMd.toc) 
          { 
            marked(tocMd.toc, function (err, tocHtml) {
              if (err) throw err;
              
              tocHtml = tocHtml.substring(4, tocHtml.length-6)
              $scope.previewTOC = tocHtml;
            });
          }
        });
      }
    };

    $scope.$watch('markdown', $scope.previewMarkdown);    

    $scope.$watch('assetUrl', function(value) {
      if (!value) 
      { 
        $scope.previewAsset = "Paste an image url or short link to a youtube movie<br /><br />E.g. http://youtu.be/qlOAbrvjMBo<br /><br />/v1/img/css/blog/example1.jpg"
      }
      else if (value.indexOf('http://youtu.be/') == 0) {
        var youTubeId = value.replace('http://youtu.be/', '');
        $scope.previewAsset = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
      } 
      else 
      {
        $scope.previewAsset = `<img src="${value}" />`;
      }
    });        
  }])

;