angular.module("APCTAs", ['ngMessages','APAnalytics'])

  .factory('CtaHelper', function CtaHelperFactory($rootScope, $timeout, $location, SessionService) {

    this.updateEmail = function(scope, model, success) {
      if (!model.$valid) return
      scope.updateFailed = ""

      SessionService.changeEmail({ email: scope.data.email },
        (result) => {
          scope.data.email = result.email
          scope.session = result
          $timeout(success, 200)
        }
        , (e) => {
          scope.updateFailed = e.message || e.error
          scope.data.email = null
          if (scope.updateFailed.indexOf("already") != -1)
            scope.updateFailed += ". Try <a href='/v1/auth/login'>LOGIN instead?</a>"
        }
      )
    }

    this.submit = function(scope, formValid, data, success) {
      if (formValid)
        SessionService.subscribe(scope.data,
          (result) => $timeout(success, 200),
          (e) => {
            $scope.updateFailed = e.message || e.error
            if ($scope.updateFailed.indexOf("already") != -1)
              $scope.updateFailed += ". Try <a href='/v1/auth/login'>LOGIN instead?</a>"
          }
        )
    }

    return this;
  })

  .directive('ctaPostSubscribe', function(SessionService, CtaHelper) {
    return {
      template: require('./ctaPostSubscribe.html'),
      scope: {
        tagName: '=tagName',
        tagSlug: '=tagSlug'
      },
      controller($scope, $element, $attrs) {

        SessionService.onAuthenticated( (s) => $scope.data = { email: s.email, name: s.name } )

        $scope.updateEmail = (model) => CtaHelper.updateEmail($scope, model,
          () => { angular.element('#postSubscribeName').focus(); })

        $scope.submit = (formValid, data) => CtaHelper.submit($scope, formValid, data,
          () => {})
      }
    };
  })

  .directive('ctaHomeJoin', function(SessionService, CtaHelper) {
    return {
      template: require('./ctaHomeJoin.html'),
      controller($scope) {

        SessionService.onAuthenticated( (s) => $scope.data = { email: s.email, name: s.name } )

        $scope.updateEmail = (model) => CtaHelper.updateEmail($scope, model,
          () => { angular.element('#teamJoinName').focus() })

        $scope.submit = (formValid, data) => CtaHelper.submit($scope, formValid, data,
          () => { window.location = '/meet-experts' })
      }
    };

  });
