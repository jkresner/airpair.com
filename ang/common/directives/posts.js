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


.directive('postTile', function() {

  return {
    restrict: 'E',
    template: require('./postTile.html'),
    link(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  }

})


.directive('bannerPostcomp', function() {
  return { template: require('./bannerPostcomp.html') }
})


.directive('postReviews', () => {
  return {
    template: require('./../../posts/reviews.html'),
    scope: { reviews: '=reviews' },
    controller($scope, $rootScope, $element, $attrs) {
      $scope.session = $rootScope.session
      if ($scope.$parent.post && $scope.$parent.post.by)
        $scope.post = $scope.$parent.post
      else
        $scope.post = _.extend($rootScope.post, {
          reviews:$scope.reviews,by:{userId:$attrs.byid} })
    }
  }
})

.directive('postRailStars', (PostsUtil) => {
  return {
    template: require('./../../posts/railstars.html'),
    scope: true,
    controller($scope, $rootScope) {
      var setScope = (reviews) => {
        if (!reviews) return
        $scope.notReviewed = _.find(reviews,(r)=>r.by._id==$rootScope.session._id) == null
        $scope.count = reviews.length
      }
      $rootScope.$watch('postReviews', setScope)
    }
  }
})

.directive('postComments', function(PostsUtil) {
  return {
    template: require('./../../posts/comments.html'),
    scope: true,
    controller($scope, $rootScope, $element, DataService) {
      var postId = $scope.post._id

      var setScope = (post) => {
        var post = PostsUtil.extendWithReviewsSummary(post)
        $rootScope.postReviews = post.reviews
        $scope.reviews = post.reviews
        $rootScope.starsAvg = post.stars.avg
        $scope.stars = { avg: post.stars.avg }
      }

      setScope($scope.post)

      $scope.canVote = (review) =>
        review.by._id != $scope.session._id &&
        _.find(review.votes,(v)=>v.by._id==$scope.session._id) == null

      $scope.upVote = (_id) =>
        DataService.posts.reviewUpvote({postId,_id}, setScope)

      $scope.$parent.$watch('post', setScope)

      $scope.openReply = (_id) =>
        alert('Replies coming soon ;)')
    }
  }
})

.directive('stars', function() {

  return {
    template: require('./stars.html'),
    scope: { stars: '=val' },
    controller($scope, $element) {

    }
  }

})



.directive('apPost', function(PageHlpr) {

  return {
    template: require('./post.html'),
    controller($scope, $timeout, DataService) {
      $scope.$watch('preview.body', () =>{
        $timeout(function() {
          PageHlpr.highlightSyntax();
        }, 10)
      })
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
