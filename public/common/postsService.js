var headings = [];

angular.module('APSvcPosts', [])  

  .constant('API', '/v1/api')

  .factory('mdHelper', function mdHelperFactory() {
    this.headingChanged = function(md)
    {
      var prevHeadings = headings;
      headings = md.match(/\n##.*/g) || [];
    
      var changed = prevHeadings.length != headings.length;
      if (!changed)
      {
        for (var i=0;i<headings.length;i++)
        {
          if (prevHeadings[i] != headings[i]) { 
            return true;
          }
        }
      }
      return changed;
    }

    return this;
  })

  .service('PostsService', ['$http', 'API', 'mdHelper', function($http, API, mdHelper) {

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
      if (mdHelper.headingChanged(md)) {
        $http.post(`${API}/posts-toc`, { md: md } ).success(success);  
      }
    }    
    this.create = function(data, success)
    {
      $http.post(`${API}/posts`, data).success(success);
    }
    this.update = function(data, success)
    {
      $http.put(`${API}/posts/${data._id}`, data).success(success);
    }
  }])
