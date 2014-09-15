angular.module("APPostEditor", [])

  .directive('apPostEditor', function() {
    
    return {
      template: require('./editor.html'),
      controller: function($scope) {  
        $scope.$watch('post.assetUrl', function(value) {
          if (!value) 
          { 
            $scope.preview.asset = "Paste an image url or short link to a youtube movie<br /><br />E.g. http://youtu.be/qlOAbrvjMBo<br /><br />/v1/img/css/blog/example1.jpg"
          }
          else if (value.indexOf('http://youtu.be/') == 0) {
            var youTubeId = value.replace('http://youtu.be/', '');
            $scope.preview.asset = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
          } 
          else 
          {
            $scope.preview.asset = `<img src="${value}" />`;
          }
        });
      }
    };

  });