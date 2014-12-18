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

    this.giveCredit = function(data, success, error) {
      $http.post(`${APIAdm}/billing/orders/credit`, data).success(success).error(error)
    }

    this.getUsersViews = function(data, success, error) {
      $http.get(`${APIAdm}/views/user/${data._id}`, data).success(success).error(error)
    }

    this.getOrders = function(data, success, error) {
      $http.get(`${APIAdm}/orders/${data.start.format('x')}/${data.end.format('x')}`, data).success(success).error(error)
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
      getActive(success, error) {
        $http.get(`${APIAdm}/requests/active`).success(success).error(error)
      },
      getIncomplete(success, error) {
        $http.get(`${APIAdm}/requests/incomplete`).success(success).error(error)
      },
      getRequest(_id, success, error) {
        $http.get(`${APIAdm}/requests/${_id}`).success(success).error(error)
      },
    }

    this.pipeline = pipelineFns

    var billingFns = {
      getUserPaymethods(_id, success, error) {
        $http.get(`${APIAdm}/billing/paymethods/${_id}`).success(success).error(error)
      },
    }

    this.billing = billingFns

  }])
