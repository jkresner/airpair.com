(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/workshops/module.js":[function(require,module,exports){
"use strict";
require('./filters.js');
require('./../directives/share.js');
var feautredSlugs = ['fast-mvp-with-angularfire', 'publishing-at-the-speed-of-ruby', 'learn-meteorjs-1.0'];
var selectByDateRange = function(list, daysAgo, daysUntil) {
  var start = moment(new Date()).add(daysAgo, 'days');
  var end = moment(new Date()).add(daysUntil, 'days');
  return _.where(list, function(i) {
    return moment(i.time).isAfter(start) && moment(i.time).isBefore(end);
  });
};
angular.module("APWorkshops", ['ngRoute', 'APFilters', 'APShare']).constant('API', '/api').config(['$locationProvider', '$routeProvider', '$sceProvider', function($locationProvider, $routeProvider, $sceProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/workshops', {
    template: require('./list.html'),
    controller: 'WorkshopsCtrl as workshops'
  });
  $routeProvider.when('/workshops/subscribe', {template: require('./subscribe.html')});
  $routeProvider.when('/workshops/signup/:id', {
    template: require('./signup.html'),
    controller: 'SignupCtrl as signup'
  });
  $routeProvider.when('/:tag/workshops/:id', {
    template: require('./show.html'),
    controller: 'WorkshopCtrl as workshop'
  });
}]).run(['$rootScope', function($rootScope) {
  $rootScope.timeZoneOffset = moment().format('ZZ');
}]).controller('WorkshopsCtrl', ['$scope', '$http', 'API', function($scope, $http, API) {
  var self = this;
  var upcomingStart = moment(new Date());
  var upcomingEnd = moment(new Date()).add(14, 'days');
  $http.get(API + '/workshops').success(function(data) {
    self.entries = data;
    self.upcoming = selectByDateRange(data, 0, 9);
    self.month = selectByDateRange(data, 0, 45);
    self.past = selectByDateRange(data, -365, 0).reverse();
    self.featured = _.where(data, function(i) {
      return _.contains(feautredSlugs, i.slug);
    });
  });
}]).controller('WorkshopCtrl', ['$scope', '$http', '$routeParams', 'API', function($scope, $http, $routeParams, API) {
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    console.log('null data', data == '', data);
    $scope.entry = data;
  });
}]).controller('SignupCtrl', ['$scope', '$http', '$routeParams', 'API', function($scope, $http, $routeParams, API) {
  $scope.hasAccess = true;
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    $scope.entry = data;
  });
}]);
;


},{"./../directives/share.js":"/Users/jkrez/src/airpair.com/public/directives/share.js","./filters.js":"/Users/jkrez/src/airpair.com/public/workshops/filters.js","./list.html":"/Users/jkrez/src/airpair.com/public/workshops/list.html","./show.html":"/Users/jkrez/src/airpair.com/public/workshops/show.html","./signup.html":"/Users/jkrez/src/airpair.com/public/workshops/signup.html","./subscribe.html":"/Users/jkrez/src/airpair.com/public/workshops/subscribe.html"}],"/Users/jkrez/src/airpair.com/public/directives/share.html":[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\"> \n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>     \n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>      \n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>     \n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/directives/share.js":[function(require,module,exports){
"use strict";
angular.module("APShare", ['angularLoad']).directive('apShare', function(angularLoad) {
  var ngLoadPromise = angularLoad.loadScript('//i.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true&init=lazy');
  window.pwidget_config = {
    shareQuote: false,
    afterShare: false
  };
  return {
    template: require('./share.html'),
    scope: {
      fb: '=apFb',
      tw: '=apTw',
      in: '=apIn'
    },
    link: function(scope, element) {
      ngLoadPromise.then(function() {
        post_init(element[0]);
      });
    }
  };
});


},{"./share.html":"/Users/jkrez/src/airpair.com/public/directives/share.html"}],"/Users/jkrez/src/airpair.com/public/workshops/filters.js":[function(require,module,exports){
"use strict";
angular.module('APFilters', []).filter('locaTime', function() {
  return (function(utc, displayFormat) {
    var offset = moment().format('ZZ');
    if (utc != '') {
      var timeString = utc.split('GMT')[0];
      var format = 'ddd, MMM Do ha';
      if (displayFormat) {
        format = displayFormat;
      }
      var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(format);
      return result.replace(offset, '');
    } else {
      return 'Confirming time';
    }
  });
}).filter('trustUrl', function($sce) {
  return (function(url) {
    return $sce.trustAsResourceUrl(url);
  });
}).filter('fancyTags', function() {
  return function(tags) {
    if (!tags) {
      return '';
    }
    return tags.join(', ');
  };
});


},{}],"/Users/jkrez/src/airpair.com/public/workshops/list.html":[function(require,module,exports){
module.exports = "<header>Workshops</header>\n\n<div id=\"index\">\n\n  <div class=\"calendar\">\n\n    <h3>Calendar</h3>\n\n    <p>Keep track of the schedule:</p>\n\n    <a class=\"btn\" href=\"/workshops/subscribe\">Subscribe to calendar</a>\n\n    <hr />\n    <h5>Next 30 days</h5>\n    <ul id=\"month\">\n      <li ng-repeat=\"entry in workshops.month\">\n        <time>{{entry.time | locaTime }}</time> \n        <a href=\"{{entry.url}}\"> {{ entry.title }}</a></li>\n    </ul> \n\n  </div>\n\n  <h3>Coming up</h3>\n\n  <p style=\"font-size:11px\"><i>*All times shown in <b>{{ timeZoneOffset }}</b> (your browser's local time)</i> </p>\n\n  <div id=\"upcoming\">\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.upcoming\">\n      <time datetime=\"{{entry.time}}\">{{ entry.time | locaTime }}</time>\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\t\n\n  <h2>Watch featured workshops</h2>\n\n  <div id=\"featured\">\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.featured\">\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\n\n  <h2>Watch past workshops</h2>\n\n  <ul id=\"past\">\n    <li ng-repeat=\"entry in workshops.past\">\n      <a href=\"{{entry.url}}\">\n        <img src=\"//0.gravatar.com/avatar/{{entry.speakers[0].gravatar }}\"></time> \n        <time>{{entry.speakers[0].name }}</time> \n        {{ entry.title }}</a>\n      </li>\n    </li>  \n  </ul> \n\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/show.html":[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > {{ entry.title }}</header>\n\n<div id=\"show\">\n\n\n  <h1>{{ entry.title }}</h1>\n\n  <div class=\"share\" ap-share=\"\" ap-fb=\"true\" ap-tw=\"true\" ap-in=\"true\"></div>\n\n  <div class=\"speakers\">\n    <h2>Presenting</h2>\n    <ul>\n      <li ng-repeat=\"speaker in entry.speakers\">\n        <h3>{{ speaker.name }}</h3>\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=400\" />\n\n        {{ speaker.fullBio }}\n      </li>\n    </ul>\n  </div>\n\n  <time>{{entry.time | date:'medium'}}</time>\n\n  {{ entry.difficulty }} <label ng-repeat=\"tag in entry.tags\"> { {{ tag }} } </label>\n\n  <p>{{ entry.description }}</p>\n\n  <div class=\"action\">\n    <div ng-if=\"entry.youtube\">\n      <a href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Get access to all live talks</a>      \n      <label>with AirPair Membership</label>        \n    </div>\n    <div ng-if=\"!entry.youtube\">\n      <a href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Sign up to attend workshop</a>\n      <label>3 spots left</label>  \n    </div>    \n  </div>\n  <div class=\"player\">\n\n    <div class=\"recording\" ng-if=\"entry.youtube\">\n\n      <iframe width=\"640\" height=\"360\" ng-src=\"{{ '//www.youtube-nocookie.com/embed/' + entry.youtube | trustUrl }}\" frameborder=\"0\" allowfullscreen></iframe>\n\n    </div>\n  \n    <div class=\"slide\" ng-if=\"!entry.youtube\">\n  <svg\n     ng-if=\"entry\"\n     xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n     xmlns:cc=\"http://creativecommons.org/ns#\"\n     xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n     xmlns:svg=\"http://www.w3.org/2000/svg\"\n     xmlns=\"http://www.w3.org/2000/svg\"\n     xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n     version=\"1.1\"\n     width=\"640\"\n     height=\"360\"\n     id=\"svg3418\"\n     preserveAspectRatio=\"xMinYMin meet\"\n     viewBox=\"0 0 1920 1080\">\n    <metadata id=\"metadata3423\">\n      <rdf:RDF>\n        <cc:Work\n           rdf:about=\"\">\n          <dc:format>image/svg+xml</dc:format>\n          <dc:type rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n          <dc:title></dc:title>\n        </cc:Work>\n      </rdf:RDF>\n    </metadata>\n    <defs>\n      <pattern id=\"slideavatar\" x=\"0\" y=\"0\" patternunits=\"userSpaceOnUse\" width=\"400\" height=\"400\">    \n        <image xlink:href=\"http://0.gravatar.com/avatar/892cdc57a3a64ea0ad59827bc6d1ddf7?s=400\"  width=\"300\" height=\"300\" x=\"80\" y=\"70\" />\n      </pattern>\n    </defs>\n    <g transform=\"translate(0,27.637817)\">\n      <rect\n         width=\"1920\"\n         height=\"1080\"\n         ry=\"0.82633966\"\n         x=\"0\"\n         y=\"-27.637817\"\n         id=\"rect4895\"\n         style=\"fill:#edf6f5;fill-opacity:1;stroke:none\" />  \n      <path\n       d=\"M 0,1080 0,825 309.10668,787.05576 789.93929,844.63445 524.26917,1081.0102 z\"\n       transform=\"translate(0,-27.637817)\"\n       id=\"path4831\"\n       style=\"fill:#000000;stroke:none\" />\n      <path\n         d=\"m 790,845 1130,115 0,120 -1395,0 z\"\n         transform=\"translate(0,-27.637817)\"\n         id=\"path4833\"\n         style=\"fill:#91d1cb;fill-opacity:1;stroke:none\" />\n      <path\n         d=\"m 0,-27.637817 c 14.285714,-1.45476 1920,0 1920,0 l 0,15 -600,45 -1320,-35 z\"\n         id=\"path4839\"\n         style=\"fill:#ce5423;fill-opacity:1;stroke:none\" />\n      <path\n         d=\"m 0,25 1320,35 600,-50 0,5 L 1320,85.714286 0,48.571429 z\"\n         transform=\"translate(0,-27.637817)\"\n         id=\"path4841\"\n         style=\"fill:#a83202;fill-opacity:1;stroke:none\" />\n      <text\n       x=\"460\"\n       y=\"240\"\n       transform=\"scale(0.93591061,1.0684781)\"\n       id=\"text4847\"\n       xml:space=\"preserve\"\n       style=\"font-size:104.68206787px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;font-family:Sans\"><tspan\n         x=\"480\"\n         y=\"230\"\n         id=\"tspan4849\"\n         style=\"font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:Open Sans;color:#90d1cc\">{{ entry.speakers[0].name }}</tspan></text>         \n      <circle \n        id=\"avatarCircle\"\n        cx=\"12%\" \n        cy=\"20%\" \n        r=\"150\" \n        fill=\"url(#slideavatar)\" \n        stroke=\"black\" />\n      <text x=\"100\" y=\"570\"\n         xml:space=\"preserve\"\n         style=\"font-size:82pt;font-style:normal;font-weight:200;line-height:100%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;font-family:Open Sans;color:#90d1cc\">\n        <tspan x=\"100\" y=\"570\">{{ entry.title }}</tspan></text>\n      <text\n         x=\"100\"\n         y=\"680\"\n         style=\"font-size:64pt;font-style:normal;font-weight:200;line-height:50%;word-spacing:100px;fill:#000000;fill-opacity:1;stroke:none;font-family:Open Sans\">\n         {{ entry.tags | fancyTags }}</text>    \n      <image xlink:href=\"/v1/img/pages/workshops/aircasts.png\" width=\"400\" height=\"400\" x=\"110\" y=\"710\" />\n    </g>\n  </svg>\n\n    </div>\n\n  </div>\n\n\n  <hr />\n<!-- \n  <h3>Chat</h3> -->\n\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/signup.html":[function(require,module,exports){
module.exports = "<header>\n  <a href=\"/workshops\">Workshops</a> > \n  <a href=\"{{ entry.url }}\">{{ entry.title }}</a> > \n  Signup\n</header>\n\n<div id=\"signup\">\n\n  <div class=\"choice\" ng-if=\"!hasAccess\">\n\n    <h2>two ways to attend</h2>\n    <h4>Please choose an option access this workshop</h4>\n\n    <div class=\"option\">\n      <h2>Ticket</h2>\n\n      <ul>\n        <li><b>$50 one off</b></li>\n        <li>Access to this workshops</li>        \n        <li>Access the recording</li>            \n        <li>$10 credit towards pairing with {{ entry.speakers[0].name }}</li>        \n      </ul>\n\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Buy a ticket</a>\n    </div>\n\n    <div class=\"option\">\n      <h2>Membership</h2>    \n      <ul>\n        <li><b>$300 for 6 months</b></li>      \n        <li>Access to all workshops</li>        \n        <li>$5/hr off all AirPairing</li>                  \n        <li>Instant chat access to experts</li>                          \n      </ul>\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Get a membership</a>      \n    </div>\n    \n  </div>\n\n  <div class=\"rsvp\" ng-if=\"hasAccess && !entry.youtube\">\n\n    <h2>RSVP for workshop</h2>\n\n    <iframe src=\"{{ '//airpa.ir/aircast-signup-' + entry.slug | trustUrl }}\" width=\"760\" height=\"880\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n\n  </div>\n\n  <div class=\"attending\" ng-if=\"hasAccess && entry.youtube\">\n\n    <h2>This workshop has already happened.</h2>\n\n  </div>\n\n  <hr />\n\n  <a href=\"/workshops\" class=\"btn\">Back to the workshops page</a>\n\n  <hr />\n\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/subscribe.html":[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > Subscribe</header>\n\n<div id=\"subscribe\">\n\n  <h1>Subscribe to Workshops Calendar</h1>\n\n  <p>For convenience, we provide an iCal feed that automatically updates as we make changes to the workshops schedule.</p>\n\n  <input type=\"text\" style=\"width:100%;margin:15px 0 20px 0\" value=\"https://www.google.com/calendar/ical/airpair.co_o3u16m7fv9fc3agq81nsn0bgrs%40group.calendar.google.com/public/basic.ics\" />\n\n  <p>Make sure your client is setup correctly to receive live changes and that you haven't just imported a static view of the schedule.</p>\n\n  <h2>Google hangouts guide</h2>\n\n  <p>Copy and paste the following url in the \"Add by url\" dialog.\n\n  <p>If you select the 'Import calendar' option you will NOT see updates to the schedule as they are made.</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-1.png\" />\n\n  <p>Once the calendar url is added, you will see \"AirCasts\" listed down the left and workshops will appear in your calendar..</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-2.png\" />\n\n  <p>See guide to make sure you're correctly subscribe for updates to the AirCasts schedule.</p>\n\n  <hr />\n\n  <a href=\"/workshops\" class=\"btn\">Back to the workshops page</a>\n\n  <hr />\n\n</div>";

},{}]},{},["./public/workshops/module.js"]);
