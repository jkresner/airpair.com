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
    
    this.toggleRole = function(data, success)
    {
      $http.put(`${APIAdm}/users/${data._id}/role/:role`, data).success(success).error(lazyErrorCb);
    }

  }])
