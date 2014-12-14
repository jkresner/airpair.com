angular.module("APCTAs", ['ngMessages','APAnalytics'])

  .directive('ctaPostSubscribe', function($timeout, SessionService) {
    return {
      template: require('./ctaPostSubscribe.html'),
      scope: {
        tagName: '=tagName',
        tagSlug: '=tagSlug'
      },
      link(scope, element) { },
      controller($scope, $element, $attrs) {

        SessionService.onAuthenticated( (session) =>
          $scope.data = { email: session.email, name: session.name }
        )

        $scope.updateEmail = function(model) {
          if (!model.$valid) return
          $scope.updateFailed = ""

          SessionService.changeEmail({ email: $scope.data.email },
            (result) => {
              $scope.data.email = result.email
              $timeout(() => { angular.element('#postSubscribeName').focus(); }, 200)
            }
            , (e) => {
              $scope.updateFailed = e.message || e.error
              $scope.data.email = null
              if ($scope.updateFailed.indexOf("already") != -1)
                $scope.updateFailed += ". Try <a href='/v1/auth/login'>LOGIN instead?</a>"
            }
          )
        }

        $scope.submit = function(formValid, data) {
          if (formValid)
            SessionService.subscribe($scope.data,
              (result) => {},
              (e) => {
                $scope.updateFailed = e.message || e.error
                if ($scope.updateFailed.indexOf("already") != -1)
                  $scope.updateFailed += ". Try <a href='/v1/auth/login'>LOGIN instead?</a>"
              }
            )
        }

      }
    };

  });
