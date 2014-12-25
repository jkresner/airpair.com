var util = require('../../../shared/util.js');

var tmpls = {
  received: {
    subject: require('../../../shared/mail/pipelinereceived_subject.html'),
    text: require('../../../shared/mail/pipelinereceived_text.html')
  }
}

angular.module("APMailTemplates", [])

.directive('mailLink', function($compile, $timeout) {

  return {
    template: require('./mailtemplatesLink.html'),
    scope: {
      r: '=req',
      to: '=to',
      meta: '=meta',
      templateName: '=name',
      sendCallback: '=sendCallback'
    },
    link(scope, element, attrs) {
      var type = scope.$eval(attrs.name)
      scope.subject = tmpls[type].subject
      scope.body = tmpls[type].text
    },
    controller($scope, $rootScope, $element) {
      if (!$scope.sendCallback) $scope.sendCallback = () => {}

      $scope.$watch('meta.noPaymethod', function() {
        if (!$scope.r || !$scope.r.by) return

        $scope.tagsString = util.tagsString($scope.r.tags)
        $scope.firstName = util.firstName($scope.r.by.name)
        $scope.accountManager = {
          firstName: util.firstName($rootScope.session.name),
          name: $rootScope.session.name
        }

        $element.find('b').html(
          $compile('<span>'+$scope.subject+'</span>')($scope).contents())

        $element.find('pre').html(
          $compile('<div>'+$scope.body+'</div>')($scope).contents())
        $timeout(()=>$scope.message = $element.find('pre').text(),100)
      })

    }
  };
})

