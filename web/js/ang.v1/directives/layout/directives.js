angular.module("AirPair.Directives.Layout", [])

.directive('noCompile', function() {

  return {

    terminal: true,

    controller : function() {
      // console.log('noCompile')
    }
  };

})

.directive('errorsHeader', () => ({

  template: require('./errorsHeader.html'),
  controller($rootScope, $scope, ERR) {
    $scope.clear = ERR.clear
    $rootScope.$on('$routeChangeSuccess', ERR.clear)
  }

}))


.directive('loader', () => ({

  template: require('./loading.html'),
  scope: { show: '=show' },
  controller($rootScope, $scope, $element) {
    $element.addClass('loader', true)
    // $element.toggleClass('loading', $scope.show)

    // console.log('loader.prewatch', $scope.show)
    $scope.$watch('show', show =>  {
      // console.log('loader.show.watch', show, $scope.show)
      $element.toggleClass('loading', $scope.show)
    })

    // $rootScope.$on('$routeChangeSuccess',
      // () => $rootScope.ui.main.loading = true )
  }

}))
