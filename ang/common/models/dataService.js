var headings = [];
var lazyErrorCb = function(resp) {
  // console.log('error:', resp);
}


angular.module('APDataSvc', [])

  .constant('API', '/v1/api')

  .service('DataService', function($http, APIRoute, API) {
    var GET = APIRoute.GET,
     PUT = APIRoute.PUT,
     POST = APIRoute.POST,
     DELETE = APIRoute.DELETE;

    var billingFns = {
      getPaymethods(success, error) {
        $http.get(`${API}/billing/paymethods`).success(success).error(error)
      },
      addPaymethod(data, success, error) {
        $http.post(`${API}/billing/paymethods`, data).success(success).error(error)
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

    this.billing = _.extend(billingFns, {
      getPayoutmethods: GET((d)=>`/billing/payoutmethods`),
      getBookings: GET((d)=>`/bookings`),
      getBooking: GET((d)=>`/bookings/${d._id}`),
      getOrdersForPayouts: GET((d)=>`/billing/orders/payouts`),
      deletePaymethod: DELETE((d)=>`/billing/payoutmethods/${d._id}`),
      payoutOrders: POST((d)=>`/payouts/${d.payoutmethodId}`)
    })

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
        $http.post(`${API}/requests`, data).success((d) => {
          analytics.track('Save', { type:'request', step: 'type' });
          success(d)
        }).error(error)
      },
      update(data, step, success, error) {
        var trackEventName = 'Save'
        var props = {
          type: 'request',
          step: step,
          location: window.location.pathname // $location.path() no good...
        };
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
      },
      sendVerifyEmailByCustomer(data, success, error) {
        $http.put(`${API}/requests/${data._id}/verify`, {email:data.by.email}).success(success).error(error)
      }
    }

    this.requests = requestFns;

  })
