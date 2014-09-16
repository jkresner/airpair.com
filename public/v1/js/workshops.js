(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
require('./../common/filters.js');
require('./../directives/share.js');
var feautredSlugs = ['fast-mvp-with-angularfire', 'learn-meteorjs-1.0', 'learn-git-and-github', 'publishing-at-the-speed-of-ruby', 'visualization-with-d3js', 'transitioning-to-consulting-for-developers'];
var selectByDateRange = function(list, daysAgo, daysUntil) {
  var start = moment(new Date()).add(daysAgo, 'days');
  var end = moment(new Date()).add(daysUntil, 'days');
  return _.where(list, function(i) {
    return moment(i.time).isAfter(start) && moment(i.time).isBefore(end);
  });
};
angular.module("APWorkshops", ['ngRoute', 'APFilters', 'APShare']).constant('API', '/v1/api').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
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
}]).controller('WorkshopCtrl', ['$scope', '$http', '$routeParams', '$location', 'API', function($scope, $http, $routeParams, $location, API) {
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    $scope.entry = data;
  }).error(function(data, status) {
    if (status == 404) {
      $location.path('/workshops');
    }
  });
}]).controller('SignupCtrl', ['$scope', '$http', '$routeParams', 'API', function($scope, $http, $routeParams, API) {
  $scope.hasAccess = true;
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    $scope.entry = data;
  });
}]);
;


},{"./../common/filters.js":2,"./../directives/share.js":4,"./list.html":5,"./show.html":6,"./signup.html":7,"./subscribe.html":8}],2:[function(require,module,exports){
"use strict";
angular.module('APFilters', []).filter('publishedTime', function() {
  return (function(utc, displayFormat) {
    var offset = moment().format('ZZ');
    if (utc != '' && utc != null) {
      var timeString = utc.split('GMT')[0];
      var format = 'MMM Do hh:mm';
      if (displayFormat) {
        format = displayFormat;
      }
      var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(format);
      return result.replace(offset, '');
    } else {
      return '-';
    }
  });
}).filter('locaTime', function() {
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
}).filter('markdownHtml', function($sce) {
  return (function(html) {
    return $sce.trustAsHtml(html);
  });
}).filter('fancyTags', function() {
  return function(tags) {
    if (!tags) {
      return '';
    }
    return tags.join(', ');
  };
});


},{}],3:[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\"> \n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>     \n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>      \n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>     \n</div>";

},{}],4:[function(require,module,exports){
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


},{"./share.html":3}],5:[function(require,module,exports){
module.exports = "<header>Workshops</header>\n\n<div id=\"index\">\n\n  <div id=\"calendar\">\n\n    <h2>Calendar</h2>\n\n    <p>Keep track of the schedule:</p>\n\n    <a class=\"btn\" href=\"/workshops/subscribe\">Subscribe to calendar</a>\n\n    <hr />\n    <h5>Next 30 days</h5>\n    <ul id=\"month\">\n      <li ng-repeat=\"entry in workshops.month\">\n        <time>{{entry.time | locaTime }}</time> \n        <a href=\"{{entry.url}}\"> {{ entry.title }}</a></li>\n    </ul> \n\n  </div>\n\n\n  <div id=\"next\">\n    <h2>Next up</h2>\n\n    <p style=\"font-size:11px\"><i>* Times shown in <b>{{ timeZoneOffset }}</b> (your browser's timezone)</i> </p>\n\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.upcoming\">\n      <time datetime=\"{{entry.time}}\">{{ entry.time | locaTime }}</time>\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\t\n\n  <div id=\"featured\">\n    <h2>Featured</h2>\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.featured\">\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\n\n  <div id=\"past\">\n    <h2>Library</h2>\n    <ul>\n      <li ng-repeat=\"entry in workshops.past\">\n        <a href=\"{{entry.url}}\">\n          <img src=\"//0.gravatar.com/avatar/{{entry.speakers[0].gravatar }}\"></time> \n          <time>{{entry.speakers[0].name }}</time> \n          {{ entry.title }}</a>\n        </li>\n      </li>  \n    </ul> \n  </div>\n\n</div>";

},{}],6:[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > {{ entry.title }}</header>\n\n<div id=\"show\">\n\n  <h1>{{ entry.title }}</h1>\n\n  <div class=\"share\" ap-share=\"\" ap-fb=\"true\" ap-tw=\"true\" ap-in=\"true\"></div>\n\n  <div class=\"speakers\">\n    <h2>Presenting</h2>\n    <ul>\n      <li ng-repeat=\"speaker in entry.speakers\">\n        <h3>{{ speaker.name }}</h3>\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=400\" />\n\n        {{ speaker.fullBio }}\n      </li>\n    </ul>\n  </div>\n\n  <time>{{entry.time | date:'medium'}}</time>\n\n  {{ entry.difficulty }} <label ng-repeat=\"tag in entry.tags\"> { {{ tag }} } </label>\n\n  <p>{{ entry.description }}</p>\n\n  <div class=\"action\">\n    <div ng-if=\"entry.youtube\">\n      <a ng-href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Get access to all live talks</a>      \n      <label>with AirPair Membership</label>        \n    </div>\n    <div ng-if=\"!entry.youtube\">\n      <a ng-href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Sign up to attend workshop</a>\n      <label>3 spots left</label>  \n    </div>    \n  </div>\n  <div class=\"player\" ng-if=\"entry\">\n\n    <div class=\"recording\" ng-if=\"entry.youtube\">\n\n      <iframe width=\"640\" height=\"360\" ng-src=\"{{ '//www.youtube-nocookie.com/embed/' + entry.youtube | trustUrl }}\" frameborder=\"0\" allowfullscreen></iframe>\n\n    </div>\n  \n    <div class=\"slide\" ng-if=\"entry && !entry.youtube && entry.slug\">\n      <iframe ng-src=\"{{ '/workshops-slide/' + entry.slug  | trustUrl }}\" width=\"640\" height=\"360\" frameborder=\"0\" scrolling=\"no\" style=\"overflow:hidden\"></iframe>\n    </div>\n\n  </div>\n\n\n  <hr />\n<!-- \n  <h3>Chat</h3> -->\n\n</div>";

},{}],7:[function(require,module,exports){
module.exports = "<header>\n  <a href=\"/workshops\">Workshops</a> > \n  <a href=\"{{ entry.url }}\">{{ entry.title }}</a> > \n  Signup\n</header>\n\n<div id=\"signup\">\n\n  <div class=\"choice\" ng-if=\"!hasAccess\">\n\n    <h2>two ways to attend</h2>\n    <h4>Please choose an option access this workshop</h4>\n\n    <div class=\"option\">\n      <h2>Ticket</h2>\n\n      <ul>\n        <li><b>$50 one off</b></li>\n        <li>Access to this workshops</li>        \n        <li>Access the recording</li>            \n        <li>$10 credit towards pairing with {{ entry.speakers[0].name }}</li>        \n      </ul>\n\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Buy a ticket</a>\n    </div>\n\n    <div class=\"option\">\n      <h2>Membership</h2>    \n      <ul>\n        <li><b>$300 for 6 months</b></li>      \n        <li>Access to all workshops</li>        \n        <li>$5/hr off all AirPairing</li>                  \n        <li>Instant chat access to experts</li>                          \n      </ul>\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Get a membership</a>      \n    </div>\n    \n  </div>\n\n  <div class=\"rsvp\" ng-if=\"hasAccess && !entry.youtube\">\n\n    <h2>RSVP for workshop</h2>\n\n    <iframe src=\"{{ 'http://airpa.ir/aircast-signup-' + entry.slug | trustUrl }}\" width=\"100%\" height=\"920\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n\n  </div>\n\n  <div class=\"attending\" ng-if=\"hasAccess && entry.youtube\">\n\n    <h2>This workshop has already happened.</h2>\n\n  </div>\n\n  <hr />\n\n  <a href=\"{{ entry.url }}\" class=\"btn\">Back to workshop</a>\n\n  <hr />\n\n</div>";

},{}],8:[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > Subscribe</header>\n\n<div id=\"subscribe\">\n\n  <h1>Subscribe to Workshops Calendar</h1>\n\n  <p>For convenience, we provide an iCal feed that automatically updates as we make changes to the workshops schedule.</p>\n\n  <input type=\"text\" style=\"width:100%;margin:15px 0 20px 0\" value=\"https://www.google.com/calendar/ical/airpair.co_o3u16m7fv9fc3agq81nsn0bgrs%40group.calendar.google.com/public/basic.ics\" />\n\n  <p>Make sure your client is setup correctly to receive live changes and that you haven't just imported a static view of the schedule.</p>\n\n  <h2>Google hangouts guide</h2>\n\n  <p>Copy and paste the following url in the \"Add by url\" dialog.\n\n  <p>If you select the 'Import calendar' option you will NOT see updates to the schedule as they are made.</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-1.png\" />\n\n  <p>Once the calendar url is added, you will see \"AirCasts\" listed down the left and workshops will appear in your calendar..</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-2.png\" />\n\n  <p>See guide to make sure you're correctly subscribe for updates to the AirCasts schedule.</p>\n\n  <hr />\n\n  <a href=\"/workshops\" class=\"btn\">Back to the workshops page</a>\n\n  <hr />\n\n</div>";

},{}]},{},[1]);
