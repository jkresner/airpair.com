(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/common/index.js":[function(require,module,exports){
"use strict";
require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/userInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/bookmarker.js');
require('./../common/directives/analytics.js');
require('./../common/directives/forms.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/pageHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');
require('./../billing/module.js');
require('./../profile/module.js');
angular.module("AP", ['ngRoute', 'ngAnimate', 'APSideNav', 'APAuth', 'APPosts', 'APWorkshops', 'APProfile', 'APBilling']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/v1', {template: require('../home.html')});
  $routeProvider.when('/about', {template: require('../about.html')});
  $routeProvider.when('/', {template: require('../about.html')});
}]).run(['$rootScope', '$location', 'SessionService', function($rootScope, $location, SessionService) {
  pageHlpr.fixNavs('#side');
  $rootScope.$on('$routeChangeSuccess', function() {
    window.trackRoute($location.path());
  });
}]);
;

//# sourceMappingURL=<compileOutput>


},{"../about.html":"/Users/matias/Sites/airpair.com/public/about.html","../home.html":"/Users/matias/Sites/airpair.com/public/home.html","./../auth/module.js":"/Users/matias/Sites/airpair.com/public/auth/module.js","./../billing/module.js":"/Users/matias/Sites/airpair.com/public/billing/module.js","./../common/directives/analytics.js":"/Users/matias/Sites/airpair.com/public/common/directives/analytics.js","./../common/directives/bookmarker.js":"/Users/matias/Sites/airpair.com/public/common/directives/bookmarker.js","./../common/directives/forms.js":"/Users/matias/Sites/airpair.com/public/common/directives/forms.js","./../common/directives/post.js":"/Users/matias/Sites/airpair.com/public/common/directives/post.js","./../common/directives/share.js":"/Users/matias/Sites/airpair.com/public/common/directives/share.js","./../common/directives/sideNav.js":"/Users/matias/Sites/airpair.com/public/common/directives/sideNav.js","./../common/directives/tagInput.js":"/Users/matias/Sites/airpair.com/public/common/directives/tagInput.js","./../common/directives/userInput.js":"/Users/matias/Sites/airpair.com/public/common/directives/userInput.js","./../common/filters/filters.js":"/Users/matias/Sites/airpair.com/public/common/filters/filters.js","./../common/models/postsService.js":"/Users/matias/Sites/airpair.com/public/common/models/postsService.js","./../common/models/sessionService.js":"/Users/matias/Sites/airpair.com/public/common/models/sessionService.js","./../common/pageHelpers.js":"/Users/matias/Sites/airpair.com/public/common/pageHelpers.js","./../posts/module.js":"/Users/matias/Sites/airpair.com/public/posts/module.js","./../profile/module.js":"/Users/matias/Sites/airpair.com/public/profile/module.js","./../workshops/module.js":"/Users/matias/Sites/airpair.com/public/workshops/module.js"}],"/Users/matias/Sites/airpair.com/public/about.html":[function(require,module,exports){
module.exports = "<header>About</header>\n<section id=\"about\">\n\n  <img src=\"/v1/img/pages/about/airpair.png\" />\n\n  <section class=\"header\">\n    <table>\n      <tr>\n        <td><span>{</span></td>\n        <td><h2><br />\n      AirPair is a <b>community</b> of <b>world class developers</b>\n      <label>available for micro-consulting through video chat</label>\n    </h2></td>\n        <td><span>}</span></td>\n      </tr>\n    </table>\n  </section>\n\n\n  <section class=\"expertise\">\n\n    <div class=\"block\">you need expertise.</div>\n    <div class=\"vr\" style=\"margin-top:-30px\"></div>\n\n    <p>The average senior developer makes <em>$124,131</em> a year + benefits</p>\n    <p>For less than <em>$10,000</em> you could have that person on your team</p>\n\n    <label>(did we mention he's the senior developer at Groupon?)</label>\n\n<!--\n    <p>The average 4 year degree costs developer makes <em>$124,131</em> a year + benefits.</p>\n    <p>For less than <em>$10,000</em> you could have that person on your team.</p> -->\n\n  </section>\n\n  <section class=\"how\">\n\n    <div class=\"vr\"></div>\n\n    <h2>How can you use AirPair?</h2>\n    <br />\n\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <h3>Problem solving</h3>\n        <p></p>\n      </div>\n      <div class=\"col-md-4\">\n        <h3>Mentorship</h3>\n        <p></p>\n      </div>\n      <div class=\"col-md-4\">\n        <h3>Code Review</h3>\n        <p></p>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <h3>Vetting</h3>\n        <p></p>\n      </div>\n      <div class=\"col-md-4\">\n        <h3>Advising</h3>\n        <p></p>\n      </div>\n      <div class=\"col-md-4\">\n        <h3>And More!</h3>\n        <p></p>\n      </div>\n    </div>\n\n\n  </section>\n\n  <div class=\"vr\"></div>\n\n  <section class=\"help\">\n\n    <div class=\"block\">got a problem?</div>\n    <div class=\"vr\" style=\"margin-top:-30px\"></div>\n\n    <p>The average jaunt on Stack Overflow takes <em>4 painful hours</em>.</p>\n\n    <label>and shortens your life by 3 months</label>\n\n    <p>Solve your problem <em>10x quicker</em> with experts in every language.</p>\n\n  </section>\n\n  <br />\n\n\n  <div class=\"vr\"></div>\n  <section class=\"help\">\n\n    <div class=\"block\">it's easy</div>\n    <div class=\"vr\" style=\"margin-top:-30px\"></div>\n\n    <p>Spend <em>5 minutes</em> filling out a request and get introduced to</p>\n\n    <p>developers that <em>Facebook, Google and Apple</em> would salivate over.</p>\n    <br />\n  </section>\n\n  <div class=\"vr\"></div>\n  <section class=\"gaurantee\">\n\n    <div class=\"block\">try it out, risk free</div>\n    <div class=\"vr\" style=\"margin-top:-30px\"></div>\n\n    <p>We have a 100% satisfaction guarantee</p>\n\n    <label>Warning AirPairing can become addictive once you realized how awesome it is.</label>\n\n  </section>\n\n\n\n<a ng-if=\"!session._id\" href=\"#\" ng-click=\"openProfile()\" class=\"btn\">Join AirPair</a>\n<a ng-if=\"session._id\" href=\"/find-an-expert\" target=\"_self\" class=\"btn\">Get help</a>\n";

},{}],"/Users/matias/Sites/airpair.com/public/auth/login.html":[function(require,module,exports){
module.exports = "<header>Login</header>\n<section id=\"auth\" ng-controller=\"LoginCtrl as LoginCtrl\">\n\n<h3>Welcome back.</h3>\n\n<p ng-if=\"session._id\"><br /><br />You are logged in as {{ session.email }}. <br /><br />Want to <a href=\"/v1/auth/logout\">Logout</a>?</p>\n\n\n<div class=\"choice\" ng-if=\"!session._id\">\n<div class=\"google option\">\n\n  <h2>One-click login</h2>\n  <p>\n    <a class=\"btn btn-error\" href=\"/v1/auth/google\" target=\"_self\">Login with google</a>\n  </p>\n  <p style=\"font-size:12px;margin:20px 0 0 0\">\n\n  * You will be temporarily redirected to a google login page</p>\n\n</div>\n\n<div class=\"local option\">\n\n  <h2>Password login</h2>\n\n  <form novalidate name=\"loginForm\" ng-submit=\"LoginCtrl.submit(loginForm.$valid, data)\">\n    <div form-group>\n      <label class=\"control-label sr-only\" for=\"loginEmail\">Email</label>\n      <input id=\"loginEmail\" form-control type=\"email\" placeholder=\"Email\" name=\"email\" ng-model=\"data.email\" required>\n      <div class=\"error\" ng-if=\"formGroup.showError(loginForm.email)\" ng-messages=\"loginForm.email.$error\">\n        <div ng-message=\"required\">Field required</div>\n        <div ng-message=\"email\">Invalid email</div>\n      </div>\n    </div>\n    <div form-group>\n      <label class=\"control-label sr-only\" for=\"loginPassword\">Password</label>\n      <input id=\"loginPassword\" form-control type=\"password\" placeholder=\"Password\" name=\"password\" ng-model=\"data.password\" required>\n      <div class=\"error\" ng-if=\"formGroup.showError(loginForm.password)\" ng-messages=\"loginForm.password.$error\">\n        <div ng-message=\"required\">Password required</div>\n      </div>\n    </div>\n\n    <button type=\"submit\" class=\"btn btn-warning btn-lg\">Login</button>\n\n    <div class=\"error\" ng-if=\"loginFail\">\n      <b>Login failed:</b> <span ng-if=\"loginFail\">{{loginFail.message}}</span>\n    </div>\n  </form>\n\n\n  <p>New? <a href=\"#\" ng-click=\"openProfile()\">Create an account</a>.</p>\n\n</div>\n</div>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/auth/module.js":[function(require,module,exports){
"use strict";
var resolver = require('./../common/routes/helpers.js');
angular.module("APAuth", ['ngRoute', 'ngMessages', 'APFormsDirectives', 'APFilters', 'APSvcSession', 'APAnalytics']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/auth/login', {template: require('./login.html')});
  $routeProvider.when('/v1/auth/signup', {template: require('./signup.html')});
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  SessionService.onAuthenticated((function(session) {
    $rootScope.session = session;
  }));
}]).controller('LoginCtrl', ['$rootScope', '$scope', '$window', 'SessionService', function($rootScope, $scope, $window, SessionService) {
  var self = this;
  $scope.data = {};
  this.submit = function(isValid, formData) {
    if (!isValid)
      return;
    SessionService.login(formData, (function(result) {}), (function(e) {
      return $scope.loginFail = e.error;
    }));
  };
}]).controller('SignupCtrl', ['$scope', '$window', 'SessionService', function($scope, $window, SessionService) {
  var self = this;
  this.submit = function(isValid, formData) {
    if (!isValid)
      return;
    SessionService.signup(formData, (function() {
      return $window.location = '';
    }), (function(e) {
      return $scope.signupFail = e.error;
    }));
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./../common/routes/helpers.js":"/Users/matias/Sites/airpair.com/public/common/routes/helpers.js","./login.html":"/Users/matias/Sites/airpair.com/public/auth/login.html","./signup.html":"/Users/matias/Sites/airpair.com/public/auth/signup.html"}],"/Users/matias/Sites/airpair.com/public/auth/signup.html":[function(require,module,exports){
module.exports = "<header>Sign up</header>\n<section id=\"auth\">\n\n  <div class=\"choice\">\n  <div class=\"signup option\">\n\n    <h2>Signup</h2>\n\n    <form novalidate ng-submit=\"SignupCtrl.submit(signupForm.$valid, data)\" name=\"signupForm\" ng-controller=\"SignupCtrl as SignupCtrl\">\n      <div class=\"form-group\">\n        <label>Full name</label>\n        <input type=\"name\" placeholder=\"Full name\" class=\"form-control\" name=\"name\" ng-model=\"data.name\" required >\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n          <div ng-if=\"signupForm.email.$error.required\">Full name required</div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label>Email</label>\n        <input type=\"email\" placeholder=\"Email\" class=\"form-control\" name=\"email\" ng-model=\"data.email\" required >\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n          <div ng-if=\"signupForm.email.$error.required\">Email required</div>\n          <div ng-if=\"signupForm.email.$error.email\">Invalid email</div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label>Password</label>\n        <input type=\"password\" placeholder=\"Password\" class=\"form-control\" name=\"password\" ng-model=\"data.password\" required>\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.password.$touched\">\n          <div ng-if=\"signupForm.password.$error.required\">Password required</div>\n        </div>\n      </div>\n\n      <button type=\"submit\" class=\"btn btn-warning btn-lg\">Sign up</button>\n\n      <div class=\"error\" ng-if=\"signupFail\">\n        <b>Sign up failed:</b> <span ng-if=\"signupFail\">{{signupFail}}</span>\n      </div>\n    </form>\n\n  </div>\n  </div>\n\n  <h3>Already have an account?</h3>\n\n  <p><a href=\"/v1/auth/login\"><b>Login</b></a> with Google or an email and password</a>.</p>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/billing/membership.html":[function(require,module,exports){
module.exports = "<header>Membership</header>\n<section id=\"membership\">\n\n  <h3>Membership Benefits</h3>\n\n  <div class=\"choice\">\n\n    <div class=\"option\">\n      <h2>$5 off each hour</h2>\n      <p>Reduced rates on every hour of AirPairing you book.</p>\n    </div>\n\n    <div class=\"option\">\n      <h2>Live Workshops</h2>\n      <p>Free access to live <a href=\"/workshops\" target=\"_blank\">AirCasts</a>.</p>\n    </div>\n\n    <div class=\"option\">\n      <h2>IM with Experts</h2>\n      <p>Instant message with online experts.</p>\n    </div>\n\n    <div class=\"option\">\n      <h2>Waived Fees</h2>\n      <p>No rescheduling or finders fees (On 12 mth membership).</p>\n    </div>\n\n  </div>\n\n  <h3>Purchase Membership</h3>\n\n  <div class=\"choice\">\n    <div class=\"option\">\n      <h2>6 months<br />/ $300</h2>\n      <button id=\"buy6mths\" class=\"btn btn-lg\" track-click=\"Buy Membership\">Purchase 6 Mth Membership</button>\n    </div>\n\n    <div class=\"option\">\n      <h2>12 months<br />/ $500</h2>\n       <button id=\"buy6mths\" class=\"btn btn-lg\" track-click=\"Buy Membership\">Purchase 12 Mth Membership</button>\n    </div>\n  </div>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/billing/module.js":[function(require,module,exports){
"use strict";
var resolver = require('./../common/routes/helpers.js').resolveHelper;
angular.module("APBilling", ['ngRoute', 'APFilters', 'APSvcSession', 'APAnalytics']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  var authd = resolver(['session']);
  $routeProvider.when('/billing', {
    template: require('./welcome.html'),
    resolve: authd
  });
  $routeProvider.when('/billing/membership', {
    template: require('./membership.html'),
    resolve: authd
  });
}]).controller('BillingCtrl', ['$scope', '$window', 'SettingsService', function($scope, $window, SettingsService) {
  var self = this;
  console.log('in settings billing');
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./../common/routes/helpers.js":"/Users/matias/Sites/airpair.com/public/common/routes/helpers.js","./membership.html":"/Users/matias/Sites/airpair.com/public/billing/membership.html","./welcome.html":"/Users/matias/Sites/airpair.com/public/billing/welcome.html"}],"/Users/matias/Sites/airpair.com/public/billing/welcome.html":[function(require,module,exports){
module.exports = "<header>Billing</header>\n<section id=\"billing\" class=\"comingsoon\">\n\n  <h3>Billing coming soon</h3>\n\n  <p>This page is scheduled for Nov 17</p>\n\n<!-- <h1>Two ways to pay</h1>\n\n\n<div class=\"choice\">\n<div class=\"google option\">\n\n<h2>Pay as you go</h2>\n<p>Pay for each AirPair session a la carte as you schedule them.</p>\n\n</div>\n\n<div class=\"local option\">\n\n<h2>Credit</h2>\n<p>Purchase bulk credit to use with any expert and receive up to 20% extra.</p>\n\n</div>\n</div> -->\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/analytics.js":[function(require,module,exports){
"use strict";
angular.module("APAnalytics", []).directive('trackClick', ['$location', '$timeout', '$parse', function($location, $timeout, $parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var event = "Click";
      var target = attrs.target;
      var location = attrs.href;
      var type = attrs.trackClick;
      element.click(function() {
        if (scope.tracking === false)
          return;
        var props = {
          id: element.attr('id'),
          text: element.text().trim(),
          location: window.location.pathname,
          type: type
        };
        var data = element.attr('data');
        if (data)
          props.data = data;
        if (window.analytics) {
          analytics.track(event, props);
          if (target == '_blank' || target == '_self') {
            $timeout(function() {
              window.location.href = location;
            }, 250);
            return false;
          }
        } else {
          console.log('debug.analytics', 'track', event, props);
        }
      });
    }
  };
}]);

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/public/common/directives/bookmarker.html":[function(require,module,exports){
module.exports = "<a href=\"\" ng-click=\"bookmarker.toggle(objectId, type)\">\n  <img ng-hide=\"bookmarker.exists(objectId)\" class=\"bookmark\" ng-src=\"/v1/img/css/bookmark.png\" />\n  <img ng-show=\"bookmarker.exists(objectId)\" class=\"bookmark\" ng-src=\"/v1/img/css/bookmarked.png\" />\n</a>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/bookmarker.js":[function(require,module,exports){
"use strict";
angular.module("APBookmarker", ['APSvcSession']).directive('bookmarkerlist', ['SessionService', function(SessionService) {
  return {
    link: function(scope, element, attrs) {},
    controller: ['$rootScope', '$scope', function($rootScope, $scope) {
      SessionService.onAuthenticated(function(session) {
        _.each(session.bookmarks, function(bookmark) {
          $(".bookmark" + bookmark.objectId).attr('src', "/v1/img/css/bookmarked.png");
        });
      });
      alert('asd');
      window.toggleBookmark = function(e) {
        var $elem = $(e);
        var objectId = $elem.data('id');
        var type = $elem.data('type');
        var success = function(result) {
          if ($elem.attr('src') == "/v1/img/css/bookmarked.png")
            $elem.attr('src', "/v1/img/css/bookmark.png");
          else
            $elem.attr('src', "/v1/img/css/bookmarked.png");
        };
        var error = function(result) {
          console.log('bookmarked.error', result);
        };
        SessionService.updateBookmark({
          type: type,
          objectId: objectId
        }, success, error);
      };
    }]
  };
}]).factory('BookmarkerService', ['SessionService', '$rootScope', function(SessionService, $rootScope) {
  var bookmarkLookup = {};
  var bookmarksChanged = false;
  function populateBookmarkLookup() {
    bookmarkLookup = {};
    bookmarksChanged = false;
    var bookmarks = $rootScope.session ? $rootScope.session.bookmarks : [];
    _.each(bookmarks, function(b) {
      bookmarkLookup[b.objectId] = true;
    });
  }
  function lookup(objectId) {
    if (bookmarksChanged)
      populateBookmarkLookup();
    return bookmarkLookup[objectId];
  }
  SessionService.onAuthenticated(function() {
    bookmarksChanged = true;
  });
  var self;
  return self = {
    exists: lookup,
    toggle: function(objectId, type, success, error) {
      SessionService.updateBookmark({
        objectId: objectId,
        type: type
      }, function(response) {
        bookmarksChanged = true;
        success(lookup(objectId));
      }, error);
    }
  };
}]).directive('bookmarker', ['BookmarkerService', 'SessionService', '$document', '$animate', function(BookmarkerService, SessionService, $document, $animate) {
  return {
    restrict: 'EA',
    template: require('./bookmarker.html'),
    require: 'bookmarker',
    controllerAs: 'bookmarker',
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      $scope.type = $scope.$eval($attrs.type);
      $scope.objectId = $scope.$eval($attrs.objectId);
      var authenticated = false;
      SessionService.onAuthenticated(function(e) {
        authenticated = e && e._id && e._id.length;
      });
      var ctrl = this;
      ctrl.exists = function(objectId) {
        return BookmarkerService.exists(objectId);
      };
      ctrl.toggle = function(objectId, type) {
        if (!authenticated)
          return;
        BookmarkerService.toggle(objectId, type, function(status) {
          $scope.$evalAsync(status ? ctrl.onActive : ctrl.onInactive);
        });
      };
    }],
    link: function(scope, element, attrs, bookmarker) {
      var body = angular.element($document[0].body);
      bookmarker.onActive = function() {
        var clone = angular.element(element[0].cloneNode(true));
        body.append(clone);
        var start = element.offset();
        var destination = $('#navBookmarksToggle');
        var end = destination.offset();
        clone.addClass('bookmark-animation');
        $animate.leave(clone, {
          from: {
            position: 'absolute',
            left: start.left,
            top: start.top
          },
          to: {
            left: end.left,
            top: end.top
          }
        });
      };
      bookmarker.onInactive = function() {};
    }
  };
}]);

//# sourceMappingURL=<compileOutput>


},{"./bookmarker.html":"/Users/matias/Sites/airpair.com/public/common/directives/bookmarker.html"}],"/Users/matias/Sites/airpair.com/public/common/directives/bookmarks.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Bookmark AirPair Content</h3>\n</div>\n<div class=\"modal-body bookmarks bookmark-input-group\">\n\n  <p>Collect your favorite <a href=\"/posts\">posts</a>, <a href=\"/workshops\">workshops</a> and experts.</p>\n\n  <ul class=\"bookmarks\" sortable get='bookmarks' set='updateBookmarks'>\n    <li ng-repeat=\"b in bookmarks() | orderBy:'sort'\" ng-attr-data-id=\"{{b._id}}\">\n      <a href=\"{{b.url}}\" target=\"_self\">{{b.title}}</a>\n      <a class=\"remove\" ng-click=\"deselectBookmark(b)\">x</a>\n      <a class=\"order\"></a>\n    </li>\n </ul>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/forms.js":[function(require,module,exports){
"use strict";
angular.module("APFormsDirectives", []).directive('formGroup', [function() {
  return {
    scope: true,
    controllerAs: 'formGroup',
    controller: function() {},
    require: ['^form', 'formGroup'],
    link: function(scope, element, attrs, ctrls) {
      var formCtrl = ctrls[0];
      var ctrl = ctrls[1];
      ctrl.$fieldSubmitted = false;
      element.addClass('form-group');
      var form = element.closest('form').on('submit', function() {
        console.log('submit', ctrl.$fieldSubmitted);
        if (!ctrl.$fieldSubmitted) {
          ctrl.$fieldSubmitted = true;
          ctrl.showError(ctrl.model);
        }
      });
      ctrl.showError = function(model) {
        ctrl.model = model;
        var show = model.$invalid && (model.$touched || ctrl.$fieldSubmitted);
        element.toggleClass('has-error', show).toggleClass('has-feedback', show);
        return show;
      };
    }
  };
}]).directive('formControl', [function() {
  return {
    require: ['^formGroup', 'ngModel'],
    link: function(scope, element, attrs, ctrls) {
      element.addClass('form-control');
    }
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/public/common/directives/post.html":[function(require,module,exports){
module.exports = "<div class=\"preview\">\n  <article class=\"blogpost\">\n    <h1 class=\"entry-title\" itemprop=\"headline\">{{ post.title || \"Type post title ...\" }}</h1>\n    <h4 id=\"table-of-contents\" ng-if=\"preview.toc\">Table of Contents</h4>\n    <ul id=\"previewToc\" ng-bind-html=\"preview.toc | markdownHtml\"></ul>\n    <figure class=\"author\">\n      <img ng-alt=\"{{post.by.name}}\" ng-src=\"{{post.by.avatar}}?s=100\">\n      <figcaption>\n        {{post.by.bio}}\n      </figcaption>\n    </figure>\n    <p class=\"asset\" ng-bind-html=\"preview.asset | markdownHtml\" ng-if=\"post.title && post.by.bio\"></p>\n    <hr />\n    <div id=\"body\" ng-bind-html=\"preview.body | markdownHtml\"></div>\n  </article>\n</div>\n\n<hr />\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/post.js":[function(require,module,exports){
"use strict";
angular.module("APPost", []).directive('apPostListItem', ['$parse', function($parse) {
  return {
    restrict: 'E',
    template: require('./postListItem.html'),
    link: function(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post);
    }
  };
}]).directive('apPost', function() {
  return {
    template: require('./post.html'),
    controller: function($scope, $timeout, PostsService) {
      $timeout(function() {
        pageHlpr.highlightSyntax();
      }, 100);
    }
  };
});
;

//# sourceMappingURL=<compileOutput>


},{"./post.html":"/Users/matias/Sites/airpair.com/public/common/directives/post.html","./postListItem.html":"/Users/matias/Sites/airpair.com/public/common/directives/postListItem.html"}],"/Users/matias/Sites/airpair.com/public/common/directives/postListItem.html":[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\n  <a href=\"{{ post.url }}\" title=\"{{ post.title }}\" target=\"_self\" rel=\"bookmark\">\n    <header class=\"entry-header\">\n      <img class=\"entry-header-image\" itemprop=\"image\" ng-src=\"{{ post.meta.ogImage }}\" align=\"left\" />\n\n      <span class=\"entry-categories\">\n        <em ng-repeat='tag in post.tags'>{{ '{'+tag.slug+'}' }}</em>\n      </span>\n\n      <p class=\"entry-meta\">\n\n        <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\n          <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\n          <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\n          <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time>\n\n        </span>\n      </p>\n    </header>\n    <div class=\"entry-content\" itemprop=\"text\">\n      <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2>\n      <p>{{ post.meta.description }}</p>\n\n    </div>\n  </a>\n  <footer class=\"entry-footer\">\n    <bookmarker type=\"'post'\" object-id=\"p._id\"></bookmarker>\n  </footer>\n</article>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/profile.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Account info</h3>\n  <a href=\"#\" class=\"close\" ng-click=\"cancel()\">x</a>\n</div>\n\n<div ng-if=\"session._id\" class=\"success\">\n  <div class=\"modal-body profile\">\n    <h2>Account successfully created.</h2>\n  </div>\n\n  <div class=\"modal-footer profile\">\n    <button ng-click=\"cancel()\" class=\"btn btn-primary\">Continue</button>\n  </div>\n</div>\n\n\n<form ng-if=\"!session._id\" id=\"profileForm\" novalidate name=\"profileForm\" ng-submit=\"submit(profileForm.$valid, data)\">\n\n  <div class=\"modal-body profile\">\n\n  <section>\n    <section style=\"height:40px\">\n     <p ng-if=\"!session.email\"><i>{{ avatarQuestion }}</i> <span ng-if=\"!session.email\">Enter your email address to fix your avatar.</span></p>\n     <p ng-if=\"session.email\">Save your name and password to get $10 credit.</p>\n\n    </section>\n\n    <section class=\"avatar\">\n      <img class=\"avatar\" ng-src=\"{{session.avatar}}?s=230\" title=\"Avatars are gravtars generated from your email.\" />\n      <p style=\"font-size:12px\">\n        <span ng-if=\"session.email\">Update the <b><a href=\"http://www.gravatar.com/\" target=\"_blank\">gravatar</a></b> for <br />{{ session.email }}</span>\n        <span ng-if=\"!session.email\">Enter an email address</span>\n        <br /> to change your profile pic.\n      </p>\n      <!-- <hr />\n      <label>Account Credit</label> <b style=\"font-size:26px;color:black\">$10</b> <br />available when you sign up -->\n\n    </section>\n\n    <section class=\"google\">\n    \tHate signup forms and remembering passwords? <br /><br /><a href=\"/v1/auth/google\" target=\"_self\"><b>Sign in with your Google account instead</b></a>.\n    </section>\n\n    <section class=\"info\">\n\n      <div form-group>\n        <label class=\"control-label\" for=\"signupEmail\">Email</label>\n        <input id=\"signupEmail\" name=\"email\" form-control type=\"email\" placeholder=\"Primary contact email\" ng-model=\"data.email\" ng-blur=\"updateEmail(profileForm.email)\" required tabindex=\"1\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.email)\" ng-messages=\"profileForm.email.$error\">\n          <div ng-message=\"required\">Email required</div>\n          <div ng-message=\"email\">Invalid email</div>\n        </div>\n        <span class=\"error\">{{ emailChangeFailed }}</span>\n      </div>\n\n      <div form-group ng-if=\"session.email\">\n        <label class=\"control-label\" for=\"sessionName\">Full name </label>\n        <input id=\"signupName\" name=\"name\" form-control type=\"text\" placeholder=\"Full name\" ng-model=\"data.name\" required ng-minlength=\"4\" ng-minlength=\"60\" ng-pattern=\"/\\w+ \\w+/\" tabindex=\"2\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.name)\" ng-messages=\"profileForm.name.$error\">\n          <div ng-message=\"required\">Name required</div>\n          <div ng-message=\"minlength\">Full name required (e.g. John Smith)</div>\n          <div ng-message=\"pattern\">Full name required (e.g. John Smith)</div>\n          <div ng-message=\"maxlength\">Full name max length 60 chars</div>\n        </div>\n      </div>\n\n      <div form-group ng-if=\"data.name\">\n        <label class=\"control-label\" for=\"signupPassword\">Password </label>\n        <input id=\"signupPassword\" name=\"password\" form-control type=\"password\" placeholder=\"Password\" ng-model=\"data.password\" required ng-minlength=\"5\" ng-maxlength=\"10\" tabindex=\"3\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.password)\" ng-messages=\"profileForm.password.$error\">\n          <div ng-message=\"required\">Password required</div>\n          <div ng-message=\"minlength\">Password min length 5 chars</div>\n          <div ng-message=\"maxlength\">Password max length 10 chars</div>\n        </div>\n      </div>\n\n    </section>\n\n  </section>\n\n  </div>\n\n  <div class=\"modal-footer profile\">\n    <button type=\"submit\" class=\"btn btn-primary\">Create account</button>\n    <span class=\"error\">{{ signupFail }}</span>\n  </div>\n\n\n</form>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/share.html":[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\">\n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>\n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>\n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>\n</div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/share.js":[function(require,module,exports){
"use strict";
angular.module("APShare", ['angularLoad']).directive('apShare', function(angularLoad) {
  var src = ('https:' == document.location.protocol ? 'https://s' : 'http://i') + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true&init=lazy';
  var ngLoadPromise = angularLoad.loadScript(src);
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

//# sourceMappingURL=<compileOutput>


},{"./share.html":"/Users/matias/Sites/airpair.com/public/common/directives/share.html"}],"/Users/matias/Sites/airpair.com/public/common/directives/sideNav.html":[function(require,module,exports){
module.exports = "<header>\n  <img id=\"sideNavToggle\" track-click=\"SideNav\" data=\"{{ toggleAction }}\" track-click-if=\"!session._id\" ng-click=\"sideNav.toggle()\" src=\"/v1/img/css/sidenav/toggle.png\" />\n</header>\n\n<section class=\"welcome\" ng-if=\"session.authenticated == false\">\n\n  <figure><a id=\"navWelcomeAvatar\" track-click=\"SideNav\" ng-click=\"openProfile()\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}\" /></a></figure>\n\n  <ul class=\"main\">\n    <li ng-if=\"!session.email\">Want your real face?</li>\n    <li ng-if=\"!session.email\"><a id=\"navEditProfile\" href=\"#\" track-click=\"SideNav\" ng-click=\"openProfile()\">Edit your profile</a></li>\n    <li ng-if=\"session.email\">Get $10 credit?</li>\n    <li ng-if=\"session.email\"><a id=\"navEditProfile\" href=\"#\" track-click=\"SideNav\" ng-click=\"openProfile()\">Finish your profile</a></li>\n    <li>Already in the tribe?</li>\n    <li><a id=\"navLogin\" href=\"/v1/auth/login\" track-click=\"SideNav\">Login</a></li>\n    <li>Why join?</li>\n  </ul>\n  <a id=\"navAbout\" track-click=\"SideNav\" href=\"/about\" class=\"icon\">\n    <span>Read about AirPair</span><img src=\"/v1/img/css/sidenav/airpair.png\" />\n  </a>\n</section>\n\n\n<section ng-if=\"session._id\">\n  <figure><a href=\"/me\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}?s=120\" /></a></figure>\n</section>\n\n<section class=\"main\" ng-if=\"session._id\"> <label>{{ session.name.split(' ')[0] }}</label>\n  <ul>\n    <li><a href=\"/dashboard\" target=\"_self\">dashboard</a></li>\n    <li><a href=\"/find-an-expert\" target=\"_self\">get help</a></li>\n    <li><a href=\"mailto:team@airpair.com?Subject=Bug spotted!\" target=\"_blank\">see a bug?</a></li>\n    <!-- <li><a href=\"/\" target=\"_self\">dashboard (old)</a></li> -->\n    <li><a href=\"/billing\">billing</a></li>\n    <!-- <li><a href=\"#\">airpairs</a></li> -->\n    <!-- <li><a href=\"#\">settings</a></li> -->\n    <li><a href=\"/v1/auth/logout\" target=\"_self\">logout</a></li>\n  </ul>\n</section>\n\n\n<section class=\"stack\"> <label>Stack</label>\n  <ul>\n    <li ng-repeat=\"tag in session.tags | orderBy:'sort'\">\n      <a ng-if=\"tag.slug != 'angularjs'\" href=\"/posts/tag/{{tag.slug}}\">{{tag.name}}</a>\n      <a ng-if=\"tag.slug == 'angularjs'\" href=\"/angularjs\" target=\"_self\">{{tag.name}}</a>\n    </li>\n  </ul>\n  <a id=\"navStackToggle\" track-click=\"SideNav\" href=\"#\" ng-click=\"openStack()\" class=\"icon\">\n    <span>Customize</span><img src=\"/v1/img/css/sidenav/stack.png\" /><i>{{ session.tags.length || 0 }}</i>\n  </a>\n</section>\n\n\n<section class=\"bookmarks\"> <label>Bookmarks</label>\n  <ul class=\"bookmarks\">\n    <li ng-repeat=\"bookmark in session.bookmarks | orderBy:'sort'\">\n      <a href=\"{{bookmark.url}}\" target=\"_self\">{{bookmark.title}}</a>\n    </li>\n  </ul>\n  <a id=\"navBookmarksToggle\" track-click=\"SideNav\" href=\"#\" ng-click=\"openBookmarks()\" class=\"icon\"><span> Manage </span> <img src=\"/v1/img/css/sidenav/bookmark.png\" /><i>{{ session.bookmarks.length || 0 }}</i></a>\n</section>\n\n<div stack></div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/sideNav.js":[function(require,module,exports){
"use strict";
var Validate = require('../../../shared/validation/users.js');
function storage(k, v) {
  if (window.localStorage) {
    if (typeof v == 'undefined') {
      return localStorage[k];
    }
    localStorage[k] = v;
    return v;
  }
}
angular.module("APSideNav", ['ui.bootstrap', 'APSvcSession', 'APTagInput']).directive('sideNav', ['$rootScope', '$modal', 'SessionService', function($rootScope, $modal, SessionService) {
  return {
    template: require('./sideNav.html'),
    link: function(scope, element, attrs) {
      SessionService.onAuthenticated((function(session) {
        return scope.tracking = (session._id) ? false : true;
      }));
    },
    controllerAs: 'sideNav',
    controller: function($scope, $element, $attrs) {
      this.toggle = function() {
        if (storage('sideNavOpen') == 'true')
          storage('sideNavOpen', 'false');
        else
          storage('sideNavOpen', 'true');
        $element.toggleClass('collapse', storage('sideNavOpen') == 'false');
        $scope.toggleAction = (storage('sideNavOpen') != 'true') ? 'Show' : 'Hide';
      };
      $element.toggleClass('collapse', storage('sideNavOpen') != 'true');
      $scope.toggleAction = (storage('sideNavOpen') != 'true') ? 'Show' : 'Hide';
      $scope.openStack = function() {
        var modalInstance = $modal.open({
          template: require('./stack.html'),
          controller: "StackCtrl",
          size: 'lg'
        });
      };
      $scope.tags = (function() {
        return $scope.session ? $scope.session.tags : null;
      });
      $scope.updateTags = (function(scope, newTags) {
        if (!$scope.session)
          return;
        $scope.session.tags = newTags;
        SessionService.tags(newTags, scope.sortSuccess, scope.sortFail);
      });
      $scope.bookmarks = (function() {
        return $scope.session ? $scope.session.bookmarks : null;
      });
      $scope.updateBookmarks = (function(scope, newBookmarks) {
        if (!$scope.session)
          return;
        $scope.session.bookmarks = newBookmarks;
        SessionService.bookmarks(newBookmarks, scope.sortSuccess, scope.sortFail);
      });
      $scope.selectTag = function(tag) {
        var tags = $scope.session.tags;
        if (_.contains(tags, tag))
          $scope.session.tags = _.without(tags, tag);
        else
          $scope.session.tags = _.union(tags, [tag]);
        SessionService.updateTag(tag, angular.noop, (function(e) {
          return alert(e.message);
        }));
      };
      $scope.deselectTag = (function(tag) {
        $scope.session.tags = _.without($scope.session.tags, tag);
        SessionService.updateTag(tag, angular.noop, (function(e) {
          return alert(e.message);
        }));
      });
      $scope.deselectBookmark = (function(bookmark) {
        $scope.session.bookmarks = _.without($scope.session.bookmarks, bookmark);
        SessionService.bookmarks($scope.session.bookmarks);
      });
      $scope.openBookmarks = function() {
        var modalInstance = $modal.open({
          template: require('./bookmarks.html'),
          controller: "BookmarksCtrl",
          size: 'lg'
        });
      };
      var self = this;
      $rootScope.openProfile = function() {
        var modalInstance = $modal.open({
          template: require('./profile.html'),
          controller: 'ProileCtrl as ProileCtrl',
          size: 'lg'
        });
      };
    }
  };
}]).directive('sortable', ['SessionService', function(SessionService) {
  return {link: function(scope, element, attrs) {
      $(element).sortable({stop: function(event, ui) {
          var list = scope[attrs['get']]();
          var elems = $(element).children();
          for (var i = 0; i < elems.length; i++) {
            var elem = $(elems[i]);
            var obj = _.find(list, (function(t) {
              return t._id === elem.data('id');
            }));
            obj.sort = i;
          }
          scope[attrs['set']](scope, list);
        }});
      $(element).disableSelection();
    }};
}]).controller('StackCtrl', ['$scope', '$modalInstance', '$window', 'SessionService', function($scope, $modalInstance, $window, SessionService) {
  $scope.sortSuccess = function() {};
  $scope.sortFail = function() {};
  $scope.ok = (function() {
    return $modalInstance.close();
  });
  $scope.cancel = (function() {
    return $modalInstance.dismiss('cancel');
  });
}]).controller('BookmarksCtrl', ['$scope', '$modalInstance', '$window', 'SessionService', function($scope, $modalInstance, $window, SessionService) {
  $scope.sortSuccess = function() {};
  $scope.sortFail = function() {};
  $scope.ok = (function() {
    return $modalInstance.close();
  });
  $scope.cancel = (function() {
    return $modalInstance.dismiss('cancel');
  });
}]).controller('ProileCtrl', ['$scope', '$rootScope', '$modalInstance', '$window', '$timeout', 'SessionService', function($scope, $rootScope, $modalInstance, $window, $timeout, SessionService) {
  $scope.data = {
    email: $scope.session.email,
    name: $scope.session.name
  };
  if (!$scope.session.email) {
    $scope.avatarQuestion = "Aren't you a little short for a storm trooper?";
    var avatar = $scope.session.avatar.replace('/v1/img/css/sidenav/default-', '').replace('.png', '');
    if (avatar == 'cat')
      $scope.avatarQuestion = "That's a nice hair tie...";
    if (avatar == 'mario')
      $scope.avatarQuestion = "Eating a little too many mushrooms aren't we?";
  }
  $scope.updateEmail = function(model) {
    if (!model.$valid)
      return;
    $scope.emailChangeFailed = "";
    SessionService.changeEmail({email: $scope.data.email}, (function(result) {
      analytics.track('Save', {
        type: 'email',
        email: result.email
      });
      $scope.data.email = result.email;
      $timeout((function() {
        angular.element('#signupName').trigger('focus');
      }), 40);
    }), (function(e) {
      $scope.emailChangeFailed = e.message;
      $scope.data.email = null;
    }));
  };
  $scope.submit = (function(formValid, data) {
    if (formValid) {
      SessionService.signup(data, (function(result) {}), (function(e) {
        return $scope.signupFail = e.error;
      }));
    }
  });
  $scope.cancel = (function() {
    return $modalInstance.dismiss('cancel');
  });
}]);
;

//# sourceMappingURL=<compileOutput>


},{"../../../shared/validation/users.js":"/Users/matias/Sites/airpair.com/shared/validation/users.js","./bookmarks.html":"/Users/matias/Sites/airpair.com/public/common/directives/bookmarks.html","./profile.html":"/Users/matias/Sites/airpair.com/public/common/directives/profile.html","./sideNav.html":"/Users/matias/Sites/airpair.com/public/common/directives/sideNav.html","./stack.html":"/Users/matias/Sites/airpair.com/public/common/directives/stack.html"}],"/Users/matias/Sites/airpair.com/public/common/directives/stack.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Customize AirPair to your Stack</h3>\n</div>\n<div class=\"modal-body stack\">\n\n  <p>Personalize AirPair content, by selecting technologies that make up your stack.</p>\n\n  <div tag-input></div>\n\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/tagInput.html":[function(require,module,exports){
module.exports = "<div class=\"form-group tag-input-group\">\n  <div class=\"nomobile\">This feature is not available on mobile</div>\n\n  <div class=\"drag\">\n    <p>\n      <b>drag in order of importance</b>\n      <br />place most used first\n    </p>\n  </div>\n  <div class=\"selected\">\n    <label for=\"tagInput\">Your stack</label>\n\n    <ul class=\"tags\" sortable get='tags' set='updateTags'>\n      <li ng-repeat=\"tag in tags() | orderBy:'sort'\" ng-attr-data-id=\"{{tag._id}}\">\n        {{tag.slug}}\n        <a class=\"remove\" ng-click=\"deselectMatch(tag)\">x</a>\n        <a class=\"order\" href=\"#\"></a>\n      </li>\n    </ul>\n\n    <p ng-if=\"!tags() || tags().length == 0\">No tags selected yet.</p>\n  </div>\n\n  <label for=\"tagInput\">Search technologies</label>\n  <input type=\"text\" class=\"tagInput form-control\"\n    placeholder=\"type a technology (e.g. javascript)\"\n    ng-model=\"q\"\n    typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\"\n    typeahead-editable=\"false\"\n    typeahead-input-formatter=\"keypressSelect($model)\" tabindex=\"100\"\n    typeahead-template-url=\"tagMatch.html\"\n    >\n  <!-- typeahead-loading=\"loading\"\n  <i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\n   -->\n</div>\n\n<script type=\"text/ng-template\" id=\"tagMatch.html\">\n  <div>\n    <a class=\"tagSelect\">\n      <span bind-html-unsafe=\"match.model.slug | typeaheadHighlight:query\"></span>\n      <p bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></p>\n    </a>\n  </div>\n</script>\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/tagInput.js":[function(require,module,exports){
"use strict";
angular.module('APTagInput', ['ui.bootstrap']).value('badTagsSearchQuery', function(value) {
  var lengthOk = value && (value.length >= 2 || /r/i.test(value));
  var regexMatch = /\[|\]|\{|\}/g.test(value);
  var searchBad = !lengthOk || regexMatch;
  angular.element('.tag-input-group').toggleClass('has-error', searchBad);
  return searchBad;
}).directive('tagInput', ['badTagsSearchQuery', function(badTagsSearchQuery) {
  return {
    restrict: 'EA',
    template: require('./tagInput.html'),
    scope: {},
    controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
      $scope.tags = $scope.$parent.tags;
      $scope.selectTag = $scope.$parent.selectTag;
      $scope.deselectTag = $scope.$parent.deselectTag;
      $scope.updateTags = $scope.$parent.updateTags;
      $scope.sortSuccess = $scope.$parent.sortSuccess;
      $scope.sortFail = $scope.$parent.sortFail;
      $scope.templateUrl = "tagMatch.html";
      $scope.getTags = function(q) {
        if (badTagsSearchQuery(q)) {
          return [];
        }
        q = encodeURIComponent(q);
        return $http.get('/v1/api/tags/search/' + q).then(function(res) {
          var tags = [];
          angular.forEach(res.data, function(item) {
            tags.push(item);
          });
          $scope.matches = tags;
          return tags;
        });
      };
      $scope.keypressSelect = function(val) {
        if (!val || $scope.matches.length == 0)
          return null;
        $scope.selectMatch(0);
      };
      $scope.selectMatch = function(index) {
        var tag = $scope.matches[index];
        $scope.selectTag(tag);
        $scope.q = "";
      };
      $scope.deselectMatch = function(match) {
        $scope.deselectTag(match);
      };
    }]
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./tagInput.html":"/Users/matias/Sites/airpair.com/public/common/directives/tagInput.html"}],"/Users/matias/Sites/airpair.com/public/common/directives/userInput.html":[function(require,module,exports){
module.exports = "<script type=\"text/ng-template\" id=\"userMatch.html\">\n  <div>\n    <a class=\"userSelect\">\n      <img ng-src=\"{{match.model.avatar}}\" />\n      <span bind-html-unsafe=\"match.model.name | typeaheadHighlight:query\"></span>\n      <p bind-html-unsafe=\"match.model.username | typeaheadHighlight:query\"></p>\n    </a>\n  </div>\n</script>\n\n<div class=\"form-group user-input-group\">\n  {{post.by.name}}\n  <div class=\"selected\">\n    <img ng-src=\"{{post.by.avatar}}\" />\n  </div>\n\n  <input type=\"text\" class=\"userInput form-control\"\n    placeholder=\"type a name (e.g. John Smith)\"\n    ng-model=\"q\"\n    typeahead=\"u as u for u in getUsers($viewValue) | filter:$viewValue\"\n    typeahead-editable=\"false\"\n    typeahead-input-formatter=\"keypressSelect($model)\"\n    typeahead-template-url=\"userMatch.html\">\n\n</div>\n\n";

},{}],"/Users/matias/Sites/airpair.com/public/common/directives/userInput.js":[function(require,module,exports){
"use strict";
angular.module('APUserInput', ['ui.bootstrap']).value('badUserSearchQuery', function(value) {
  var lengthOk = value && (value.length >= 2);
  var searchBad = !lengthOk;
  angular.element('.user-input-group').toggleClass('has-error', searchBad);
  return searchBad;
}).directive('userInput', ['badUserSearchQuery', function(badUserSearchQuery) {
  return {
    restrict: 'EA',
    template: require('./userInput.html'),
    scope: {},
    controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
      $scope.selectUser = $scope.$parent.selectUser;
      $scope.templateUrl = "userMatch.html";
      $scope.getUsers = function(q) {
        if (badUserSearchQuery(q))
          return [];
        return $http.get('/v1/api/adm/users/search/' + q).then(function(res) {
          var results = [];
          angular.forEach(res.data, function(item) {
            results.push(item);
          });
          $scope.matches = results;
          return results;
        });
      };
      $scope.selectMatch = function(index) {
        var user = $scope.matches[index];
        $scope.selectUser(user);
      };
      $scope.keypressSelect = function(val) {
        if (!val || $scope.matches.length == 0)
          return null;
        $scope.selectMatch(val);
      };
    }]
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./userInput.html":"/Users/matias/Sites/airpair.com/public/common/directives/userInput.html"}],"/Users/matias/Sites/airpair.com/public/common/filters/filters.js":[function(require,module,exports){
"use strict";
var util = require('../../../shared/util.js');
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
      displayFormat = displayFormat || 'ddd, MMM Do ha';
      var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(displayFormat);
      return result.replace(offset, '');
    } else {
      return 'Confirming time';
    }
  });
}).filter('objectIdToDate', function() {
  return (function(id, displayFormat) {
    displayFormat = displayFormat || 'MMM DD';
    return moment(util.ObjectId2Date(id)).format(displayFormat);
  });
}).filter('agoTime', function() {
  return (function(date) {
    return moment(date).fromNow();
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

//# sourceMappingURL=<compileOutput>


},{"../../../shared/util.js":"/Users/matias/Sites/airpair.com/shared/util.js"}],"/Users/matias/Sites/airpair.com/public/common/models/postsService.js":[function(require,module,exports){
"use strict";
var headings = [];
var lazyErrorCb = function(resp) {};
angular.module('APSvcPosts', []).constant('API', '/v1/api').factory('mdHelper', function mdHelperFactory() {
  this.headingsChanged = function(md) {
    var prevHeadings = headings;
    headings = md.match(/\n##.*/g) || [];
    var changed = prevHeadings.length != headings.length;
    if (!changed) {
      for (var i = 0; i < headings.length; i++) {
        if (prevHeadings[i] != headings[i]) {
          return true;
        }
      }
    }
    return changed;
  };
  return this;
}).service('PostsService', ['$http', 'API', 'mdHelper', function($http, API, mdHelper) {
  this.getById = function(id, success) {
    $http.get((API + "/posts/" + id)).success(success).error(lazyErrorCb);
  };
  this.getByUsername = function(username, success) {
    $http.get((API + "/posts/by/" + username)).success(success).error(lazyErrorCb);
  };
  this.getMyPosts = function(success) {
    $http.get((API + "/posts/me")).success(success).error(lazyErrorCb);
  };
  this.getRecentPosts = function(success) {
    $http.get((API + "/posts/recent")).success(success).error(lazyErrorCb);
  };
  this.getTagsPosts = function(tagSlug, success) {
    $http.get((API + "/posts/tag/" + tagSlug)).success(success).error(lazyErrorCb);
  };
  this.getToc = function(md, success) {
    if (mdHelper.headingsChanged(md)) {
      $http.post((API + "/posts-toc"), {md: md}).success(success).error(lazyErrorCb);
    }
  };
  this.create = function(data, success) {
    $http.post((API + "/posts"), data).success(success).error(lazyErrorCb);
  };
  this.update = function(data, success) {
    $http.put((API + "/posts/" + data._id), data).success(success).error(lazyErrorCb);
  };
  this.publish = function(data, success) {
    $http.put((API + "/posts/publish/" + data._id), data).success(success).error(lazyErrorCb);
  };
  this.delete = function(_id, success) {
    $http.delete((API + "/posts/" + _id)).success(success).error(lazyErrorCb);
  };
}]);

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/public/common/models/sessionService.js":[function(require,module,exports){
"use strict";
angular.module('APSvcSession', []).constant('API', '/v1/api').constant('Auth', '/v1/auth').service('SessionService', ['$rootScope', '$http', 'API', 'Auth', '$cacheFactory', function($rootScope, $http, API, Auth, $cacheFactory) {
  var cache;
  this.getSession = function() {
    cache = cache || $cacheFactory();
    return $http.get((API + "/session/full"), {cache: cache}).then(function(response) {
      return response.data;
    });
  };
  var setScope = (function(successFn) {
    return function(result) {
      $rootScope.session = result;
      successFn(result);
    };
  });
  this.onAuthenticated = function(fn) {
    return this.getSession().then(fn);
  };
  this.onUnauthenticated = function(fn) {
    return this.getSession().then(null, fn);
  };
  this.flushCache = function() {
    cache = null;
  };
  this.login = function(data, success, error) {
    $http.post((Auth + "/login"), data).success(setScope(success)).error(error);
  };
  this.signup = function(data, success, error) {
    $http.post((Auth + "/signup"), data).success(setScope(success)).error(error);
  };
  this.changeEmail = function(data, success, error) {
    $http.put((API + "/users/me/email"), data).success(setScope(success)).error(error);
  };
  this.verifyEmail = function(data, success, error) {
    $http.put((API + "/users/me/email-verify"), data).success(setScope(success)).error(error);
  };
  this.updateTag = function(data, success, error) {
    $http.put((API + "/users/me/tag/" + data.slug), {}).success(setScope(success)).error(error);
  };
  this.updateBookmark = function(data, success, error) {
    $http.put((API + "/users/me/bookmarks/" + data.type + "/" + data.objectId), {}).success(setScope(success)).error(error);
  };
  this.updateProfile = function(data, success, error) {
    $http.put((API + "/users/me"), data).success(setScope(success)).error(error);
  };
  this.requestPasswordChange = function(data, success, error) {
    $http.put((API + "/users/me/password-change"), data).success(success).error(error);
  };
  this.changePassword = function(data, success, error) {
    $http.put((API + "/users/me/password"), data).success(success).error(error);
  };
  this.tags = function(data, success, error) {
    $http.put((API + "/users/me/tags"), data).success(success).error(error);
  };
  this.bookmarks = function(data, success, error) {
    $http.put((API + "/users/me/bookmarks"), data).success(success).error(error);
  };
}]);

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/public/common/pageHelpers.js":[function(require,module,exports){
"use strict";
window.pageHlpr = {};
var getHighlightConfig = function(elm) {
  var cfg = {};
  var prevSibling = elm.previousSibling;
  var nodeValue = null;
  while (prevSibling && prevSibling.nodeType !== 1) {
    if (prevSibling.nodeType === 8) {
      nodeValue = prevSibling.nodeValue;
    }
    prevSibling = prevSibling.previousSibling;
  }
  if (nodeValue) {
    var lang = nodeValue.match(/lang=\w+/i);
    if (lang) {
      cfg.lang = lang[0].replace('lang=', '');
    }
    var linenums = (nodeValue.match(/linenums=true+/i) || [])[0];
    if (linenums) {
      cfg.linenums = true;
    }
  }
  return cfg;
};
window.pageHlpr.highlightSyntax = function(opts) {
  var elements = document.querySelectorAll('pre > code');
  for (var i = 0,
      element; element = elements[i++]; ) {
    var config = getHighlightConfig(element.parentNode);
    if (!config || !config.lang) {
      return;
    }
    if (config.linenums) {
      element.parentNode.className = 'line-numbers';
    }
    element.className = 'language-' + config.lang;
    Prism.highlightElement(element, false, function() {
      if (opts && opts.addCtrs) {
        element.outerHTML += '<footer>Get expert <a class="trackPostCTA" href="/find-an-expert?utm_source=airpair.com&utm_campaign=posts-{{campPeriod}}&utm_content={{viewData.slug}}&utm_medium=website&utm_term=' + config.lang + '">' + config.lang + ' help</a></footer>';
      }
    });
  }
};
window.pageHlpr.loadPoSt = function() {
  window.pwidget_config = {
    shareQuote: false,
    afterShare: false
  };
  var p = document.createElement('script');
  p.type = 'text/javascript';
  p.async = true;
  p.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i') + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(p, x);
};
window.pageHlpr.fixNavs = function(elmId) {
  var scrollingOn = $(document).width() > 900;
  var offset = 40;
  var fix = function(e) {
    if (window.scrollY < offset) {
      $(elmId).css('top', offset - window.scrollY);
    } else if (scrollingOn) {
      $(elmId).css('top', 0);
    }
  };
  $(window).scroll(fix);
  fix();
};
var fixRailElements = function(e) {
  var scrollingOn = $(document).width() > 900;
  var offset = $('.railCTA1Holder').offset().top;
  if (scrollingOn) {
    if (window.scrollY < offset) {
      $('.rail1CTA').css('top', offset - window.scrollY);
      $('.share').css('top', 0);
      $('#table-of-contents').css('top', 0);
      $('#table-of-contents + ul').css('top', 0);
    } else {
      $('.rail1CTA').css('top', 0);
      $('.share').css('top', window.scrollY - 170);
      $('#table-of-contents').css('top', window.scrollY - 180);
      $('#table-of-contents + ul').css('top', window.scrollY - 180);
    }
  } else {
    if (window.scrollY < (offset + 100)) {
      $('.rail1CTA').css('top', offset + 10 - window.scrollY);
      $('.rail1CTA').toggle(true);
    } else
      $('.rail1CTA').toggle(false);
  }
};
window.pageHlpr.fixPostRail = function() {
  $(window).scroll(fixRailElements);
  fixRailElements();
};
window.pageHlpr.animateSelectedBookmark = function(bookmarkElm, destinationElm) {
  bookmarkElm.css({});
};

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/public/common/routes/helpers.js":[function(require,module,exports){
(function (global){
"use strict";
(function() {
  var self = {};
  self.resolveSession = function(args) {
    return ['SessionService', '$window', '$location', '$q', function(SessionService, $window, $location, $q) {
      return SessionService.getSession().then(function(data) {
        if (data._id) {
          return data;
        } else {
          $location.path('/v1/auth/login');
          return $q.reject();
        }
      }, function() {
        $location.path('/v1/auth/login');
        return $q.reject();
      });
    }];
  };
  global.trackRoute = function(locationPath) {
    if (analytics) {
      if (locationPath == '/v1/auth/login') {
        analytics.track('Route', {
          category: 'auth',
          name: 'login'
        });
      } else if (locationPath == '/v1/auth/signup') {
        analytics.track('Route', {
          category: 'auth',
          name: 'signup'
        });
      }
    }
  };
  function resolveHelper(deps, extend) {
    deps = deps || [];
    extend = extend || {};
    angular.forEach(deps, function(entry) {
      var args,
          dep = entry;
      if (angular.isArray(entry)) {
        dep = entry[0];
        args = entry[1];
      }
      var fnName = 'resolve' + dep.charAt(0).toUpperCase() + dep.substr(1);
      var fn = self[fnName](args);
      extend[dep] = fn;
    });
    return extend;
  }
  module.exports = {
    resolveHelper: resolveHelper,
    trackRoute: trackRoute
  };
})();

//# sourceMappingURL=<compileOutput>


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/matias/Sites/airpair.com/public/home.html":[function(require,module,exports){
module.exports = "<header>AirPair v1 <code>Build 1.08</code> Deployed Oct 31</header>\n<section id=\"index\">\n<h1>Welcome to AirPair v1</h1>\n\n<img src=\"/v1/img/pages/index/ap-v1-screenshot-1.png\" class=\"screenshot\" />\n\n\n<p>** We're migrating over to a brand new site</p>\n<p>Check back every week as we replace the old bits with shiny new mobile responsive <b>AirPair v1</b> parts.</p>\n\n<h4>See a bug?</h4>\n<p>Log issues via our <b><a href=\"https://github.com/airpair/airpair-com-v1-issue-tracker\" target=\"_blank\">issue tracking repo</a></b> on github.</p>\n\n<h4>Become a v1 beta tester?</h4>\n<p>Want to get notified of new releases, give feedback and help squash bugs? <a href=\"http://twitter.com/home?status=@hackerpreneur I would love to be a beta tester for the new ap\" target=\"_blank\">Tweet at @hackerpreneur</a> </p>\n\n<h3>Looking for help software?</h3>\n<a href=\"/finde-an-expert\" target=\"_self\" class=\"btn\">Find an AirPair expert</a>\n\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/posts/author.html":[function(require,module,exports){
module.exports = "<header><a href=\"/posts\">Posts</a> > Author</header>\n<section id=\"posts\">\n  <div id=\"author\" ng-attr-class=\"{{preview.mode}}\">\n\n    <div class=\"editor\" ap-post-editor=\"\"></div>\n\n    <hr />\n\n    <div id=\"preview\" ap-post=\"\"></div>\n\n    <div id=\"tips\">\n\n      <div ng-if=\"post._id\">\n        <h6>Tips</h6>\n        <ul>\n          <li>Use h2 (##) and lower (###) for headings in your markdown (title is already the h1).</li>\n          <li>Prefix your headings with number like 1 1.1 1.2 2 etc.</li>\n          <li>Scroll to the part of your post you're interested in while you edit.</li>\n          <li>Submit your post by email to have it review and published by an editor.</li>\n          <li>Code blocks require a comments (e.g. <code>&lt;!--code lang=coffeescript linenums=true--&gt;</code> followed by a line break, to indicate language and optionally show line numbers.\n          </li>\n          <li>escape characters with <code>\\</code> to render them non markdown, e.g. for a list bullet you might <code>- \\-</code></li>\n        </ul>\n      </div>\n    </div>\n\n  </div>\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/posts/editor.html":[function(require,module,exports){
module.exports = "<div class=\"md\" ng-if=\"post._id\">\n  <div class=\"form-group\">\n    <label>Markdown <span>see <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\">markdown guide</a><span></label>\n      <textarea id=\"markdownTextarea\" ng-model=\"post.md\" class=\"form-control\" ng-model-options=\"{ updateOn: 'default blur', debounce: { blur: 0, default: (post.md.length * 10) }}\"></textarea>\n  </div>\n\n  <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">\n    <div class=\"form-group\">\n      <label>Tags </label>\n      <div tag-input=\"\"></div>\n    </div>\n    <div class=\"form-group\">\n      <label>Slug url</label>\n      <input ng-model=\"post.slug\" type=\"text\" class=\"form-control\" />\n    </div>\n\n    <div class=\"posts\"><ap-post-list-item post=\"post\"></ap-post-list-item></div>\n  </div>\n\n</div>\n\n<div class=\"meta\">\n  <div class=\"form-group\">\n    <label>Title</label>\n    <input ng-model=\"post.title\" type=\"text\" class=\"form-control\" placeholder=\"Type post title ...\" />\n  </div>\n  <div class=\"form-group\">\n    <label>Author bio</label>\n    <input ng-model=\"post.by.bio\" type=\"text\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <label>Feature media <span ng-show=\"post.title && post.by.bio\">\n    <a href ng-click=\"exampleImage()\">image url</a>\n    or <a href ng-click=\"exampleYouTube()\">youtu.be url</a></span></label>\n    <input ng-model=\"post.assetUrl\" type=\"text\" class=\"form-control\" />\n  </div>\n\n  <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">\n    <div class=\"form-group\">\n      <label>Author username</label>\n      <input ng-model=\"post.by.username\" type=\"text\" class=\"form-control\" />\n    </div>\n    <div class=\"form-group\">\n      <label>Meta</label>\n      <input ng-model=\"post.meta.title\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n      <input ng-model=\"post.meta.description\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n      <input ng-model=\"post.meta.canonical\" type=\"text\" class=\"form-control\" placeholder=\"canonical url\" />\n    </div>\n    <div class=\"form-group\">\n      <label>Open Graph</label>\n      <input ng-model=\"post.meta.ogTitle\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n      <input ng-model=\"post.meta.ogDescription\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n      <input ng-model=\"post.meta.ogType\" type=\"text\" class=\"form-control\" placeholder=\"type\"/>\n      <input ng-model=\"post.meta.ogImage\" type=\"text\" class=\"form-control\" placeholder=\"image\" />\n      <input ng-model=\"post.meta.ogVideo\" type=\"text\" class=\"form-control\" placeholder=\"video\" />\n      <input ng-model=\"post.meta.ogUrl\" type=\"text\" class=\"form-control\" placeholder=\"url\" />\n    </div>\n  </div>\n\n  <div class=\"dates\" ng-if=\"post.created\">\n    <div class=\"form-group\" ng-if=\"preview.mode == 'publish'\">\n      <label>Override Publish Date</label>\n      <input ng-model=\"post.publishedOverride\" type=\"text\" class=\"form-control\" ng-click=\"setPublishedOverride()\" />\n    </div>\n\n    <section>\n      <label>Created</label> <span>{{ post.created | publishedTime }}</span>\n      <label>Updated</label> <span>{{ post.updated | publishedTime }}</span>\n      <label>Published</label> <span>{{ post.published | publishedTime }}</span>\n      <label></label> <span>{{ post.publishedBy }}</span>\n    </section>\n  </div>\n\n</div>\n\n<div class=\"form-actions\">\n\n  <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"(!post.title && !post.by.bio) || post.saved\">Save</button>\n  <!-- || post.published todo: put back to stop users editing their own posts -->\n\n<!--   <button class=\"btn btnPreview\" ng-click=\"previewToggle()\" ng-disabled=\"!post._id || (preview.mode == 'publish')\">{{preview.mode == 'edit' && 'Preview' || 'Edit' }}</button>\n -->\n  <a class=\"btn\" target=\"_blank\" href=\"mailto:team@airpair.com?subject=Post%20Submission%20-%20{{post.title}}&body=Can%20you%20look%20at%20and%20publish%20my%20post:%0A%0Ahttps://www.airpair.com/posts/publish/{{ post._id }}%0A%0A{{post.by.name}}\" ng-disabled=\"(!post.title && !post.by.bio) || !post.saved || (preview.mode == 'publish')\">Submit</a>\n\n  <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"!(preview.mode == 'publish')\">Publish</button>\n\n  <button class=\"btn\" ng-click=\"delete()\" ng-disabled=\"(!(preview.mode == 'edit') || post.published) || !post._id\">Delete</button>\n</div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/posts/editor.js":[function(require,module,exports){
"use strict";
var exampleImageUrl = 'http://www.airpair.com/v1/img/css/blog/example2.jpg';
var exampleYoutubeUrl = 'http://youtu.be/qlOAbrvjMBo';
angular.module("APPostEditor", []).directive('apPostEditor', function() {
  return {
    template: require('./editor.html'),
    controller: function($scope, PostsService) {
      $scope.$watch('post.assetUrl', function(value) {
        if (!value) {
          $scope.preview.asset = ("<span>Paste an image url or short link to a youtube movie<br /><br />Example<br /> " + exampleYoutubeUrl + "<br /> " + exampleImageUrl + "</span>");
        } else if (value.indexOf('http://youtu.be/') == 0) {
          var youTubeId = value.replace('http://youtu.be/', '');
          $scope.preview.asset = ("<iframe width=\"640\" height=\"360\" frameborder=\"0\" allowfullscreen=\"\" src=\"//www.youtube-nocookie.com/embed/" + youTubeId + "\"></iframe>");
        } else {
          $scope.preview.asset = ("<img src=\"" + value + "\" />");
        }
      });
      $scope.exampleImage = function() {
        $scope.post.assetUrl = exampleImageUrl;
      };
      $scope.exampleYouTube = function() {
        $scope.post.assetUrl = exampleYoutubeUrl;
      };
      $scope.previewToggle = function() {
        if ($scope.preview.mode == 'edit') {
          $scope.preview.mode = "preview";
        } else {
          $scope.preview.mode = 'edit';
        }
      };
      var firstRender = true;
      $scope.previewMarkdown = function(md, e) {
        if ($scope.post) {
          if (firstRender) {
            firstRender = false;
          } else {
            $scope.post.saved = false;
          }
        }
        if (md) {
          marked(md, function(err, postHtml) {
            if (err)
              throw err;
            $scope.preview.body = postHtml;
          });
          PostsService.getToc(md, function(tocMd) {
            if (tocMd.toc) {
              marked(tocMd.toc, function(err, tocHtml) {
                if (err)
                  throw err;
                tocHtml = tocHtml.substring(4, tocHtml.length - 6);
                $scope.preview.toc = tocHtml;
              });
            }
          });
        }
      };
      $scope.$watch('post.md', $scope.previewMarkdown);
      $scope.tags = (function() {
        return $scope.post ? $scope.post.tags : null;
      });
      $scope.updateTags = (function(scope, newTags) {
        if (!$scope.post) {
          return;
        }
        $scope.post.tags = newTags;
      });
      $scope.selectTag = function(tag) {
        var tags = $scope.post.tags;
        if (_.contains(tags, tag))
          $scope.post.tags = _.without(tags, tag);
        else
          $scope.post.tags = _.union(tags, [tag]);
      };
      $scope.deselectTag = (function(tag) {
        $scope.post.tags = _.without($scope.post.tags, tag);
      });
    }
  };
});

//# sourceMappingURL=<compileOutput>


},{"./editor.html":"/Users/matias/Sites/airpair.com/public/posts/editor.html"}],"/Users/matias/Sites/airpair.com/public/posts/list.html":[function(require,module,exports){
module.exports = "<header>Posts</header>\n\n<section id=\"posts\">\n\n  <section id=\"recent\">\n    <h3>Recent posts<span><a href=\"/posts/all\" target=\"_self\">All posts</a></span></h3>\n    <div class=\"posts recent\">\n      <ap-post-list-item post=\"p\" ng-repeat=\"p in recent\"></ap-post-list-item>\n    </div>\n  </section>\n\n  <section id=\"myposts\">\n    <h3>My Posts</h3>\n    <br />\n    <div class=\"editOptions\">\n      <a href=\"/posts/new\" class=\"btn\">Create new post</a>\n    </div>\n    <div class=\"myposts\" ap-my-posts-list=\"\"></div>\n  </section>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/posts/listTag.html":[function(require,module,exports){
module.exports = "<header>Posts > {{ tag.name }} </header>\n\n<section id=\"posts\">\n\n  <section id=\"recent\">\n    <h3>{{ tag.name }} posts<span><a href=\"/posts\" target=\"_self\">Recent posts</a></span></h3>\n    <div class=\"posts recent\">\n      <ap-post-list-item post=\"p\" ng-repeat=\"p in tagposts\"></ap-post-list-item>\n    </div>\n  </section>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/posts/module.js":[function(require,module,exports){
"use strict";
require('./myPostsList.js');
require('./editor.js');
var resolver = require('./../common/routes/helpers.js').resolveHelper;
angular.module("APPosts", ['ngRoute', 'APFilters', 'APShare', 'APMyPostsList', 'APPostEditor', 'APPost', 'APBookmarker', 'APSvcSession', 'APSvcPosts', 'APTagInput', 'APUserInput']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  var authd = resolver(['session']);
  $routeProvider.when('/posts', {
    template: require('./list.html'),
    controller: 'IndexCtrl as index'
  });
  $routeProvider.when('/posts/new', {
    template: require('./author.html'),
    controller: 'NewCtrl as author',
    resolve: authd
  });
  $routeProvider.when('/posts/edit/:id', {
    template: require('./author.html'),
    controller: 'EditCtrl as author',
    resolve: authd
  });
  $routeProvider.when('/posts/publish/:id', {
    template: require('./publish.html'),
    controller: 'PublishCtrl as author',
    resolve: authd
  });
  $routeProvider.when('/posts/tag/:tagslug', {
    template: require('./listTag.html'),
    controller: 'TagIndexCtrl'
  });
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  SessionService.onAuthenticated((function(session) {
    $rootScope.editor = _.contains(session.roles, 'editor');
  }));
}]).controller('IndexCtrl', ['$scope', 'PostsService', 'SessionService', function($scope, PostsService, SessionService) {
  var self = this;
  PostsService.getRecentPosts(function(result) {
    $scope.recent = result;
  });
  SessionService.onAuthenticated((function(session) {
    PostsService.getMyPosts(function(result) {
      $scope.myposts = result;
    });
  }));
}]).controller('TagIndexCtrl', ['$scope', 'PostsService', '$routeParams', function($scope, PostsService, $routeParams) {
  $scope.tagslug = $routeParams.tagslug;
  PostsService.getTagsPosts($scope.tagslug, function(result) {
    $scope.tag = result.tag;
    $scope.tagposts = result.posts;
  });
}]).controller('NewCtrl', ['$scope', 'PostsService', '$location', 'session', function($scope, PostsService, $location, session) {
  var self = this;
  $scope.preview = {mode: 'edit'};
  $scope.post = {
    md: "Save post to start authoring markdown ... ",
    by: $scope.session
  };
  var social = {};
  if (session.github)
    social.gh = session.github.username;
  if (session.linkedin)
    social.in = session.linkedin.d9YFKgZ7rY;
  if (session.stack)
    social.so = session.stack.link.replace('http://stackoverflow.com', '');
  if (session.twitter)
    social.tw = session.twitter.username;
  if (session.google)
    social.gp = session.google.id;
  $scope.post.by = _.extend(session, social);
  $scope.save = (function() {
    $scope.post.md = "Type markdown ...";
    PostsService.create($scope.post, (function(result) {
      $location.path('/posts/edit/' + result._id);
    }));
  });
}]).controller('EditCtrl', ['$scope', 'PostsService', '$routeParams', '$location', 'session', function($scope, PostsService, $routeParams, $location, session) {
  var self = this;
  $scope.preview = {mode: 'edit'};
  PostsService.getById($routeParams.id, (function(r) {
    $scope.post = _.extend(r, {saved: true});
  }));
  $scope.delete = (function() {
    PostsService.delete($scope.post._id, (function(r) {
      $location.path('/posts');
    }));
  });
  $scope.save = (function() {
    $scope.post.md = angular.element(document.querySelector('#markdownTextarea')).val(), PostsService.update($scope.post, (function(r) {
      $scope.post = _.extend(r, {saved: true});
    }));
  });
}]).controller('PublishCtrl', ['$scope', 'PostsService', '$routeParams', 'session', function($scope, PostsService, $routeParams, session) {
  $scope.post = {tags: []};
  $scope.setPublishedOverride = (function() {
    if (!$scope.post.publishedOverride)
      $scope.post.publishedOverride = $scope.post.published || moment().format();
  });
  $scope.selectUser = (function(user) {
    $scope.post.by = {
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      username: user.username
    };
  });
  PostsService.getById($routeParams.id, (function(r) {
    if (!r.slug)
      r.slug = r.title.toLowerCase().replace(/ /g, '-');
    if (r.meta) {
      $scope.canonical = r.meta.canonical;
      r.url = r.meta.canonical;
    } else {
      r.meta = {
        title: r.title,
        canonical: '',
        ogType: 'article',
        ogTitle: r.title,
        ogImage: r.assetUrl,
        ogVideo: null,
        ogUrl: ''
      };
    }
    if (r.assetUrl && r.assetUrl.indexOf('http://youtu.be/') == 0) {
      var youTubeId = r.assetUrl.replace('http://youtu.be/', '');
      r.meta.ogImage = ("http://img.youtube.com/vi/" + youTubeId + "/hqdefault.jpg");
    }
    $scope.post = _.extend(r, {saved: false});
    $scope.$watch('post.meta.canonical', (function(value) {
      return $scope.post.meta.ogUrl = value;
    }));
  }));
  $scope.$watch('post.tags', function(value) {
    if (value.length > 0 && !$scope.post.published)
      $scope.post.meta.canonical = ("http://www.airpair.com/" + $scope.post.tags[0].slug + "/posts/" + $scope.post.slug);
  });
  $scope.save = (function() {
    $scope.post.meta.ofUrl = $scope.post.meta.canonical;
    PostsService.publish($scope.post, (function(r) {
      r.url = r.meta.canonical;
      $scope.post = _.extend(r, {saved: true});
    }));
  });
  $scope.tags = (function() {
    return $scope.post ? $scope.post.tags : null;
  });
  $scope.updateTags = (function(scope, newTags) {
    if (!$scope.post) {
      return;
    }
    $scope.post.tags = newTags;
  });
  $scope.selectTag = function(tag) {
    var tags = $scope.post.tags;
    if (_.contains(tags, tag))
      $scope.post.tags = _.without(tags, tag);
    else
      $scope.post.tags = _.union(tags, [tag]);
  };
  $scope.deselectTag = (function(tag) {
    $scope.post.tags = _.without($scope.post.tags, tag);
  });
}]).controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams', 'session', function($scope, PostsService, $routeParams, session) {
  $scope.username = $routeParams.username;
  PostsService.getByUsername($routeParams.username, (function(posts) {
    $scope.posts = posts;
  }));
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./../common/routes/helpers.js":"/Users/matias/Sites/airpair.com/public/common/routes/helpers.js","./author.html":"/Users/matias/Sites/airpair.com/public/posts/author.html","./editor.js":"/Users/matias/Sites/airpair.com/public/posts/editor.js","./list.html":"/Users/matias/Sites/airpair.com/public/posts/list.html","./listTag.html":"/Users/matias/Sites/airpair.com/public/posts/listTag.html","./myPostsList.js":"/Users/matias/Sites/airpair.com/public/posts/myPostsList.js","./publish.html":"/Users/matias/Sites/airpair.com/public/posts/publish.html"}],"/Users/matias/Sites/airpair.com/public/posts/myPostsList.html":[function(require,module,exports){
module.exports = "<table class=\"table table-striped\">\n  <tr>\n    <th>Created</th>\n    <th>Published</th>\n    <th>Title</th>\n    <th></th>    \n  </tr>\n  <tr ng-repeat=\"p in myposts\">\n    <td>{{ p.created | publishedTime: 'MM.DD' }}</td>  \n    <td>\n      {{ p.published | publishedTime: 'MM.DD' }}\n    </td>\n    <td>\n      <a href=\"/v1/posts/{{p.slug}}\" target=\"_blank\" ng-if=\"p.published\">{{ p.title }}</a>\n      <span ng-if=\"!p.published\">{{ p.title }}</span>\n    </td> \n    <td>\n      <a href=\"/posts/edit/{{p._id}}\" target=\"_blank\">edit</a>\n    </td>     \n  </tr>\n</table>";

},{}],"/Users/matias/Sites/airpair.com/public/posts/myPostsList.js":[function(require,module,exports){
"use strict";
angular.module("APMyPostsList", []).directive('apMyPostsList', function() {
  return {
    template: require('./myPostsList.html'),
    controller: function($scope) {}
  };
});
;

//# sourceMappingURL=<compileOutput>


},{"./myPostsList.html":"/Users/matias/Sites/airpair.com/public/posts/myPostsList.html"}],"/Users/matias/Sites/airpair.com/public/posts/publish.html":[function(require,module,exports){
module.exports = "<header><a href=\"/posts\">Posts</a> > Publish</header>\n<section id=\"posts\">\n  <div id=\"author\" class=\"publish\">\n  <div class=\"editor\">\n\n\n  <div class=\"posts\" style=\"float:right;width:300px\">\n    <ap-post-list-item post=\"post\"></ap-post-list-item>\n  </div>\n\n  <div class=\"form-group\" style=\"width:540px;float:left\">\n    <label>Title</label>\n    <input ng-model=\"post.title\" type=\"text\" class=\"form-control\" placeholder=\"Type post title ...\" />\n  </div>\n\n  <div class=\"author\" style=\"width:540px;float:left\">\n\n    <div class=\"form-group\">\n      <label for=\"userInput\">Author</label>\n      <div user-input=\"\"></div>\n    </div>\n    <div class=\"form-group\">\n      <label>Author bio</label>\n      <input ng-model=\"post.by.bio\" type=\"text\" class=\"form-control\" />\n    </div>\n\n  </div>\n\n<hr style=\"clear:both\" />\n\n  <div class=\"form-group\">\n    <label>Slug url</label>\n    <input ng-model=\"post.slug\" type=\"text\" class=\"form-control\" />\n  </div>\n\n\n  <div class=\"form-group\" style=\"width:540px;float:left\">\n    <label>Tags </label>\n    <div tag-input=\"\"></div>\n  </div>\n\n  <hr style=\"clear:both\" />\n\n  <div class=\"form-group\">\n    <label>Meta</label>\n    <input ng-model=\"post.meta.canonical\" type=\"text\" class=\"form-control\" placeholder=\"canonical url\" />\n    <input ng-model=\"post.meta.title\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n    <input ng-model=\"post.meta.description\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n  </div>\n  <div class=\"form-group\">\n    <label>Open Graph</label>\n    <input ng-model=\"post.meta.ogUrl\" type=\"text\" class=\"form-control\" placeholder=\"url\" disabled=\"disabled\" />\n    <input ng-model=\"post.meta.ogTitle\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n    <input ng-model=\"post.meta.ogDescription\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n    <input ng-model=\"post.meta.ogType\" type=\"text\" class=\"form-control\" placeholder=\"type\"/>\n    <input ng-model=\"post.meta.ogImage\" type=\"text\" class=\"form-control\" placeholder=\"image\" />\n<!--     <input ng-model=\"post.meta.ogVideo\" type=\"text\" class=\"form-control\" placeholder=\"video\" /> -->\n  </div>\n\n  <div class=\"form-group\">\n    <label>Override Publish Date</label>\n    <input ng-model=\"post.publishedOverride\" type=\"text\" class=\"form-control\" ng-click=\"setPublishedOverride()\" />\n  </div>\n\n  <section>\n    <label>Created</label> <span>{{ post.created | publishedTime }}</span>\n    <label>Updated</label> <span>{{ post.updated | publishedTime }}</span>\n    <label>Published</label> <span>{{ post.published | publishedTime }}</span>\n    <label>By</label> <span>{{ post.publishedBy }}</span>\n  </section>\n\n  <hr style=\"clear:both\" />\n\n\n\n<div class=\"form-actions\">\n\n  <a href=\"/posts/edit/{{_id}}\" class=\"btn\">Edit</a>\n\n  <a href=\"{{post.url}}\" class=\"btn\" ng-disabled=\"!post.published\" target=\"_blank\">View</a>\n\n  <button class=\"btn\" ng-click=\"save()\">Publish</button>\n\n  <button class=\"btn\" ng-click=\"delete()\" ng-disabled=\"(!(preview.mode == 'edit') || post.published) || !post._id\">Delete</button>\n</div>\n\n\n  </div>\n\n\n</div>\n<br /><br />\n</div>\n  </div>\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/profile/account.html":[function(require,module,exports){
module.exports = "<header>Account Info > {{ session.name }}</header>\n<section id=\"account\">\n\n  <section class=\"email\">\n\n  <form id=\"emailForm\" novalidate name=\"emailForm\" ng-submit=\"submit(emailForm.$valid, data)\">\n\n    <div form-group class=\"email-group verified-{{session.emailVerified}}\">\n      <label class=\"control-label\" for=\"sessionEmail\">Contact email</label>\n      <input id=\"sessionEmail\" name=\"email\" form-control type=\"email\" placeholder=\"Primary contact email\" ng-model=\"data.email\" ng-blur=\"updateEmail(emailForm.email)\" required tabindex=\"1\">\n      <div class=\"error\" ng-if=\"formGroup.showError(emailForm.email)\" ng-messages=\"emailForm.email.$error\">\n        <div ng-message=\"required\">Field required</div>\n        <div ng-message=\"email\">Invalid email</div>\n      </div>\n      <span class=\"error\">{{ emailChangeFailed }}</span>\n      <span class=\"verifyEmail\" ng-if=\"session.emailVerified == false\">{{session.email}} is unverified ...</span>\n    </div>\n    <div class=\"verifyEmail\" ng-if=\"session.emailVerified == false\">\n      Verify your email for billing\n      <a href=\"#\" ng-click=\"sendVerificationEmail()\" class=\"btn\">Send verification email</a>\n    </div>\n    <div class=\"verifyEmail\" style=\"background:white\">\n      <alert ng-repeat=\"alert in emailAlerts\" type=\"{{alert.type}}\">{{alert.msg}}</alert>\n    </div>\n  </form>\n  </section>\n  <hr />\n\n\n  <section class=\"avatar\">\n    <img class=\"avatar\" ng-src=\"{{session.avatar}}?s=280\" title=\"Avatars are gravtars from your email.\" />\n    <p style=\"font-size:12px\">\n    <span ng-if=\"session.email\">Update the <b><a href=\"http://www.gravatar.com/\" target=\"_blank\">gravatar</a></b> for {{ session.email }}</span>\n    <span ng-if=\"!session.email\">Enter an email address</span>\n      to change your pic.\n    </p>\n  </section>\n\n  <section class=\"info\">\n\n  <form id=\"profileForm\" novalidate name=\"profileForm\" ng-submit=\"submit(profileForm.$valid, data)\">\n\n    <div form-group>\n      <label class=\"control-label\" for=\"profileName\">Full name </label>\n      <input id=\"profileName\" name=\"name\" form-control type=\"text\" placeholder=\"Full name\" ng-model=\"data.name\" required ng-minlength=\"4\" ng-minlength=\"60\" ng-pattern=\"/\\w+ \\w+/\" tabindex=\"2\">\n      <div class=\"error\" ng-if=\"formGroup.showError(profileForm.name)\" ng-messages=\"profileForm.name.$error\">\n        <div ng-message=\"required\">Name required</div>\n        <div ng-message=\"minlength\">Full name required (e.g. John Smith)</div>\n        <div ng-message=\"pattern\">Full name required (e.g. John Smith)</div>\n        <div ng-message=\"maxlength\">Full name max length 60 chars</div>\n      </div>\n    </div>\n\n    <div form-group>\n      <label for=\"profileInitials\">Initials <span>used for IM/chat</span></label>\n      <input id=\"profileInitials\" name=\"initials\" type=\"text\" form-control placeholder=\"Initials\" ng-model=\"data.initials\" tabindex=\"3\">\n    </div>\n    <div form-group>\n      <label class=\"control-label\" for=\"profileUsername\">Username <span>shown on post you publish</span></label>\n      <input id=\"profileUsername\" name=\"username\" form-control type=\"text\" placeholder=\"Username\" ng-model=\"data.username\" ng-minlength=\"2\" ng-pattern=\"/^\\w+$/\" tabindex=\"4\">\n      <div class=\"error\" ng-if=\"formGroup.showError(profileForm.username)\" ng-messages=\"profileForm.username.$error\">\n        <div ng-message=\"minlength\">Min 2 characters</div>\n        <div ng-message=\"pattern\">Username must be letters only</div>\n      </div>\n    </div>\n\n  </form>\n\n  <alert ng-repeat=\"alert in profileAlerts\" type=\"{{alert.type}}\">{{alert.msg}}</alert>\n  </div>\n\n  </section>\n  <hr />\n\n  <section class=\"password\">\n    <h3 style=\"margin-top:0\">Password</h3>\n    <p>To set your password, we will send an email to {{ session.email }}.</p>\n    <a href=\"#\" ng-click=\"sendPasswordChange()\" class=\"btn\">Send reset password email</a>\n    <alert ng-repeat=\"alert in passwordAlerts\" type=\"{{alert.type}}\">{{alert.msg}}</alert>\n  </section>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/profile/module.js":[function(require,module,exports){
"use strict";
var resolver = require('./../common/routes/helpers.js').resolveHelper;
angular.module("APProfile", ['ngRoute', 'APFilters', 'APSvcSession', 'APTagInput']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  var authd = resolver(['session']);
  $routeProvider.when('/me', {
    template: require('./account.html'),
    controller: 'AccountCtrl as account',
    resolve: authd
  });
  $routeProvider.when('/me/password', {
    template: require('./password.html'),
    controller: 'PasswordCtrl as account'
  });
  $routeProvider.when('/me/:username', {
    template: require('./profile.html'),
    controller: 'ProfileCtrl as profile',
    resolve: authd
  });
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {}]).controller('AccountCtrl', ['$rootScope', '$scope', '$location', 'SessionService', function($rootScope, $scope, $location, SessionService) {
  var self = this;
  if ($location.search().verify) {
    SessionService.verifyEmail({hash: $location.search().verify}, function(result) {
      $scope.emailAlerts = [{
        type: 'success',
        msg: ($scope.session.email + " verified !")
      }];
    }, function(e) {
      $scope.emailAlerts = [{
        type: 'danger',
        msg: (e + " failed")
      }];
    });
  }
  SessionService.onAuthenticated((function(session) {
    return $scope.data = _.pick(session, 'name', 'email', 'initials', 'username');
  }));
  if ($scope.session)
    $scope.data = _.pick($scope.session, 'name', 'email', 'initials', 'username');
  angular.element('#profileForm input').on('blur', function(event) {
    $scope.profileAlerts = [];
    if ($scope.session.name != $scope.data.name || $scope.session.initials != $scope.data.initials || $scope.session.username != $scope.data.username) {
      SessionService.updateProfile($scope.data, function(result) {
        $scope.profileAlerts.push({
          type: 'success',
          msg: (event.target.name + " updated")
        });
      }, function(e) {
        $scope.data.username = $scope.session.username;
        $scope.profileAlerts.push({
          type: 'danger',
          msg: e.message
        });
      });
    }
  });
  $scope.updateEmail = function(model) {
    if (!model.$valid || $scope.data.email == $scope.session.email)
      return;
    $scope.emailChangeFailed = "";
    SessionService.changeEmail({email: $scope.data.email}, (function(result) {
      $scope.data.email = result.email;
    }), (function(e) {
      $scope.emailChangeFailed = e.message;
      $scope.data.email = null;
    }));
  };
  $scope.sendVerificationEmail = function() {
    SessionService.changeEmail({email: $scope.session.email}, function(result) {
      $scope.emailAlerts = [{
        type: 'success',
        msg: "Email verification mail sent"
      }];
    }, function(e) {
      $scope.emailAlerts = [{
        type: 'danger',
        msg: (e + " failed")
      }];
    });
  };
  $scope.sendPasswordChange = function() {
    SessionService.requestPasswordChange({email: $scope.session.email}, function(result) {
      $scope.passwordAlerts = [{
        type: 'success',
        msg: ("Password reset sent to " + $scope.session.email)
      }];
    }, function(e) {
      console.log('requestPasswordChange.failed', e);
    });
  };
}]).controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams', function($scope, PostsService, $routeParams) {
  $scope.username = $routeParams.username;
  PostsService.getByUsername($routeParams.username, (function(posts) {
    $scope.posts = posts;
  }));
}]).controller('PasswordCtrl', ['$scope', '$routeParams', '$location', 'SessionService', function($scope, $routeParams, $location, SessionService) {
  $scope.alerts = [];
  $scope.data = {
    password: '',
    hash: $location.search().token
  };
  $scope.savePassword = function() {
    SessionService.changePassword($scope.data, function(result) {
      $scope.alerts = [{
        type: 'success',
        msg: "New password set"
      }];
    }, function(e) {
      $scope.alerts = [{
        type: 'danger',
        msg: "Password change failed"
      }];
    });
  };
  if (!$scope.data.hash)
    $scope.alerts.push({
      type: 'danger',
      msg: "Password token expired"
    });
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./../common/routes/helpers.js":"/Users/matias/Sites/airpair.com/public/common/routes/helpers.js","./account.html":"/Users/matias/Sites/airpair.com/public/profile/account.html","./password.html":"/Users/matias/Sites/airpair.com/public/profile/password.html","./profile.html":"/Users/matias/Sites/airpair.com/public/profile/profile.html"}],"/Users/matias/Sites/airpair.com/public/profile/password.html":[function(require,module,exports){
module.exports = "<header>Set password</header>\n<section id=\"password\">\n\n  <alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\">{{alert.msg}}</alert>\n\n  <form ng-if=\"data.hash && alerts.length == 0\" id=\"passwordForm\" novalidate name=\"passwordForm\">\n\n    <div form-group>\n      <label class=\"control-label\" for=\"signupPassword\">Password </label>\n        <input id=\"signupPassword\" name=\"password\" form-control type=\"password\" placeholder=\"Password\" ng-model=\"data.password\" required ng-minlength=\"5\" ng-maxlength=\"10\" tabindex=\"3\">\n      <div class=\"error\" ng-if=\"formGroup.showError(passwordForm.password)\" ng-messages=\"passwordForm.password.$error\">\n        <div ng-message=\"required\">Password required</div>\n        <div ng-message=\"minlength\">Password min length 5 chars</div>\n        <div ng-message=\"maxlength\">Password max length 10 chars</div>\n      </div>\n    </div>\n\n    <button class=\"btn btn-primary\" ng-click=\"savePassword()\">Save password</button>\n\n  </form>\n\n  <hr />\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/profile/profile.html":[function(require,module,exports){
module.exports = "<header>Profile > {{ username }}</header>\n\n<div class=\"posts\">\n  <ap-post-list-item post=\"p\" ng-repeat=\"p in posts\"></ap-post-list-item>\n</div>\n";

},{}],"/Users/matias/Sites/airpair.com/public/workshops/list.html":[function(require,module,exports){
module.exports = "<header>Workshops</header>\n<section id=\"workshops\">\n\n  <div id=\"index\">\n\n    <div id=\"calendar\">\n      <h2>Calendar</h2>\n\n      <p>Keep track of the schedule:</p>\n\n      <a class=\"btn\" href=\"/workshops/subscribe\">Subscribe to calendar</a>\n\n      <hr />\n      <h5>Next 30 days</h5>\n      <ul id=\"month\">\n        <li ng-repeat=\"entry in workshops.month\">\n          <time>{{entry.time | locaTime }}</time>\n          <a href=\"{{entry.url}}\" target=\"_self\"> {{ entry.title }}</a></li>\n      </ul>\n    </div>\n\n    <div id=\"next\">\n      <h2>Next up</h2>\n\n      <p style=\"font-size:11px\"><i>* Times shown in <b>{{ timeZoneOffset }}</b> (your browser's timezone)</i> </p>\n\n      <a class=\"workshop\" target=\"_self\" href=\"{{entry.url}}\"\n         ng-repeat=\"entry in workshops.upcoming\">\n        <time datetime=\"{{entry.time}}\">{{ entry.time | locaTime }}</time>\n        <div ng-repeat=\"speaker in entry.speakers\">\n          <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n          <h5 class=\"entry-author\">{{ speaker.name }}</h5>\n        </div>\n        <figure>{{ entry.title }}</figure>\n      </a>\n    </div>\n\n    <div id=\"featured\">\n      <h2>Featured</h2>\n      <a class=\"workshop\" target=\"_self\" href=\"{{entry.url}}\"\n         ng-repeat=\"entry in workshops.featured\">\n        <div ng-repeat=\"speaker in entry.speakers\">\n          <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n          <h5>{{ speaker.name }}</h5>\n        </div>\n        <figure>{{ entry.title }}</figure>\n      </a>\n    </div>\n\n    <div id=\"past\">\n      <h2>Library</h2>\n      <ul>\n        <li ng-repeat=\"entry in workshops.past\">\n          <a href=\"{{entry.url}}\" target=\"_self\">\n            <img src=\"//0.gravatar.com/avatar/{{entry.speakers[0].gravatar }}\"></time>\n            <time>{{entry.speakers[0].name }}</time>\n            {{ entry.title }}</a>\n          </li>\n        </li>\n      </ul>\n    </div>\n\n  </div>\n\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/workshops/module.js":[function(require,module,exports){
"use strict";
var feautredSlugs = ['fast-mvp-with-angularfire', 'learn-meteorjs-1.0', 'learn-git-and-github', 'publishing-at-the-speed-of-ruby', 'visualization-with-d3js', 'transitioning-to-consulting-for-developers'];
var selectByDateRange = function(list, daysAgo, daysUntil) {
  var start = moment(new Date()).add(daysAgo, 'days');
  var end = moment(new Date()).add(daysUntil, 'days');
  return _.where(list, function(i) {
    return moment(i.time).isAfter(start) && moment(i.time).isBefore(end);
  });
};
angular.module("APWorkshops", ['ngRoute', 'APFilters', 'APShare']).constant('API', '/v1/api').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/workshops', {
    template: require('./list.html'),
    controller: 'WorkshopsCtrl as workshops'
  });
  $routeProvider.when('/workshops/subscribe', {template: require('./subscribe.html')});
  $routeProvider.when('/workshops/signup/:id', {
    template: require('./signup.html'),
    controller: 'WorkshopSignupCtrl as signup'
  });
  $routeProvider.when('/workshops/signup-confirmed/:id', {
    template: require('./signupconfirmed.html'),
    controller: 'WorkshopSignupConfirmedCtrl'
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
}]).controller('WorkshopSignupCtrl', ['$scope', '$http', '$routeParams', 'API', function($scope, $http, $routeParams, API) {
  $scope.hasAccess = true;
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    $scope.entry = data;
  });
}]).controller('WorkshopSignupConfirmedCtrl', ['$scope', '$http', '$routeParams', '$location', 'API', function($scope, $http, $routeParams, $location, API) {
  $scope.later = false;
  if ($location.search().later) {
    $scope.later = true;
  }
  console.log('signup confirmed');
  $http.get(API + '/workshops/' + $routeParams.id).success(function(data) {
    $scope.entry = data;
  });
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./list.html":"/Users/matias/Sites/airpair.com/public/workshops/list.html","./signup.html":"/Users/matias/Sites/airpair.com/public/workshops/signup.html","./signupconfirmed.html":"/Users/matias/Sites/airpair.com/public/workshops/signupconfirmed.html","./subscribe.html":"/Users/matias/Sites/airpair.com/public/workshops/subscribe.html"}],"/Users/matias/Sites/airpair.com/public/workshops/signup.html":[function(require,module,exports){
module.exports = "<header>\n  <a href=\"/workshops\">Workshops</a> >\n  <a href=\"{{ entry.url }}\" target=\"_self\">{{ entry.title }}</a> >\n  Signup\n</header>\n\n<section id=\"workshops\">\n  <div id=\"signup\">\n\n    <div class=\"choice\" ng-if=\"!hasAccess\">\n\n      <h2>two ways to attend</h2>\n      <h4>Please choose an option access this workshop</h4>\n\n      <div class=\"option\">\n        <h2>Ticket</h2>\n\n        <ul>\n          <li><b>$50 one off</b></li>\n          <li>Access to this workshops</li>\n          <li>Access the recording</li>\n          <li>$10 credit towards pairing with {{ entry.speakers[0].name }}</li>\n        </ul>\n\n        <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Buy a ticket</a>\n      </div>\n\n      <div class=\"option\">\n        <h2>Membership</h2>\n        <ul>\n          <li><b>$300 for 6 months</b></li>\n          <li>Access to all workshops</li>\n          <li>$5/hr off all AirPairing</li>\n          <li>Instant chat access to experts</li>\n        </ul>\n        <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Get a membership</a>\n      </div>\n\n    </div>\n\n    <div class=\"rsvp\" ng-if=\"hasAccess && !entry.youtube\">\n\n      <h2>RSVP for workshop</h2>\n\n      <iframe ng-src=\"{{ '//bit.ly/aircastsignup-' + entry.slug | trustUrl }}\" width=\"100%\" height=\"920\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n\n    </div>\n\n    <div class=\"attending\" ng-if=\"hasAccess && entry.youtube\">\n\n      <h2>This workshop has already happened.</h2>\n\n    </div>\n\n    <hr />\n\n    <a href=\"{{ entry.url }}\" class=\"btn\" target=\"_self\">Back to workshop</a>\n\n    <hr />\n\n  </div>\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/workshops/signupconfirmed.html":[function(require,module,exports){
module.exports = "<header>\n  <a href=\"/workshops\">Workshops</a> >\n  <a href=\"{{ entry.url }}\" target=\"_self\">{{ entry.title }}</a> >\n  Thank you\n</header>\n\n<section id=\"workshops\">\n  <div id=\"confirmed\">\n\n\n    <h3 ng-if=\"later\">We will send you {{entry.title}}</h3>\n    <h3 ng-if=\"!later\">You are confirmed for {{entry.title}}</h3>\n\n    <hr />\n\n    <a href=\"{{ entry.url }}\" class=\"btn\" target=\"_self\">Back to workshop</a>\n\n    <hr />\n\n  </div>\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/public/workshops/subscribe.html":[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > Subscribe</header>\n<section id=\"workshops\">\n  <div id=\"subscribe\">\n\n    <h1>Subscribe to Workshops Calendar</h1>\n\n    <p>For convenience, we provide an iCal feed that automatically updates as we make changes to the workshops schedule.</p>\n\n    <input type=\"text\" style=\"width:100%;margin:15px 0 20px 0\" value=\"https://www.google.com/calendar/ical/airpair.co_o3u16m7fv9fc3agq81nsn0bgrs%40group.calendar.google.com/public/basic.ics\" />\n\n    <p>Make sure your client is setup correctly to receive live changes and that you haven't just imported a static view of the schedule.</p>\n\n    <h2>Google hangouts guide</h2>\n\n    <p>Copy and paste the following url in the \"Add by url\" dialog.\n\n    <p>If you select the 'Import calendar' option you will NOT see updates to the schedule as they are made.</p>\n\n    <img src=\"/v1/img/pages/workshops/ical-google-guide-1.png\" />\n\n    <p>Once the calendar url is added, you will see \"AirCasts\" listed down the left and workshops will appear in your calendar..</p>\n\n    <img src=\"/v1/img/pages/workshops/ical-google-guide-2.png\" />\n\n    <p>See guide to make sure you're correctly subscribe for updates to the AirCasts schedule.</p>\n\n    <hr />\n\n    <a href=\"/workshops\" class=\"btn\">Back to the workshops page</a>\n\n    <hr />\n\n  </div>\n</section>\n";

},{}],"/Users/matias/Sites/airpair.com/shared/util.js":[function(require,module,exports){
"use strict";
var botPattern = /googlebot|gurujibot|twitterbot|yandexbot|slurp|msnbot|bingbot|facebookexternalhit/i;
var idsEqual = (function(id1, id2) {
  return id1.toString() == id2.toString();
});
var nestedPick = (function(object, keys) {
  if (!object)
    return null;
  var copy = {};
  for (var $__0 = keys[Symbol.iterator](),
      $__1; !($__1 = $__0.next()).done; ) {
    var key = $__1.value;
    {
      var props = key.split('.');
      if (props.length === 1) {
        if (typeof object[key] !== "undefined" && object[key] !== null)
          copy[key] = object[key];
      } else {
        var result = nestedPick(object[props[0]], [key.replace((props[0] + "."), '')]);
        if (!_.isEmpty(result))
          copy[props[0]] = result;
      }
    }
  }
  return copy;
});
module.exports = {
  idsEqual: idsEqual,
  ObjectId2Date: (function(id) {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000);
  }),
  toggleItemInArray: (function(array, item, comparator) {
    if (!array)
      return [item];
    else {
      if (!comparator) {
        comparator = (function(i) {
          return idsEqual(i._id, item._id);
        });
      }
      var existing = _.find(array, comparator);
      if (existing)
        return _.without(array, existing);
      else {
        array.push(item);
        return array;
      }
    }
  }),
  combineItems: (function(array1, array2, compareProp) {
    if (!array1 && !array2)
      return [];
    if (!array1 || array1.length == 0)
      return array2;
    if (!array2 || array2.length == 0)
      return array1;
    for (var $__0 = array2[Symbol.iterator](),
        $__1; !($__1 = $__0.next()).done; ) {
      var item = $__1.value;
      {
        var existing = _.find(array1, (function(i) {
          return idsEqual(i[compareProp], item[compareProp]);
        }));
        if (!existing)
          array1.push(item);
      }
    }
    return array1;
  }),
  sessionCreatedAt: (function(session) {
    return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge, 'ms').toDate();
  }),
  dateWithDayAccuracy: (function(mom) {
    if (!mom)
      mom = moment();
    return moment(mom.format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
  }),
  firstName: (function(name) {
    return name.split(' ')[0];
  }),
  lastName: (function(name) {
    return name.replace(name.split(' ')[0] + '', '');
  }),
  selectFromObject: (function(obj, selectList) {
    if (!obj || !selectList)
      return obj;
    else
      return nestedPick(obj, _.keys(selectList));
  }),
  isBot: (function(useragent) {
    if (!useragent)
      return true;
    var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '');
    return botPattern.test(source);
  })
};

//# sourceMappingURL=<compileOutput>


},{}],"/Users/matias/Sites/airpair.com/shared/validation/users.js":[function(require,module,exports){
"use strict";
var validateEmail = (function(email) {
  if (!email || !email.match(/.+@.+\.+.+/))
    return "Invalid email address";
  return "";
});
module.exports = {
  changeEmail: (function(email) {
    return validateEmail(email);
  }),
  requestPasswordChange: (function(email) {
    return validateEmail(email);
  }),
  changePassword: (function(hash, password) {
    if (!hash || hash.match(/\s/))
      return "Invalid hash";
    if (!password || !password.match(/.{5,40}/))
      return "Invalid password (need min 5, max 40 chars)";
    return "";
  })
};

//# sourceMappingURL=<compileOutput>


},{}]},{},["./public/common/index.js"]);
