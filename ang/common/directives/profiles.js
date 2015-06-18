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

        if (!$scope.data.username && $scope.session.social) {
          var social = $scope.session.social
          if (social.gh || social.tw)
          {
            var username = social.gh.username || social.tw.username
            SessionService.updateUsername({username}, function(result){
              $scope.data.username = username
            }, function(e){})
          }
        }
      })

      // $scope.updateBio = () => updateInfo('Bio')
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
        if (session.social) {
          if (session.social.gh) $scope.data.gh = session.social.gh.username
          if (session.social.tw) $scope.data.tw = session.social.tw.username
          if (session.social.so) $scope.data.so = session.social.so.link
          if (session.social.in) $scope.data.in = session.social.in.id
          if (session.social.bb) $scope.data.bb = session.social.bb.username
          if (session.social.al) $scope.data.al = session.social.al.username
          if (session.social.gp) $scope.data.gp = session.social.gp.link
        }
      })

    }
  };

})
