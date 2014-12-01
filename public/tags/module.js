

angular.module("APPosts", ['ngRoute', 'APFilters','APShare',
  'APMyPostsList','APPostEditor','APPost', 'APBookmarker','APSvcSession', 'APSvcPosts','APTagInput'])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/angularjs', {
      template: require('./angularjs.html'),
      controller: 'IndexCtrl'
    });

  })

  .controller(function($scope, PostsService, SessionService) {

      // self.upcoming = selectByDateRange(data, 0, 9);
      // self.month = selectByDateRange(data, 0, 45);
      // self.past = selectByDateRange(data, -365, 0).reverse();
      // self.featured = _.where(data, function(i) {

  })


;
