angular.module('APSvcMM', [])

.service('MMDataService', function($http, APIRoute) {

  var GET = APIRoute.GET,
   PUT = APIRoute.PUT,
   POST = APIRoute.POST,
   DELETE = APIRoute.DELETE;

  this.matchmaking = {
    getWaiting: GET((d)=>`/matching/requests/waiting`),
    getRanked: GET((d)=>`/experts/mojo/rank?${d.query}`),
    getRequest: GET((d)=>`/matching/requests/${d._id}`),
    addSuggestion: PUT((d)=>`/matching/requests/${d._id}/add/${d.expertId}`),
    matchifyExpert: PUT((d)=>`/matching/experts/${d.expertId}/matchify/${d.requestId}`),
  }

})
