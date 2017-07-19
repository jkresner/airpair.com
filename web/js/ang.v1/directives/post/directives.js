angular.module("AirPair.Directives.Post", [])


// .factory('answerSerializer', () => ({
//   answersJSON(form) {
//     var idx = -1
//     return _.map($(form).find('.question'), (elm) => {
//       var $elm = $(elm)
//       idx = idx + 1
//       return { idx,
//         key: $elm.data('key'),
//         prompt: $elm.find('.control-label').text(),
//         answer: $elm.find('.form-control').val()
//       }
//     })
//   }
// }))
.directive('postReviewForm', (API) => ({

  template: require('./reviewForm.html'),
  scope: { post: '=post', data: '=review', userId: '=userId' },
  controller($scope, $element) {
    // var {post, data, userId} = $scope
    // $scope.saved = data ? _.pick(data, 'rating', 'feedback') : false
    // $scope.data = $scope.data || { rating: 3, feedback: '' }

    // $scope.savedCss = (data) => {
    //   return !$scope.saved ||
    //     !(data.rating == $scope.saved.rating && $scope.saved.feedback == data.feedback)
    //     ? 'unsaved' : 'saved'
    // }

    // $scope.save = () => {
    //   var questions = answerSerializer.answersJSON($element)
    //   questions[0].answer = parseInt(questions[0].answer)
    //   API(`/reviews/updatesubmitreview/${post._id}`, {questions}, r => {

    //     post.stats.rating = post.reviews.length == 0 ? r.gave
    //       : (post.stats.rating*post.reviews.length+r.gave)/(post.reviews.length+1)

    //     if (!$scope.saved) {
    //       post.reviews.push(r)
    //       post.stats.reviews += 1
    //     }

    //     $scope.saved = _.pick(r, 'gave', 'said')
    //   })
    // }
  }

}))


// .directive('surveyPost', function(answerSerializer) {

//   return {
//     template: require('./post.html'),
//     scope: true,
//     controller($scope, $element, DataService) {

//       var setScope = (post) => {
//         $scope.$parent.post = post
//         var existing = _.find(post.reviews,(r)=>r.by._id==$scope.session._id)
//         if (existing) {
//           $scope.existing = {
//             rating: existing.questions[0].answer,
//             feedback: existing.questions[1].answer
//           }
//           $scope.data = {
//             _id: existing._id,
//             rating: existing.questions[0].answer,
//             feedback: existing.questions[1].answer }
//         } else
//           $scope.data = { rating: 3, feedback: '' }

//         $scope.unsaved = (data, existing) => {
//           return !existing ||
//             !(existing.rating == data.rating && existing.feedback == data.feedback)
//         }
//       }
//       setScope($scope.post)

//       $scope.show = $scope.post.by.userId != $scope.session._id

//       $scope.submitReview = (formValid) => {
//         if (formValid)
//         {
//           var review = { postId: $scope.post._id,
//             questions: answerSerializer.getAnswersJSON($element) }

//           if (!$scope.data._id)
//             return DataService.posts.review(review, setScope)

//           review._id = $scope.data._id
//           DataService.posts.reviewUpdate(review, setScope)
//         }
//       }
//     }
//   }

// })



.directive('postStats', () => ({
  template: require('./stats.html')
}))


.directive('postGit', () => ({
  template: require('./git.html')
}))



.directive('postReviews', () => ({

  template: require('./reviews.html'),
  scope: { post: '=post' },
  controller($scope, $rootScope, $attrs) {
    $scope.session = $rootScope.session
    // console.log('postReviews', $scope)
    $scope.reviews = $scope.post.reviews
    // $scope.by = {userId:$attrs.byid}
  }

}))

.directive('postReview', function() {
  return {
    template: require('./review.html'),
    scope: { postId: '=postId', r: '=review' },
    controller($rootScope, $scope, API) {
      var {session} = $rootScope
      var {postId} = $scope
      // $scope.canVote = ({byId,votes}) =>
        // byId != session._id && _.find(votes, v => v.by._id==session._id) == null

      // $scope.upVote = (_id) => {}
        // DataService.posts.reviewUpvote({postId,_id}, $scope.setScope)

      // $scope.reply = (_id, comment) => {}
        // DataService.posts.reviewReply({postId,_id,comment}, $scope.setScope)

      // $scope.toggleReply = x => $scope.replyOpen = !$scope.replyOpen

      // $scope.deleteReview = (_id) =>
        // DataService.posts.reviewDelete({postId,_id}, $scope.setScope)
    }
  }
})

// .directive('postComments', function(PostsUtil) {
//   return {
//     template: require('./post/comments.html'),
//     scope: true,
//     controller($scope, $rootScope, $element, DataService) {

//       $scope.setScope = (post) => {
//         var post = PostsUtil.extendWithReviewsSummary(post)
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


.directive('postTile', () => ({

  template: require('./tile.html'),
  link(scope, element, attrs) {
    if (attrs.post)
      scope.post = scope.$eval(attrs.post)
  },
  controller($scope) { }

}))

