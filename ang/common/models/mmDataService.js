angular.module('APSvcMM', [])

.service('MMDataService', function($http, APIRoute) {

  var GET = APIRoute.GET,
   PUT = APIRoute.PUT,
   POST = APIRoute.POST,
   DELETE = APIRoute.DELETE;

  this.pipeline = {
    getWaiting: GET((d)=>`/matchmaking/requests/waiting`),
    getRequestMatches: GET((d)=>`/experts/match/${d._id}`),
    getRequest: GET((d)=>`/matchmaking/requests/${d._id}`),
    addSuggestion: PUT((d)=>`/matchmaking/requests/${d._id}/add/${d.expertId}`),
    matchifyExpert: PUT((d)=>`/matchmaking/experts/${d.expertId}/matchify/${d.requestId}`),
  }

})
