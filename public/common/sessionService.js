angular.module('APSvcSession', [])  

  .constant('API', '/v1/api')

  .service('SessionService', ['$http', 'API', function($http, API) {
    this.getSession = function(success)
    {
      $http.get(`${API}/session`).success(success);
    }
    this.getSessionFull = function(success)
    {
      $http.get(`${API}/session/full`).success(success);
    }
  }])
