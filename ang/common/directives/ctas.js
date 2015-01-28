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
          scope.updateFailed = e.message || e.error || e
          scope.data.email = null
          if (scope.updateFailed.indexOf("already") != -1)
            scope.updateFailed += ". Try <a href='/v1/auth/login'>LOGIN instead?</a>"
        }
      )
    }

    this.submit = function(scope, singuptype, formValid, data, success) {
      console.log('singuptype', singuptype)
      if (formValid)
        SessionService[singuptype](scope.data,
          (result) => $timeout(success, 200),
          (e) => {
            $scope.updateFailed = e.message || e.error || e
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
      link(scope, element) {
        scope.focusInputAttention = function(elem) {
          angular.element('body').addClass('attentionfocus')
        }
        scope.blurInputAttention = function(elem) {
          angular.element('body').removeClass('attentionfocus')
        }
      },
      controller($scope, $element, $attrs) {

        SessionService.onAuthenticated( (s) => $scope.data = { email: s.email, name: s.name } )

        $scope.updateEmail = (model) => CtaHelper.updateEmail($scope, model,
          () => { angular.element('#postSubscribeName').focus(); })

        $scope.submit = (formValid, data) => CtaHelper.submit($scope, 'subscribe', formValid, data,
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
          () => { angular.element('#homeJoinName').focus() })

        $scope.submit = (formValid, data) => CtaHelper.submit($scope, 'homeSignup', formValid, data,
          () => { window.location = '/meet-experts' })
      }
    };

  })


  .directive('ctaRequestSignup', function(SessionService, CtaHelper) {
    return {
      template: require('./ctaRequestSignup.html'),
      controller($scope) {

        SessionService.onAuthenticated( (s) => $scope.data = { email: s.email, name: s.name } )

        $scope.updateEmail = (model) => CtaHelper.updateEmail($scope, model,
          () => { angular.element('#requestSignupName').focus() })

        $scope.submit = (formValid, data) => CtaHelper.submit($scope, 'homeSignup', formValid, data,
          () => { })
      }
    };

  })

  .directive('ctaSowelcome', function(SessionService, StaticDataService, CtaHelper) {
    return {
      template: require('./ctaSOWelcome.html'),
      controller($scope) {

        var validSO201501Slugs = [
          'ruby-on-rails',
          'python',
          'angularjs',
          'ios',
          'android',
          'ember.js',
          'node.js'
        ]

        if (validSO201501Slugs.indexOf($scope.tag.slug) == -1)
          return window.location = '/help/request'

        var setScope = (s) => {
          var tags = $scope.session.tags
          var bookmarks = $scope.session.bookmarks
          $scope.data = {
            hasTag: tags != null && tags.length > 0,
            hasBookmark: bookmarks != null && bookmarks.length > 0,
          }
          $scope.posts = StaticDataService.getWelcomePosts($scope.tag.slug)
        }

        SessionService.onAuthenticated(setScope)

        $scope.addTag = (tag) =>
          SessionService.updateTag(tag, setScope, (e) => alert(e.message))


        $scope.addBookmark = (post) =>
          SessionService.updateBookmark({type:'post',objectId:post._id}, setScope, (e) => alert(e.message))


        // $scope.updateEmail = (model) => CtaHelper.updateEmail($scope, model,
        //   () => { angular.element('#requestSignupName').focus() })

        // $scope.submit = (formValid, data) => CtaHelper.submit($scope, 'homeSignup', formValid, data,
        //   () => { })

      }
    };

  })

