angular.module('APSvcPosts', [])  

  .constant('API', '/v1/api')

  .service('PostsService', ['$http', 'API', function($http, API) {
    this.getById = function(id, cb)
    {
      $http.get(`${API}/posts/${id}`).success(function (result) {
        cb(result);
      });
    }
    this.getMyPosts = function(cb)
    {
      $http.get(`${API}/posts/me`).success(function (result) {
        cb(result);
      });
    }
    this.getToc = function(md, cb)
    {
      $http.post(`${API}/posts-toc`, { md: md } ).success(function (result) {
        cb(result);
      });
    }    
    this.create = function(data)
    {
      $http.post(`${API}\posts`, data).success(function (result) {
        console.log('result', result)
      });
    }
    this.update = function(data)
    {
      $http.put(`${API}/posts/${data._id}`, data).success(function (result) {
        console.log('result', result)
      });
    }
  }])
