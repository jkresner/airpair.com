var feautredSlugs = [
  'fast-mvp-with-angularfire',
  'learn-meteorjs-1.0',
  'learn-git-and-github',
  'publishing-at-the-speed-of-ruby',
  'visualization-with-d3js',
  'transitioning-to-consulting-for-developers'
];

var selectByDateRange = function(list, daysAgo, daysUntil)
{
  var start = moment(new Date()).add(daysAgo, 'days');
  var end = moment(new Date()).add(daysUntil, 'days');
  return _.where(list,function(i) {
    return moment(i.time).isAfter(start) && moment(i.time).isBefore(end);
  });
}

angular.module("APWorkshops", ['ngRoute','APFilters','APShare'])

  .constant('API', '/v1/api')

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/workshops/subscribe', {
      template: require('./subscribe.html')
    });

    $routeProvider.when('/workshops/signup/:id', {
      template: require('./signup.html'),
      controller: 'WorkshopSignupCtrl as signup'
    });

    $routeProvider.when('/workshops/signup-confirmed/:id', {
      template: require('./signupconfirmed.html'),
      controller: 'WorkshopSignupConfirmedCtrl'
    });

  })


  .run(function($rootScope) {
    $rootScope.timeZoneOffset = moment().format('ZZ');
  })


  .controller('WorkshopsCtrl', function($scope, $http, API) {
    var self = this;
    var upcomingStart = moment(new Date());
    var upcomingEnd = moment(new Date()).add(14, 'days');
    $http.get(API+'/workshops').success(function (data) {
      self.entries = data;
      self.upcoming = selectByDateRange(data, 0, 9);
      self.month = selectByDateRange(data, 0, 45);
      self.past = selectByDateRange(data, -365, 0).reverse();
      self.featured = _.where(data, function(i) {
       return _.contains(feautredSlugs, i.slug);
      });
    });
  })


  .controller('WorkshopSignupCtrl', function($scope, $http, $routeParams, API) {

    $scope.hasAccess = true;

    $http.get(API+'/workshops/'+$routeParams.id).success(function (data) {
      $scope.entry = data;
    });
  })

  .controller('WorkshopSignupConfirmedCtrl', function($scope, $http, $routeParams, $location, API) {

    $scope.later = false
    if ($location.search().later)
    {
      $scope.later = true
    }

    console.log('signup confirmed')

    $http.get(API+'/workshops/'+$routeParams.id).success(function (data) {
      $scope.entry = data;
    });

  })

;
