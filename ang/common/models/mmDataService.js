angular.module('APSvcMM', [])

.service('MMDataService', function($http, APIRoute) {

  var GET = APIRoute.GET,
   PUT = APIRoute.PUT,
   POST = APIRoute.POST,
   DELETE = APIRoute.DELETE;

  this.matchmaking = {
    getWaiting: GET((d)=>`/matchmaking/requests/waiting`),
    getRanked: GET((d)=>`/experts/mojo/rank?${d.query}`),
    getRequest: GET((d)=>`/matchmaking/requests/${d._id}`),
    addSuggestion: PUT((d)=>`/matchmaking/requests/${d._id}/add/${d.expertId}`),
    matchifyExpert: PUT((d)=>`/matchmaking/experts/${d.expertId}/matchify/${d.requestId}`),
  }

})
