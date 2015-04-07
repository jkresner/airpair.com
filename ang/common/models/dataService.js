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

    this.posts = {
      getByIdEditing: GET((d)=>`/posts/${d._id}/edit`),
      getByIdForEditingInfo: GET((d)=>`/posts/${d._id}/info`),
      getByIdForSubmitting: GET((d)=>`/posts/${d._id}/submit`),
      getByIdForForking: GET((d)=>`/posts/${d._id}/fork`),
      getByIdForContributors: GET((d)=>`/posts/${d._id}/contributors`),
      getByIdForPubishing: GET((d)=>`/posts/${d._id}/publish`),
      getMyPosts: GET((d)=>`/posts/me`),
      getRecentPosts: GET((d)=>`/posts/recent`),
      getInReview: GET((d)=>`/posts/review`),
      // getMyForks: GET((d)=>`/posts/forks/me`),
      getTagsPosts: GET((d)=>`/posts/tag/${d.tagSlug}`),
      getProviderScopes: GET((d)=>`/users/me/provider-scopes`),
      checkSlugAvailable: GET((d)=>`/posts/check-slug/${d._id}/${d.slug}`),
      create: POST((d)=>`/posts`),
      update: PUT((d)=>`/posts/${d._id}`),
      updateMarkdown: PUT((d)=>`/posts/${d._id}/md`),
      getGitHEAD: GET((d)=>`/posts/head/${d._id}`),
      propagateFromHEAD: PUT((d)=>`/posts/propagate-head/${d._id}`),
      publish: PUT((d)=>`/posts/publish/${d._id}`),
      deletePost: DELETE((d)=>`/posts/${d._id}`),
      submitForReview: PUT((d)=>`/posts/submit/${d._id}`),
      addForker: PUT((d)=>`/posts/add-forker/${d._id}`),
      review: POST((d)=>`/posts/${d.postId}/review`),
      reviewUpdate: PUT((d)=>`/posts/${d.postId}/review/${d._id}`),
      reviewReply: PUT((d)=>`/posts/${d.postId}/review/${d._id}/reply`),
      reviewUpvote: PUT((d)=>`/posts/${d.postId}/review/${d._id}/upvote`),
      reviewDelete: DELETE((d)=>`/posts/${d.postId}/review/${d._id}`)
    }


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

    this.tags = {
      search: GET((d)=>`/tags/search/${d.q}`),
      create: GET((d)=>`/tags`)
    }

    this.billing = _.extend(billingFns, {
      getPayoutmethods: GET((d)=>`/billing/payoutmethods`),
      getBookings: GET((d)=>`/bookings`),
      getBooking: GET((d)=>`/bookings/${d._id}`),
      getOrdersForPayouts: GET((d)=>`/billing/orders/payouts`),
      deletePaymethod: DELETE((d)=>`/billing/paymethods/${d._id}`),
      payoutOrders: POST((d)=>`/payouts/${d.payoutmethodId}`)
    })

    var expertFns = {
      getForExpertsPage: GET((d)=>`/experts`),
      getMe: GET((d)=>`/experts/me`),
      getById: GET((d)=>`/experts/${d._id}`),
      getHistory: GET((d)=>`/experts/${d._id}/history`),
      getForDashboard: GET((d)=>`/experts/dashboard`),
      create: POST((d)=>`/experts/me`),
      updateMe: PUT((d)=>`/experts/${d._id}/me`),
      saveDeal: POST((d)=>`/experts/${d.expertId}/deal`),
      // expireDeal: PUT((d)=>`/experts/${d._id}/deal/${d.dealId}/expire`),
    }

    this.experts = expertFns;

    var requestFns = {
      create: POST((d)=>`/requests`,null,(d)=>{return{type:'request',step:'type',value:d.type}}),
      update: PUT((d)=>`/requests/${d._id}`,null,(d)=>{ return{type:'request',step:d.step}}),
      getMyRequests: GET((d)=>`/requests`),
      getById: GET((d)=>`/requests/${d._id}`),
      deleteRequest: DELETE((d)=>`/requests/${d._id}`),
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
