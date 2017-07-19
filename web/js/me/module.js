angular.module("AirPair.Author.Me", [])


.config($routeProvider => {

  var list = { template: require('./home.html'), controller: 'me:home' }
  $routeProvider
    .when('/', list)
    .when('/home', list)
    .when('/forks', { template: require('./forks.html'), controller: 'me:forks' })
    .when('/drafts', { template: require('./drafts.html'), controller: 'me:drafts' })
    .when('/published', { template: require('./published.html'), controller: 'me:published' })
    .when('/profile', { template: require('./profile.html'), controller: 'me:profile' })
})


.controller('me:home', function($scope, $location, API, PAGE, UTIL) {
  PAGE.ERR.checkQuerystring()
  $scope.status = UTIL.post.status
  API('/me/home', PAGE.main($scope).setData)
})


.controller('me:drafts', function($scope, $location, API, PAGE, UTIL) {
  PAGE.ERR.checkQuerystring()
  $scope.status = UTIL.post.status
  API('/me/drafts', PAGE.main($scope).setData)
})


.controller('me:published', function($scope, $location, API, PAGE, UTIL) {
  PAGE.ERR.checkQuerystring()
  $scope.status = UTIL.post.status
  API('/me/published', PAGE.main($scope).setData)
})

.controller('me:forks', function($scope, $location, API, PAGE, UTIL) {
  $scope.status = UTIL.post.status
  API('/me/forks', PAGE.main($scope).setData)
})


.controller('me:profile', ($scope, API, PAGE) => {
  API(`/me/profile`, PAGE.main($scope).setData)
})
