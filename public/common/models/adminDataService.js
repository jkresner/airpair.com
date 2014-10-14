var lazyErrorCb = function(resp) {
  console.log('error:', resp);
};

angular.module('APSvcAdmin', [])

  .constant('APIAdm', '/v1/api/adm')

  .service('AdmDataService', ['$http', 'APIAdm', function($http, APIAdm) {

    this.getPosts = function(success)
    {
      $http.get(`${APIAdm}/posts`).success(success).error(lazyErrorCb);
    }

    this.getUsersInRole = function(data, success)
    {
      $http.get(`${APIAdm}/users/role/${data.role}`).success(success).error(lazyErrorCb);
    }

    this.toggleRole = function(data, success)
    {
      $http.put(`${APIAdm}/users/${data._id}/role/${data.role}`, data).success(success).error(lazyErrorCb);
    }

    this.getRedirects = function(success)
    {
      $http.get(`${APIAdm}/redirects`).success(success).error(lazyErrorCb);
    }

    this.createRedirect = function(data, success)
    {
      $http.post(`${APIAdm}/redirects`, data).success(success).error(lazyErrorCb);
    }

    this.deleteRedirect = function(id, success)
    {
      $http.delete(`${APIAdm}/redirects/${id}`).success(success).error(lazyErrorCb);
    }

  }])
