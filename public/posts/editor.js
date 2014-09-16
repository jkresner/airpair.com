var exampleImageUrl = 'http://www.airpair.com/v1/img/css/blog/example2.jpg';
var exampleYoutubeUrl = 'http://youtu.be/qlOAbrvjMBo';

angular.module("APPostEditor", [])

  .directive('apPostEditor', function() {
    
    return {
      template: require('./editor.html'),
      controller: function($scope, PostsService) {  
        
        $scope.$watch('post.assetUrl', function(value) {
          if (!value) 
          { 
            $scope.preview.asset = `<span>Paste an image url or short link to a youtube movie<br /><br />Example<br /> ${exampleYoutubeUrl}<br /> ${exampleImageUrl}</span>`
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

        $scope.exampleImage = function() { $scope.post.assetUrl = exampleImageUrl }
        $scope.exampleYouTube = function() { $scope.post.assetUrl = exampleYoutubeUrl }
      
        var firstRender = true;
        $scope.previewMarkdown = function(md, e) {
          if ($scope.post)
          { 
            if (firstRender) { firstRender = false; } 
            else { $scope.post.saved = false; }
          }

          if (md) 
          { 
            marked(md, function (err, postHtml) {
              if (err) throw err;
              $scope.preview.body = postHtml;
            });

            PostsService.getToc(md, function (tocMd) {
              if (tocMd.toc) 
              { 
                marked(tocMd.toc, function (err, tocHtml) {
                  if (err) throw err;
                  
                  tocHtml = tocHtml.substring(4, tocHtml.length-6)
                  $scope.preview.toc = tocHtml;
                });
              }
            });
          }
        };

        $scope.$watch('post.md', $scope.previewMarkdown);

      }
    };

  });