var headings = [];
var lazyErrorCb = function(resp) { 
  // console.log('error:', resp); 
};

angular.module('APSvcPosts', [])  

  .constant('API', '/v1/api')

  .factory('mdHelper', function mdHelperFactory() {
    this.headingsChanged = function(md)
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
      $http.get(`${API}/posts/${id}`).success(success).error(lazyErrorCb);
    }
    this.getByUsername = function(username, success)
    {
      $http.get(`${API}/posts/by/${username}`).success(success).error(lazyErrorCb);
    }    
    this.getMyPosts = function(success)
    {
      $http.get(`${API}/posts/me`).success(success).error(lazyErrorCb);
    }
    this.getRecentPosts = function(success)
    {
      $http.get(`${API}/posts/recent`).success(success).error(lazyErrorCb);
    }
    this.getToc = function(md, success)
    {      
      if (mdHelper.headingsChanged(md)) {
        $http.post(`${API}/posts-toc`, { md: md } ).success(success).error(lazyErrorCb);
      }
    }    
    this.create = function(data, success)
    {
      $http.post(`${API}/posts`, data).success(success).error(lazyErrorCb);
    }
    this.update = function(data, success)
    {
      $http.put(`${API}/posts/${data._id}`, data).success(success).error(lazyErrorCb);
    }
    this.publish = function(data, success)
    {
      $http.put(`${API}/posts/publish/${data._id}`, data).success(success).error(lazyErrorCb);
    }    
    this.delete = function(_id, success)
    {
      $http.delete(`${API}/posts/${_id}`).success(success).error(lazyErrorCb);
    }     
  }])
