angular.module("AirPair.Post", [])




// .directive('postRailStars', () => {
//   return {
//     template: require('./railstars.html'),
//     scope: true,
//     controller($scope, $rootScope) {
//       var setScope = (reviews) => {
//         if (!reviews) return
//         $scope.notReviewed = _.find(reviews,(r)=>r.by._id==$rootScope.session._id) == null
//         $scope.count = reviews.length
//       }
//       $rootScope.$watch('postReviews', setScope)
//     }
//   }
// })


// .directive('postCommentsHeader', function() {
//   return {
//     template: require('./commentsHeader.html'),
//   }
// })

// .directive('postCommentsReviewThread', function() {
//   return {
//     template: require('./commentsReviewThread.html'),
//     scope: true,
//     controller($scope, $rootScope, $element, DataService) {
//       var postId = $scope.post._id
//       $scope.canVote = (review) =>
//         review.by._id != $scope.session._id &&
//         _.find(review.votes,(v)=>v.by._id==$scope.session._id) == null

//       $scope.upVote = (_id) =>
//         DataService.posts.reviewUpvote({postId,_id}, $scope.setScope)

//       $scope.sendReply = (_id, comment) =>
//         DataService.posts.reviewReply({postId,_id,comment}, $scope.setScope)

//       $scope.toggleReply = (_id) =>
//         $scope.replyOpen = ($scope.replyOpen) ? false : true

//       $scope.deleteReview = (_id) =>
//         DataService.posts.reviewDelete({postId,_id}, $scope.setScope)
//     }
//   }
// })

// .directive('postComments', function() {
//   return {
//     template: require('./comments.html'),
//     scope: true,
//     controller($scope, $rootScope, $element, DataService) {

//       function extendWithReviewsSummary(p) {
//         p.stars = { total: 0 }
//         p.reviews.forEach(r => p.stars.total += parseInt(r.val))
//         p.stars.avg = p.stars.total/p.reviews.length
//         return p
//       }


//       $scope.setScope = (post) => {
//         var post = extendWithReviewsSummary(post)
//         $rootScope.postReviews = post.reviews
//         $scope.reviews = post.reviews
//         $rootScope.starsAvg = post.stars.avg
//         $scope.stars = { avg: post.stars.avg }
//         $scope.isEditor = ($scope.session.roles)
//           ? _.find($scope.session.roles,(role)=>role=='admin'||role=='editor')!=null
//           : false
//       }
//       $scope.setScope($scope.post)

//       $scope.$parent.$watch('post', $scope.setScope)
//     }
//   }
// })


// .controller('posts:activity', ($scope, $routeParams, API, PAGE) => {

//   var _id = $routeParams.id
//   $scope.ui = { review: { editing: false } }
//   $scope.data = {}

//   API(`/posts/activity/${_id}`, PAGE.main($scope).setData(r, ({post}) => {
////     $scope.data.review = _.find(post.reviews, rev => rev.by._id == $scope.session._id)
////     $scope.data.fork = _.find(post.forkers, f => f.userId == $scope.session._id)
////     $scope.ui.review.editing = !$scope.data.review
//   }))

// })


// .controller('posts:recent', ($scope, $routeParams, API, $postsUtil) => {
//   API(`/posts/recent`, PAGE.main($scope).setData)
// })

// .when('/activity/tag/:slug', route('tag', require('./listTag.html'))
// .controller('activity:tag', ($scope, $routeParams, $location, API) => {
  // if ($routeParams.tagslug)
  //   $scope.tagslug = $routeParams.tagslug
  // else
  //   $scope.tagslug = $location.url().replace('/','')
  // API(`/posts/tagged/{slug}`, (r) => {
  //   $scope.tag = result.tag;
  //   $scope.tagposts = result.posts;
  // })
// })


