require('./../common/directives/share.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/bookmarker.js');
require('./../common/directives/analytics.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/pageHelpers.js');
require('./../auth/module.js');


angular.module("AP", ['ngRoute', 'APSideNav', 'APBookmarker', 'APAuth'])

	.config( ['$provide', function ($provide){

	}])

  .run(['$rootScope', 'SessionService',
    function($rootScope, SessionService) {

    pageHlpr.fixNavs('#side');

    if (window.viewData)
    {
	    if (window.viewData.post) $rootScope.post = window.viewData.post
	    if (window.viewData.workshop) $rootScope.workshop = window.viewData.workshop
	    if (window.viewData.expert) $rootScope.expert = window.viewData.expert
	  }

  }])

;
