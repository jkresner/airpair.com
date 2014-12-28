
angular.module('APSvcMM', [])

  .service('MMDataService', function($http, $cacheFactory) {

    var pipelineFns = {
      cache: $cacheFactory('matchmakingFns'),
      updateItemInCacheList(cb) {
        return (data) => {
          if (pipelineFns.cache) {
            var existing = _.find(pipelineFns.cache.get('active'),(r)=>r._id==data._id)
            if (existing) {
              var updated = _.union(_.without(pipelineFns.cache.get('active'),existing), [data])
              pipelineFns.cache.put('active',updated)
            }
          }
          cb(data)
        }
      },
      removeItemInCacheList(id, cb) {
        return (data) => {
          if (pipelineFns.cache) {
            var existing = _.find(pipelineFns.cache.get('active'),(r)=>r._id==id)
            if (existing) {
              pipelineFns.cache.put('active',_.without(pipelineFns.cache.get('active'),existing))
            }
          }
          cb(data)
        }
      },
      getWaiting(success, error) {
        $http.get(`/v1/api/matchmaking/requests/waiting`).success(success).error(error)
      },
      getRequestMatches(_id, success, error) {
        $http.get(`/v1/api/experts/match/${_id}`).success(success).error(error)
      },
      getRequest(_id, success, error) {
        $http.get(`/v1/api/matchmaking/requests/${_id}`).success(success).error(error)
      },
      addSuggestion(data, success, error) {
        $http.put(`/v1/api/matchmaking/requests/${data._id}/add/${data.expertId}`, data).success(pipelineFns.updateItemInCacheList(success)).error(error)
      },
      matchifyExpert(_id, success, error) {
        $http.put(`/v1/api/matchmaking/experts/${_id}/matchify`).success(success).error(error)
      }
    }

    this.pipeline = pipelineFns

  })
