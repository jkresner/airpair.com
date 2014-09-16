angular.module('APSvcPosts', [])  

  .constant('API', '/v1/api')

  .service('PostsService', ['$http', 'API', function($http, API) {
    this.getById = function(id, success)
    {
      $http.get(`${API}/posts/${id}`).success(success);
    }
    this.getMyPosts = function(success)
    {
      $http.get(`${API}/posts/me`).success(success);
    }
    this.getToc = function(md, success)
    {
      $http.post(`${API}/posts-toc`, { md: md } ).success(success);
    }    
    this.create = function(data, success)
    {
      $http.post(`${API}\posts`, data).success(success);
    }
    this.update = function(data, success)
    {
      $http.put(`${API}/posts/${data._id}`, data).success(success);
    }
  }])
