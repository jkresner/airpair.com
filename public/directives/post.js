var marked = require('marked');

angular.module("APPost", [])

  .directive('apPost', function() {
    
    return {
      template: require('./post.html'),
      controller: function($scope, PostsService) {  

        $scope.previewMarkdown = function(md) {

          if (!md) {
            md = angular.element(document.querySelector( '#markdownTextarea' ) ).val();
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