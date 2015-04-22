var tmpls = {
  received: {
    subject: require('../../../shared/mail/pipelinereceived_subject.html'),
    text: require('../../../shared/mail/pipelinereceived_text.html')
  },
  review: {
    subject: require('../../../shared/mail/pipelinereview_subject.html'),
    text: require('../../../shared/mail/pipelinereview_text.html')
  },
  cancelfromwaiting: {
    subject: require('../../../shared/mail/pipelinecancelfromwaiting_subject.html'),
    text: require('../../../shared/mail/pipelinecancelfromwaiting_text.html')
  },
  generic: {
    subject: require('../../../shared/mail/pipelinegeneric_subject.html'),
    text: require('../../../shared/mail/pipelinegeneric_text.html')
  }
}

angular.module("APMailTemplates", [])

.directive('mailLink', function($compile, $timeout, Util) {

  return {
    template: require('./mailtemplatesLink.html'),
    scope: {
      r: '=req',
      to: '=to',
      meta: '=meta',
      templateName: '=name',
      sendCallback: '=sendCallback'
    },
    controller($scope, $rootScope, $element, $attrs) {
      var type = $scope.$eval($attrs.name)

      $scope.send = () =>
        $scope.$parent.send($scope.subject, $scope.message, type)

      $scope.$watch('meta.noPaymethod', function() {
        if (!$scope.r || !$scope.r.by) return

        $scope.tagsString = Util.tagsString($scope.r.tags)
        $scope.firstName = Util.firstName($scope.r.by.name)
        $scope.accountManager = {
          firstName: Util.firstName($rootScope.session.name),
          name: $rootScope.session.name
        }

        $element.find('code').html(
          $compile('<span>'+tmpls[type].subject+'</span>')($scope).contents())

        $element.find('pre').html(
          $compile('<div>'+tmpls[type].text+'</div>')($scope).contents())

        $timeout(()=>$scope.message = $element.find('pre').text(),100)
        $timeout(()=>$scope.subject = $element.find('code').text(),100)
      })

    }
  };
})

