angular.module("APSurveyDirectives", [])


.factory('answerSerializer', function answerSerializerFactory() {
  this.getAnswersJSON = function(form)
  {
    var idx = -1
    return _.map($(form).find('.question'), (elm) => {
      var $q = $(elm)
      idx = idx + 1
      return {
        idx,
        key: $q.data('key'),
        prompt: $q.find('.control-label').text(),
        answer: $q.find('.form-control').val()
      }
    })
  }

  return this;
})


.directive('surveyPost', function(answerSerializer) {

  return {
    template: require('./post.html'),
    scope: true,
    controller($scope, $element, DataService) {

      var setScope = (post) => {
        $scope.$parent.post = post
        var existing = _.find(post.reviews,(r)=>r.by._id==$scope.session._id)
        if (existing) {
          $scope.existing = {
            rating: existing.questions[0].answer,
            feedback: existing.questions[1].answer
          }
          $scope.data = {
            _id: existing._id,
            rating: existing.questions[0].answer,
            feedback: existing.questions[1].answer }
        } else
          $scope.data = { rating: 3, feedback: '' }
      }
      setScope($scope.post)

      $scope.show = $scope.post.by.userId != $scope.session._id

      $scope.submitReview = (formValid) => {
        if (formValid)
        {
          var review = { postId: $scope.post._id,
            questions: answerSerializer.getAnswersJSON($element) }

          if (!$scope.data._id)
            return DataService.posts.review(review, setScope)

          review._id = $scope.data._id
          DataService.posts.reviewUpdate(review, setScope)
        }
      }
    }
  }

})
