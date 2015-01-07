angular.module("APRoutes", [])

.provider('apRoute', function apRouteProvider($routeProvider) {

  this.route = function(url, controllerName, template, data) {
    var routeDef =_.extend({
      template: template,
      controller: `${controllerName}Ctrl` },
      data || {})

    $routeProvider.when(url, routeDef)
  }

  this.$get = function apRouteFactory() {};

  return this
})

.factory('APIRoute', function apiRouteFactory($http, ServerErrors) {

  var logging = true

  this.GET = (urlFn) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for ' + url)
      if (!error) error = (resp) => console.log('error:', resp);
      $http.get('/v1/api'+urlFn(data)).success(success).error(error)
    }

  this.PUT = (urlFn) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for ' + url)
      if (!error) error = ServerErrors.add
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('PUT.url', url, data)
      $http.put(url, data).success(success).error(error)
    }

  this.POST = (urlFn) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for ' + url)
      if (!error) error = ServerErrors.add
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('POST.url', url, data)
      $http.post(url, data).success(success).error(error)
    }

  return this
})
