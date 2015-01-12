var resolver = require('./helpers.js').resolveHelper;

angular.module("APRoutes", [])

.provider('apRoute', function apRouteProvider($routeProvider) {

  this.route = function(url, controllerName, template, data) {
    var routeDef =_.extend({
      template: template,
      controller: `${controllerName}Ctrl` },
      data || {})

    $routeProvider.when(url, routeDef)
  }

  this.resolver = resolver;

  this.$get = function apRouteFactory() {};

  return this
})

.factory('APIRoute', function apiRouteFactory($http, ServerErrors) {

  var logging = false

  this.GET = (urlFn) =>
    (data, success, error) => {
      var url = '/v1/api'+urlFn(data)
      if (!success) alert('need to pass success for ' + url)
      if (!error) error = (resp) => console.log('error:', resp);
      $http.get(url).success(success).error(error)
    }

  this.POST = (urlFn, successWrapper) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for POST ' + url)
      if (successWrapper) success = successWrapper(success)
      if (!error) error = ServerErrors.add
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('POST.url', url, data)
      $http.post(url, data).success(success).error(error)
    }

  this.PUT = (urlFn, successWrapper) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for PUT ' + url)
      if (successWrapper) success = successWrapper(success)
      if (!error) error = ServerErrors.add
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('PUT.url', url, data)
      $http.put(url, data).success(success).error(error)
    }

  this.DELETE = (urlFn, successWrapper) =>
    (data, success, error) => {
      if (!success) alert('need to pass success for DELETE ' + url)
      if (successWrapper) success = successWrapper(data)(success)
      if (!error) error = ServerErrors.add
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('DELETE.url', url, data)
      $http.delete(url).success(success).error(error)
    }

  return this
})
