var lazyErrorCb = function(resp) {
  console.log('error:', resp);
};

angular.module('APSvcAdmin', [])

  .constant('APIAdm', '/v1/api/adm')

  .service('AdmDataService', function($http, $cacheFactory, APIRoute, APIAdm) {
    var GET = APIRoute.GET,
     PUT = APIRoute.PUT,
     POST = APIRoute.POST,
     DELETE = APIRoute.DELETE;

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
      removeItemInCacheList(_id) {
        return (cb) =>
          (resp) => {
            if (pipelineFns.cache) {
              var existing = _.find(pipelineFns.cache.get('active'),(r)=>r._id==_id)
              if (existing)
                pipelineFns.cache.put('active',_.without(pipelineFns.cache.get('active'),existing))
            }
            cb(resp)
          }
      },
      getActive(success, error) {
        if (pipelineFns.cache.get('active'))
          return success(pipelineFns.cache.get('active'))

        $http.get(`${APIAdm}/requests/active`).success(function(data) {
          pipelineFns.cache.put('active',data);
          success(data);
        }).error(error)
      }
    }

    this.pipeline = _.extend(pipelineFns, {
      getIncomplete: GET((d)=>`/adm/requests/incomplete`),
      get2015: GET((d)=>`/adm/requests/2015`),
      getRequest: GET((d)=>`/adm/requests/${d._id}`),
      getUsersRequests: GET((d)=>`/adm/requests/user/${d.userId}`),
      updateRequest: PUT((d)=>`/adm/requests/${d._id}`, pipelineFns.updateItemInCacheList),
      removeSuggestion: PUT((d)=>`/adm/requests/${d._id}/remove/${d.expertId}`, pipelineFns.updateItemInCacheList),
      sendMesssage: PUT((d)=>`/adm/requests/${d._id}/message`, pipelineFns.updateItemInCacheList),
      farm: PUT((d)=>`/adm/requests/${d._id}/farm`, pipelineFns.updateItemInCacheList),
      deleteRequest: DELETE((d)=>`/requests/${d._id}`, (d)=>pipelineFns.removeItemInCacheList(d._id)),
    })

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
