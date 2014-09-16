angular.module('APSvcSession', [])  

  .constant('API', '/v1/api')

  .service('SessionService', ['$http', 'API', function($http, API) {
    this.getSession = function(success, error)
    {
      $http.get(`${API}/session`).success(success).error(error);
    }
    this.getSessionFull = function(success, error)
    {
      $http.get(`${API}/session/full`).success(success).error(error);
    }
  }])
