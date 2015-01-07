var lazyErrorCb = function(resp) {
  console.log('error:', resp);
};

angular.module('APSvcAdmin', [])

  .constant('APIAdm', '/v1/api/adm')

  .service('AdmDataService', function($http, $cacheFactory, APIRoute, APIAdm) {
    var GET = APIRoute.GET
    var PUT = APIRoute.PUT
    var POST = APIRoute.POST

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

    this.getUsersViews = function(data, success, error) {
      $http.get(`${APIAdm}/views/user/${data._id}`, data).success(success).error(error)
    }

    this.companyMigrate = function(data, success)
    {
      $http.put(`${APIAdm}/companys/migrate/${data._id}`, {type:data.type}).success(success).error(lazyErrorCb);
    }

    this.companyAddMember = function(company, user, success)
    {
      $http.put(`${APIAdm}/companys/member/${company._id}`, {user}).success(success).error(lazyErrorCb);
    }

    var pipelineFns = {
      cache: $cacheFactory('pipelineFns'),
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
      getActive(success, error) {
        if (pipelineFns.cache.get('active'))
          return success(pipelineFns.cache.get('active'))

        $http.get(`${APIAdm}/requests/active`).success(function(data) {
          pipelineFns.cache.put('active',data);
          success(data);
        }).error(error)
      },
      get2015(success, error) {
        if (pipelineFns.cache.get('2015'))
          return success(pipelineFns.cache.get('2015'))

        $http.get(`${APIAdm}/requests/2015`).success(function(data) {
          pipelineFns.cache.put('2015',data);
          success(data);
        }).error(error)
      },
      getIncomplete(success, error) {
        $http.get(`${APIAdm}/requests/incomplete`).success(success).error(error)
      },
      getRequest(_id, success, error) {
        $http.get(`${APIAdm}/requests/${_id}`).success(success).error(error)
      },
      getUsersRequests(_id, success, error) {
        $http.get(`${APIAdm}/requests/user/${_id}`).success(success).error(error)
      },
      updateRequest(data, success, error) {
        $http.put(`${APIAdm}/requests/${data._id}`, data).success(pipelineFns.updateItemInCacheList(success)).error(error)
      },
      removeSuggestion(data, success, error) {
        $http.put(`${APIAdm}/requests/${data._id}/remove/${data.expertId}`).success(pipelineFns.updateItemInCacheList(success)).error(error)
      },
      sendMesssage(data, success, error) {
        $http.put(`${APIAdm}/requests/${data.requestId}/message`,data).success(pipelineFns.updateItemInCacheList(success)).error(error)
      },
      farm(data, success, error) {
        $http.put(`${APIAdm}/requests/${data.requestId}/farm`,data).success(pipelineFns.updateItemInCacheList(success)).error(error)
      },
      deleteRequest(_id, success, error) {
        $http.delete(`/v1/api/requests/${_id}`).success(pipelineFns.removeItemInCacheList(_id, success)).error(error)
      },
    }

    this.pipeline = pipelineFns

    var billingFns = {
      getUserPaymethods(_id, success, error) {
        $http.get(`${APIAdm}/billing/paymethods/${_id}`).success(success).error(error)
      },
    }

    this.billing = billingFns

    this.bookings = {
      getOrders: GET((d)=>`/adm/orders/${d.start.format('x')}/${d.end.format('x')}/${d.user._id}`),
      getOrder: GET((d)=>`/adm/billing/orders/${d._id}`),
      getBookings: GET((d)=>`/adm/bookings/${d.start.format('x')}/${d.end.format('x')}/${d.user._id}`),
      getBooking: GET((d)=>`/adm/bookings/${d._id}`),
      updateBooking: PUT((d)=>`/adm/bookings/${d._id}`),
      giveCredit: POST((d)=>`/adm/billing/orders/credit`)
    }
  })
