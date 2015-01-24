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

  var trackSave = (trackData) => {
    trackData.location = window.location.pathname // $location.path() no good...
    // console.log('trackData', trackData)
    analytics.track('Save', trackData)
  }

  this.GET = (urlFn) =>
    (data, success, error) => {
      var url = '/v1/api'+urlFn(data)
      if (!error) error = (resp) => console.log('error:', resp);
      if (!success) alert('need to pass success for ' + url)
      $http.get(url).success(success).error(error)
    }

  this.POST = (urlFn, successWrapper, trackDataFn) =>
    (data, success, error) => {
      if (!error) error = ServerErrors.add
      if (!success) alert('need to pass success for POST ' + url)
      if (successWrapper) var successWarp = successWrapper(success)
      if (trackDataFn)
        var successTrack = (r) => {
          trackSave(trackDataFn(data))
          if (successWrapper) successWrapper(r)
          else success(r)
        }
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('POST.url', url, data)
      $http.post(url, data).success(successTrack||successWarp||success).error(error)
    }

  this.PUT = (urlFn, successWrapper, trackDataFn) =>
    (data, success, error) => {
      if (!error) error = ServerErrors.add
      if (!success) alert('need to pass success for PUT ' + url)
      if (successWrapper) var successWarp = successWrapper(success)
      if (trackDataFn)
        var successTrack = (r) => {
          trackSave(trackDataFn(data))
          if (successWrapper) successWrapper(r)
          else success(r)
        }
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('PUT.url', url, data)
      $http.put(url, data).success(successTrack||successWarp||success).error(error)
    }

  this.DELETE = (urlFn, successWrapper) =>
    (data, success, error) => {
      if (!error) error = ServerErrors.add
      if (!success) alert('need to pass success for DELETE ' + url)
      if (successWrapper) success = successWrapper(data)(success)
      var url = '/v1/api'+urlFn(data)
      if (logging) console.log('DELETE.url', url, data)
      $http.delete(url).success(success).error(error)
    }

  return this
})
