angular.module("APPostsDirectives", [])

.directive('apPostListItem', function() {

  return {
    restrict: 'E',
    template: require('./postListItem.html'),
    link(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  }

})

.directive('welcomePostItem', function() {

  return {
    restrict: 'E',
    template: require('./postListItem2.html'),
    link(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  }

})

.directive('bannerPostcomp', function() {
  return { template: require('./bannerPostcomp.html') }
})


.directive('apPost', function(PageHlpr) {

  return {
    template: require('./post.html'),
    controller($scope,  $timeout, DataService) {
      $timeout(function () {
        // Refactor this into a nicer angularjs way
        // console.log('DOM has finished rendering')
        PageHlpr.highlightSyntax();
      }, 100);

    }
  }

})


.factory('mdHelper', function mdHelperFactory() {
  this.headingsChanged = function(md)
  {
    var prevHeadings = headings;
    headings = md.match(/\n##.*/g) || [];

    var changed = prevHeadings.length != headings.length;
    if (!changed)
    {
      for (var i=0;i<headings.length;i++)
      {
        if (prevHeadings[i] != headings[i]) {
          return true;
        }
      }
    }
    return changed;
  }

  return this;
})
