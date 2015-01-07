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
