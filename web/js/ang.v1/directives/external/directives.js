angular.module("AirPair.Directives.External", [])

.directive('youtubeEmbed', ($sce) => ({

  restrict: 'A',
  scope: {
    v:'=v',
    w:'=width',
    h:'=height'
  },
  template: '<iframe width="{{w}}" height="{{h}}" ng-src="{{url}}" frameborder="0" allowfullscreen></iframe>',
  controller($scope) {
    $scope.w = $scope.w || 640
    $scope.h = $scope.h || 360
    $scope.url = $sce.trustAsResourceUrl('https://www.youtube-nocookie.com/embed/'+$scope.v)
  }

}))

