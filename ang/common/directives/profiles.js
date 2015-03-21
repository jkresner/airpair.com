angular.module("APProfileDirectives", [])

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
      console.log('$scope.p', $scope.p)
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
        if (session.emailVerified && session.social) {
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
