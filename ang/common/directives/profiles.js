angular.module("APProfileDirectives", [])

.directive('userInfo', function() {

  return {
    restrict: 'E',
    template: require('./userInfo.html'),
    controller($rootScope, $scope, $location, ServerErrors, SessionService) {

      var updateInfo = function(targetName) {
        $scope.profileAlerts = []
        var propName = targetName.toLowerCase()
        if ($scope.data[propName] && $scope.data[propName] != '' &&
            $scope.session[propName] != $scope.data[propName])
        {
          var up = {}
          up[propName] = $scope.data[propName]
          SessionService[`update${targetName}`](up, function(result){
            $scope.profileAlerts.push({ type: 'success', msg: `${targetName} updated` })
          }, function(e){
            $scope.data.username = $scope.session.username
            $scope.profileAlerts.push({ type: 'danger', msg: e.message })
          })
        }
      }

      $rootScope.$watch('session', (session) => {
        $scope.data = _.extend($scope.data||{},_.pick(session, 'name','email','initials','username','bio'))
        if (session.localization)
        {
          $scope.data.location = session.localization.location
          $scope.data.timezone = session.localization.timezone
        }

        if (!$scope.data.username && $scope.session.auth) {
          var social = $scope.session.auth
          if (social.gh && social.gh.login || social.gh.username)
          {
            var username = social.gh.login || social.gh.username
            SessionService.updateUsername({username}, function(result){
              $scope.data.username = username
            }, function(e){})
          }
        }
      })

      $scope.updateName = () => updateInfo('Name')
      $scope.updateInitials = () => updateInfo('Initials')
      $scope.updateUsername = () => updateInfo('Username')

      $scope.updateLocation = (locationData) => {
        SessionService.changeLocationTimezone(locationData, (r)=> {})
      }
    }
  }

})

.directive('socialLinks', function() {

  return {
    template: require('./socialLinks.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) {
      $scope.$watch('p', ()=>{
        if (!$scope.p) return
        if ($scope.p.so)
          $scope.p.so.link =
            $scope.p.so.link.replace('http://stackoverflow.com/users/','')
      })
    }
  };

})


.directive('socialScores', function() {

  return {
    template: require('./socialScores.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) {
    }
  };

})


.directive('socialConnect', function($rootScope, $location) {

  return {
    template: require('./socialConnect.html'),
    scope: {
      returnTo: '=returnTo',
    },
    controller($scope, $attrs) {
      $scope.data = {}
      $scope.return = $scope.returnTo || $location.path()

      $rootScope.$watch('session', (session) => {
        if (session.auth) {
          if (session.auth.gh) $scope.data.gh = session.auth.gh.login
          if (session.auth.tw) $scope.data.tw = session.auth.tw.screen_name
          if (session.auth.so) $scope.data.so = session.auth.so.link
          if (session.auth.in) $scope.data.in = session.auth.in.id
          if (session.auth.bb) $scope.data.bb = session.auth.bb.username
          if (session.auth.gp) $scope.data.gp =
            session.auth.gp.link || session.auth.gp.url || session.auth.gp.id
          if (session.auth.al) $scope.data.al =
            session.auth.al.username || session.auth.al.angellist_url
        }
      })

    }
  };

})
