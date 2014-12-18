var headings = [];
var lazyErrorCb = function(resp) {
  // console.log('error:', resp);
}


angular.module('APDataSvc', [])

  .constant('API', '/v1/api')

  .service('DataService', function($http, API) {

    var billingFns = {
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
      getMyOrdersWithCredit(payMethodId, success) {
        $http.get(`${API}/billing/orders/credit/${payMethodId}`).success(success).error(lazyErrorCb);
      },
      orderCredit(data, success, error) {
        $http.post(`${API}/billing/orders/credit`, data).success(success).error(error)
      },
      bookExpert(data, success, error) {
        $http.post(`${API}/bookings/${data.expertId}`, data).success(success).error(error)
      }
    }

    this.billing = billingFns;


    var expertFns = {
      getForExpertsPage(success, error) {
        $http.get(`${API}/experts`).success(success).error(error)
      },
      getById(data, success, error) {
        $http.get(`${API}/experts/${data._id}`).success(success).error(error)
      }
    }

    this.experts = expertFns;


    var requestFns = {
      create(data, success, error) {
        analytics.track('Request', { type:'request', step: 'start' });
        $http.post(`${API}/requests`, data).success(success).error(error)
      },
      update(data, step, success, error) {
        var trackEventName = 'Save'
        var props = {
          type: 'request',
          step: step,
          location: window.location.pathname // $location.path() no good...
        };
        if (step == 'submit') { trackEventName = "Request" }
        analytics.track(trackEventName, props);
        $http.put(`${API}/requests/${data._id}`, data).success(success).error(error)
      },
      getMyRequests(success, error) {
        $http.get(`${API}/requests`).success(success).error(error)
      },
      getById(id, success, error) {
        $http.get(`${API}/requests/${id}`).success(success).error(error)
      },
      getReviewById(id, success, error) {
        $http.get(`${API}/requests/review/${id}`).success(success).error(error)
      },
      replyByExpert(requestId, expertId, data, success, error) {
        $http.put(`${API}/requests/${requestId}/reply/${expertId}`, data).success(success).error(error)
      },
      getRequestForBookingExpert(requestId, expertId, success, error) {
        $http.get(`${API}/requests/${requestId}/book/${expertId}`).success(success).error(error)
      }
    }

    this.requests = requestFns;

  })
