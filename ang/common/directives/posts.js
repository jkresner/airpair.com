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


.directive('postReviews', () => {
  return {
    template: require('./../../posts/reviews.html'),
    scope: { reviews: '=reviews' },
    controller($scope, $rootScope, $element, $attrs) {
      $scope.session = $rootScope.session
      $scope.post = _.extend($rootScope.post, {
        reviews:$scope.reviews,by:{userId:$attrs.byid} })
    }
  }
})


.directive('postComments', function() {

  return {
    template: require('./../../posts/comments.html'),
    scope: true,
    controller($scope, $element, DataService) {
      var postId = $scope.post._id

      var setScope = (post) => {
        var reviews = post.reviews
        var starsTotal = 0
        $scope.reviews = _.map(reviews, (r) => {
          r.rating = _.find(r.questions,(q)=>q.key == 'rating').answer
          r.feedback = _.find(r.questions,(q)=>q.key == 'feedback').answer
          starsTotal += parseInt(r.rating)
          return r
        })
        if (starsTotal > 0) {
          $scope.starsAvg = starsTotal/$scope.reviews.length
        }
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
