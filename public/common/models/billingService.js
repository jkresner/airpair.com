var headings = [];
var lazyErrorCb = function(resp) {
  // console.log('error:', resp);
}


angular.module('APSvcBilling', [])

  .constant('API', '/v1/api')

  .service('BillingService', function($http, API) {

    var fns = {
      getPaymethods(success, error) {
        $http.get(`${API}/billing/paymethods`).success(success).error(error)
      },
      addPaymethod(data, success, error) {
        $http.post(`${API}/billing/paymethods`, data).success(success).error(error)
      },
      deletePaymethod(_id, success) {
        $http.delete(`${API}/billing/paymethods/${_id}`).success(success).error(lazyErrorCb)
      },
      getMyOrders(success) {
        $http.get(`${API}/billing/orders`).success(success).error(lazyErrorCb)
      },
      getMyOrdersWithCredit(success) {
        $http.get(`${API}/billing/orders/credit`).success(success).error(lazyErrorCb);
      },
      orderCredit(data, success, error) {
        $http.post(`${API}/billing/orders/credit/${data.paymethodId}`, data).success(success).error(error)
      }
    }

    this.billing = fns;

  })
