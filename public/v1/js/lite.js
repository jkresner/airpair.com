(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/common/lite.js":[function(require,module,exports){
"use strict";
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
angular.module("AP", ['ngRoute', 'APSideNav', 'APBookmarker', 'APAuth']).config(['$provide', function($provide) {}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  pageHlpr.fixNavs('#side');
  if (window.viewData) {
    if (window.viewData.post)
      $rootScope.post = window.viewData.post;
    if (window.viewData.workshop)
      $rootScope.workshop = window.viewData.workshop;
    if (window.viewData.expert)
      $rootScope.expert = window.viewData.expert;
  }
}]);
;


},{"./../auth/module.js":"/Users/jkrez/src/airpair.com/public/auth/module.js","./../common/directives/analytics.js":"/Users/jkrez/src/airpair.com/public/common/directives/analytics.js","./../common/directives/bookmarker.js":"/Users/jkrez/src/airpair.com/public/common/directives/bookmarker.js","./../common/directives/share.js":"/Users/jkrez/src/airpair.com/public/common/directives/share.js","./../common/directives/sideNav.js":"/Users/jkrez/src/airpair.com/public/common/directives/sideNav.js","./../common/directives/tagInput.js":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.js","./../common/filters/filters.js":"/Users/jkrez/src/airpair.com/public/common/filters/filters.js","./../common/models/postsService.js":"/Users/jkrez/src/airpair.com/public/common/models/postsService.js","./../common/models/sessionService.js":"/Users/jkrez/src/airpair.com/public/common/models/sessionService.js","./../common/pageHelpers.js":"/Users/jkrez/src/airpair.com/public/common/pageHelpers.js"}],"/Users/jkrez/src/airpair.com/public/auth/login.html":[function(require,module,exports){
module.exports = "<header>Login</header>\n<section id=\"auth\">\n\n\t<h1>Welcome.</h1>\n\n\t<section id=\"newuser\">\n\t  <h3>New to AirPair?</h3>\n\n\t  <p>The fastest way to access AirPair is to login with Google. You can also <a href=\"/v1/auth/signup\">sign up with an email and password</a>.</p>\n\t</section>\n\n\n\t<div class=\"choice\">\n\t\t<div class=\"google option\">\n\n\t\t  <h2>One click login</h2>\n\t\t  <p>\n\t\t    <a id=\"authGoogleBtn\" class=\"btn btn-error\" href=\"/v1/auth/google\" target=\"_self\" track-click=\"Google Auth\">Login with google</a>\n\t\t  </p>\n\t\t  <p class=\"help-text\">* You'll be temporarily redirected to google</p>\n\n\t\t</div>\n\n\t\t<div class=\"local option\">\n\n\t\t  <h2>Password login</h2>\n\t\t  <form novalidate ng-submit=\"LoginCtrl.submit(loginForm.$valid, data)\" name=\"loginForm\" ng-controller=\"LoginCtrl as LoginCtrl\">\n\t\t    <div class=\"form-group\">\n\t\t      <label>Email</label>\n\t\t      <input type=\"email\" placeholder=\"Email\" class=\"form-control\" name=\"email\" ng-model=\"data.email\" required >\n\t\t      <div class=\"error\" ng-if=\"loginForm.$submitted || loginForm.email.$touched\">\n\t\t        <div ng-if=\"loginForm.email.$error.required\">Email required</div>\n\t\t        <div ng-if=\"loginForm.email.$error.email\">Invalid email</div>\n\t\t      </div>\n\t\t    </div>\n\t\t    <div class=\"form-group\">\n\t\t      <label>Password</label>\n\t\t      <input type=\"password\" placeholder=\"Password\" class=\"form-control\" name=\"password\" ng-model=\"data.password\" required>\n\t\t      <div class=\"error\" ng-if=\"loginForm.$submitted || loginForm.password.$touched\">\n\t\t        <div ng-if=\"loginForm.password.$error.required\">Password required</div>\n\t\t      </div>\n\t\t    </div>\n\n\t\t    <button id=\"localAuthBtb\" type=\"submit\" class=\"btn btn-warning btn-lg\" track-click=\"Local Auth\">Login</button>\n\n\t\t    <div class=\"error\" ng-if=\"signupFail\">\n\t\t      <b>Login failed:</b> <span ng-if=\"signupFail\">{{signupFail}}</span>\n\t\t    </div>\n\t\t  </form>\n\n\t\t</div>\n\t</div>\n\n</section>\n";

},{}],"/Users/jkrez/src/airpair.com/public/auth/module.js":[function(require,module,exports){
"use strict";
var resolver = require('./../common/routes/helpers.js');
angular.module("APAuth", ['ngRoute', 'APFilters', 'APSvcSession', 'APAnalytics']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/auth/login', {template: require('./login.html')});
  $routeProvider.when('/v1/auth/signup', {template: require('./signup.html')});
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  SessionService.onAuthenticated((function(session) {
    if (!session.name)
      session.name = ("Visitor " + session.sessionID.substring(0, 10));
    $rootScope.session = session;
  }));
}]).controller('LoginCtrl', ['$scope', '$window', 'SessionService', function($scope, $window, SessionService) {
  var self = this;
  this.submit = function(isValid, formData) {
    if (!isValid)
      return;
    SessionService.login(formData, (function() {
      return $window.location = '';
    }), (function(e) {
      return $scope.signupFail = e.error;
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


},{"./../common/routes/helpers.js":"/Users/jkrez/src/airpair.com/public/common/routes/helpers.js","./login.html":"/Users/jkrez/src/airpair.com/public/auth/login.html","./signup.html":"/Users/jkrez/src/airpair.com/public/auth/signup.html"}],"/Users/jkrez/src/airpair.com/public/auth/signup.html":[function(require,module,exports){
module.exports = "<header>Sign up</header>\n<section id=\"auth\">\n\n\t<div class=\"choice\">\n\t<div class=\"signup option\">\n\n\t  <h2>Signup</h2>\n\n\t  <form novalidate ng-submit=\"SignupCtrl.submit(signupForm.$valid, data)\" name=\"signupForm\" ng-controller=\"SignupCtrl as SignupCtrl\">\n\t    <div class=\"form-group\">\n\t      <label>Full name</label>\n\t      <input type=\"name\" placeholder=\"Full name\" class=\"form-control\" name=\"name\" ng-model=\"data.name\" required >\n\t      <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n\t        <div ng-if=\"signupForm.email.$error.required\">Full name required</div>\n\t      </div>\n\t    </div>\n\t    <div class=\"form-group\">\n\t      <label>Email</label>\n\t      <input type=\"email\" placeholder=\"Email\" class=\"form-control\" name=\"email\" ng-model=\"data.email\" required >\n\t      <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n\t        <div ng-if=\"signupForm.email.$error.required\">Email required</div>\n\t        <div ng-if=\"signupForm.email.$error.email\">Invalid email</div>\n\t      </div>\n\t    </div>\n\t    <div class=\"form-group\">\n\t      <label>Password</label>\n\t      <input type=\"password\" placeholder=\"Password\" class=\"form-control\" name=\"password\" ng-model=\"data.password\" required>\n\t      <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.password.$touched\">\n\t        <div ng-if=\"signupForm.password.$error.required\">Password required</div>\n\t      </div>\n\t    </div>\n\n\t    <button type=\"submit\" class=\"btn btn-warning btn-lg\">Sign up</button>\n\n\t    <div class=\"error\" ng-if=\"signupFail\">\n\t      <b>Sign up failed:</b> <span ng-if=\"signupFail\">{{signupFail}}</span>\n\t    </div>\n\t  </form>\n\n\t</div>\n\t</div>\n\n\t<h3>Aleady have an account?</h3>\n\n\t<p><a href=\"/v1/auth/login\"><b>Login</b></a> with google or an email and password</a>.</p>\n\n</section>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/analytics.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/common/directives/bookmarker.js":[function(require,module,exports){
"use strict";
angular.module("APBookmarker", ['APSvcSession']).directive('bookmarker', ['SessionService', function(SessionService) {
  return {
    restrict: 'E',
    template: '<a href="#" class="bookmark" ng-click="bookmark(post._id)">bookmark</a>',
    link: function(scope, element, attrs) {
      scope.type = attrs.type;
    },
    controller: ['$rootScope', '$scope', function($rootScope, $scope) {
      $scope.bookmark = function(objectId) {
        var data = {
          type: $scope.type,
          objectId: objectId
        };
        var success = function(result) {
          $rootScope.session = result;
        };
        SessionService.updateBookmark(data, success, (function(e) {
          return alert(e.message);
        }));
      };
    }]
  };
}]);
;


},{}],"/Users/jkrez/src/airpair.com/public/common/directives/bookmarks.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n\t<h3 class=\"modal-title\">Bookmark AirPair Content</h3>\n</div>\n<div class=\"modal-body stack\">\n\n \t<p>Collect your favorite posts, workshops and experts.</p>\n\n\t<ul class=\"bookmarks\">\n\t\t<li ng-repeat=\"b in session.bookmarks\"><a href=\"{{b.url}}\" target=\"_self\">{{b.title}}</a></li>\n\t</ul>\n\n</div>\n<div class=\"modal-footer\">\n\t<button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n\t<button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/profile.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n\t<h3 class=\"modal-title\">Account info <span>></span> {{ session.name }}</h3>\n\t<a href=\"#\" class=\"close\" ng-click=\"cancel()\">x</a>\n</div>\n<div class=\"modal-body profile\">\n\n<section>\n\t<section class=\"login\" ng-if=\"session.authenticated == false\">\n\t <p>Aren't you a little short for a storm trooper? <span ng-if=\"!session.email\">Enter your email address to change your avatar.</span></p>\n\t <br />\n\t</section>\n\n\t<section class=\"avatar tile\">\n\t\t<img class=\"avatar\" ng-src=\"{{session.avatar}}?s=230\" title=\"Avatars are gravtars from your email.\" />\n\t\t<p style=\"font-size:12px\">\n\t\t\t<span ng-if=\"session.email\">Update the <b><a href=\"http://www.gravatar.com/\" target=\"_blank\">gravatar</a></b> for {{ session.email }}</span>\n\t\t\t<span ng-if=\"!session.email\">Enter an email address</span>\n\t\t \t<br /> to change your profile pic.</p>\n\t\t<hr />\n\t\t<label>Account Credit</label> <b style=\"font-size:26px;color:black\">$10</b> <br />available when you sign up</a>\n\t\t<!-- <label>Last seen</label> Today -->\n\t<!-- \t\t\t<label>Timezone</label> - 07:00\n<br /><label>Membership</label> No\n\t\t<hr />\n\t\t<br /><label>Roles</label> Visitor -->\n\n\t</section>\n\n\t<section class=\"info\">\n\t\t<section class=\"google\" ng-if=\"session.authenticated == false\">\n\t\t\tHate forms and passwords? <br /><br /><a href=\"\"><b>Sign in with your google account instead</b></a>.\n\t\t</section>\n\n\t\t<div class=\"form-group tag-input-group\">\n\t\t\t<label for=\"session_email\">Email <span class=\"verifyEmail\" ng-if=\"session.emailVerified  == false\">Unverified - <a hred=\"#\">Resend verification email</a></span></label>\n\t\t\t<input id=\"session_email\" type=\"text\" class=\"form-control\" placeholder=\"Primary contact email\" ng-model=\"session.email\">\n\t\t</div>\n\t\t<div class=\"form-group tag-input-group\">\n\t\t\t<label for=\"session_name\">Name</label>\n\t\t\t<input id=\"session_name\" type=\"text\" class=\"form-control\" placeholder=\"Full name\" ng-model=\"session.name\" ng-focus=\"clearDefaultName()\">\n\t\t</div>\n\t\t<div ng-if=\"session._id\">\n\t\t\t<div class=\"form-group tag-input-group\">\n\t\t\t\t<label for=\"session_initials\">Initials <span style=\"\">used in chat</span></label>\n\t\t\t\t<input id=\"session_initials\" type=\"text\" class=\"form-control\" placeholder=\"Initials\" ng-model=\"session.initials\">\n\t\t\t</div>\n\t\t\t<div class=\"form-group tag-input-group\">\n\t\t\t\t<label for=\"session_username\">Username <span>optional</span></label>\n\t\t\t\t<input id=\"session_username\" type=\"text\" class=\"form-control\" placeholder=\"Username\" ng-model=\"session.username\">\n\t\t\t</div>\n\t\t</div>\n\t\t<hr />\n\t\t<div ng-if=\"session.authenticated == false\" class=\"form-group tag-input-group\">\n\t\t\t<label for=\"password\">Password</label>\n\t\t\t<input id=\"password\" type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"session.password\">\n\t\t</div>\n\t\t<div ng-if=\"session.authenticated != false\">\n\t\t\t<div class=\"form-group tag-input-group\">\n\t\t\t\t<label for=\"password\">Set Password</label>\n\t\t\t\t<input id=\"password\" type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"session.password\">\n\t\t\t</div>\n\t\t\t<div class=\"form-group tag-input-group\">\n\t\t\t\t<label for=\"password\">Confirm Password</label>\n\t\t\t\t<input id=\"password\" type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"session.passwordconfirm\">\n\t\t\t</div>\n\t\t</div>\n\n\n\t</section>\n\n</section>\n\n\n</div>\n<div class=\"modal-footer profile\">\n\t<button class=\"btn btn-primary\" ng-click=\"ok()\" ng-if=\"session.authenticated == false\">Create account</button>\n\t<button class=\"btn\" ng-click=\"ok()\" ng-if=\"session.authenticated != false\">Close</button>\n</div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/share.html":[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\">\n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>\n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>\n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>\n</div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/share.js":[function(require,module,exports){
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


},{"./share.html":"/Users/jkrez/src/airpair.com/public/common/directives/share.html"}],"/Users/jkrez/src/airpair.com/public/common/directives/sideNav.html":[function(require,module,exports){
module.exports = "<header>\n  <img id=\"sideNavToggle\" track-click=\"SideNav\" data=\"{{ toggleAction }}\" track-click-if=\"!session._id\" ng-click=\"sideNav.toggle()\" src=\"/v1/img/css/sidenav/toggle.png\" />\n</header>\n\n<section class=\"welcome\" ng-if=\"session.authenticated == false\">\n<!-- \t<label>Welcome\n\t\t<span><a href=\"welcomeName\" track-click=\"SideNav\" ng-click=\"openProfile()\">Visitor {{ session.sessionID.substring(0,10) }}</a></span>\n\t\t<!-- <i>That's a nice hair tie ...</i>\n\t\t<i>? Little short for a ...</i>\n\t</label> -->\n\t<figure><a id=\"welcomeAvatar\" track-click=\"SideNav\" ng-click=\"openProfile()\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}\" /></a></figure>\n  <ul class=\"main\">\n    <li>Want your face back?</li>\n    <li><a href=\"/v1/auth/login\" target=\"_self\">> Login</a></li>\n    <li>Prefer being a cat?</li>\n    <li><a ng-click=\"sideNav.toggle()\" href=\"#\">> Hide menu</a></li>\n\t\t<li>Not sure?</li>\n    <li><a href=\"/v1/auth/login\" target=\"_self\">> See about AirPair</a></li>\n  </ul>\n</section>\n\n\n<section ng-if=\"session._id\">\n\t<figure><a href=\"#\" ng-click=\"openProfile()\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}?s=120\" /></a></figure>\n</section>\n\n<section class=\"main\" ng-if=\"session._id\"> <label>{{ session.name.split(' ')[0] }}</label>\n  <ul>\n    <!-- <li><a href=\"#\">dashboard</a></li> -->\n    <li><a href=\"/billing\">billing</a></li>\n    <!-- <li><a href=\"#\">airpairs</a></li> -->\n    <!-- <li><a href=\"#\">settings</a></li> -->\n    <li><a href=\"/v1/auth/logout\" target=\"_self\">logout</a></li>\n  </ul>\n</section>\n\n\n<section class=\"stack\"> <label>Stack</label>\n\t<ul>\n\t\t<li ng-repeat=\"tag in session.tags\"><a href=\"/posts/tag/{{tag.slug}}\">{{tag.name}}</a></li>\n\t</ul>\n\t<a id=\"stackToggle\" track-click=\"SideNav\" href=\"#\" ng-click=\"openStack()\" class=\"icon\">\n\t\t<span>Customize</span><img src=\"/v1/img/css/sidenav/tags.png\" />\n\t</a>\n</section>\n\n\n<section class=\"bookmarks\"> <label>Bookmarks</label>\n\t<ul class=\"bookmarks\">\n\t\t<li ng-repeat=\"b in session.bookmarks\"><a href=\"{{b.url}}\" target=\"_self\">{{b.title}}</a></li>\n\t</ul>\n\t<a id=\"bookmarksToggle\" track-click=\"SideNav\"  ng-click=\"openBookmarks()\" class=\"icon\"><span>Manage</span> <img src=\"/v1/img/css/sideNav/sort-arrows.png\" /></a>\n</section>\n\n<div stack></div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/sideNav.js":[function(require,module,exports){
"use strict";
function storage(k, v) {
  if (window.localStorage) {
    if (typeof v == 'undefined') {
      return localStorage[k];
    }
    localStorage[k] = v;
    return v;
  }
}
angular.module("APSideNav", ['ui.bootstrap', 'APSvcSession', 'APTagInput']).directive('sideNav', ['SessionService', '$modal', function(SessionService, $modal) {
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
          windowClass: 'stack',
          template: require('./stack.html'),
          controller: "ModalInstanceCtrl",
          size: 'lg'
        });
      };
      $scope.selectedTags = (function() {
        return ($scope.session) ? $scope.session.tags : null;
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
      $scope.openBookmarks = function() {
        var modalInstance = $modal.open({
          windowClass: 'bookmarks',
          template: require('./bookmarks.html'),
          controller: "ModalInstanceCtrl",
          size: 'lg',
          resolve: {session: (function() {
              return $scope.session;
            })}
        });
      };
      $scope.openProfile = function() {
        var modalInstance = $modal.open({
          windowClass: 'profile',
          template: require('./profile.html'),
          controller: "ModalInstanceCtrl",
          size: 'lg'
        });
      };
    }
  };
}]).controller('ModalInstanceCtrl', function($scope, $modalInstance) {
  $scope.clearDefaultName = function() {
    console.log('focused', $scope.session.name);
    if ($scope.session.name.indexOf('Visitor') != -1)
      $scope.session.name = '';
  };
  $scope.ok = (function() {
    return $modalInstance.close();
  });
  $scope.cancel = (function() {
    return $modalInstance.dismiss('cancel');
  });
});
;


},{"./bookmarks.html":"/Users/jkrez/src/airpair.com/public/common/directives/bookmarks.html","./profile.html":"/Users/jkrez/src/airpair.com/public/common/directives/profile.html","./sideNav.html":"/Users/jkrez/src/airpair.com/public/common/directives/sideNav.html","./stack.html":"/Users/jkrez/src/airpair.com/public/common/directives/stack.html"}],"/Users/jkrez/src/airpair.com/public/common/directives/stack.html":[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n\t<h3 class=\"modal-title\">Customize AirPair to your Stack</h3>\n</div>\n<div class=\"modal-body stack\">\n\n \t<p>Personalize AirPair content, by selecting technologies that make up your stack.</p>\n\n \t<div  tag-input></div>\n\n</div>\n<div class=\"modal-footer\">\n\t<button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n\t<button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.html":[function(require,module,exports){
module.exports = "<div class=\"form-group tag-input-group\">\n  <div class=\"nomobile\">This feature is not available on mobile</div>\n\n  <div class=\"drag\">\n  \t<p>\n\t\t\t<b>drag in order of importance</b>\n\t\t\t<br />place most used first\n\t\t</p>\n  </div>\n  <div class=\"selected\">\n\t\t<label for=\"tagInput\">Your stack</label>\n\n\t\t<ul class=\"tags\">\n\t\t\t<li ng-repeat=\"tag in selectedTags()\">{{tag.slug}}  <a class=\"remove\" ng-click=\"deselectMatch(tag)\">x</a></li>\n\t\t</ul>\n\n\t\t<p ng-if=\"!selectedTags() || selectedTags().length == 0\">No tags selected yet.</p>\n  </div>\n\n  <label for=\"tagInput\">Search technologies</label>\n\t<input type=\"text\" class=\"tagInput form-control\"\n\t  placeholder=\"type a technology (e.g. javascript)\"\n\t  ng-model=\"q\" typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\">\n\t<!-- typeahead-loading=\"loading\"\n\t<i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\n\t -->\n</div>\n\n<script type=\"text/ng-template\" id=\"template/typeahead/typeahead-match.html\">\n  <a class=\"tagSelect\">\n    <span bind-html-unsafe=\"match.model.slug | typeaheadHighlight:query\"></span>\n    <div style=\"width:199px;overflow:hidden;height:auto\" bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></div>\n  </a>\n</script>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.js":[function(require,module,exports){
"use strict";
angular.module('APTagInput', ['ui.bootstrap']).value('acceptableTagsSearchQuery', function(value) {
  return value && (value.length >= 2 || /r/i.test(value));
}).directive('tagInput', ['acceptableTagsSearchQuery', function(acceptableTagsSearchQuery) {
  return {
    restrict: 'EA',
    template: require('./tagInput.html'),
    controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
      $scope.getTags = function(q) {
        if (!acceptableTagsSearchQuery(q)) {
          return [];
        }
        return $http.get('/v1/api/tags/search/' + q).then(function(res) {
          var tags = [];
          angular.forEach(res.data, function(item) {
            tags.push(item);
          });
          $scope.matches = tags;
          return tags;
        });
      };
      $scope.selectMatch = function(index) {
        var tag = $scope.matches[index];
        $scope.selectTag(tag);
        $scope.q = "";
      };
      $scope.deselectMatch = function(match) {
        this.deselectTag(match);
      };
    }]
  };
}]);
;


},{"./tagInput.html":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.html"}],"/Users/jkrez/src/airpair.com/public/common/filters/filters.js":[function(require,module,exports){
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


},{"../../../shared/util.js":"/Users/jkrez/src/airpair.com/shared/util.js"}],"/Users/jkrez/src/airpair.com/public/common/models/postsService.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/common/models/sessionService.js":[function(require,module,exports){
"use strict";
angular.module('APSvcSession', []).constant('API', '/v1/api').constant('Auth', '/v1/auth').service('SessionService', ['$http', 'API', 'Auth', '$cacheFactory', function($http, API, Auth, $cacheFactory) {
  var cache;
  this.getSession = function() {
    cache = cache || $cacheFactory();
    return $http.get((API + "/session/full"), {cache: cache}).then(function(response) {
      return response.data;
    });
  };
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
    $http.post((Auth + "/login"), data).success(success).error(error);
  };
  this.signup = function(data, success, error) {
    $http.post((Auth + "/signup"), data).success(success).error(error);
  };
  this.updateTag = function(data, success, error) {
    $http.put((API + "/users/me/tag/" + data.slug), {}).success(success).error(error);
  };
  this.updateBookmark = function(data, success, error) {
    $http.put((API + "/users/me/bookmarks/" + data.type + "/" + data.objectId), {}).success(success).error(error);
  };
}]);


},{}],"/Users/jkrez/src/airpair.com/public/common/pageHelpers.js":[function(require,module,exports){
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
window.pageHlpr.fixPostRail = function() {
  var scrollingOn = $(document).width() > 900;
  var offset = $('.pw-widget').offset().top;
  $(window).scroll(function(e) {
    if (window.scrollY < offset) {
      $('.share').css('top', 0);
      $('#table-of-contents').css('top', 0);
      $('#table-of-contents + ul').css('top', 0);
    } else if (scrollingOn) {
      $('.share').css('top', window.scrollY - 150);
      $('#table-of-contents').css('top', window.scrollY - 160);
      $('#table-of-contents + ul').css('top', window.scrollY - 160);
    }
  });
};


},{}],"/Users/jkrez/src/airpair.com/public/common/routes/helpers.js":[function(require,module,exports){
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/jkrez/src/airpair.com/shared/util.js":[function(require,module,exports){
"use strict";
var idsEqual = (function(id1, id2) {
  return id1.toString() == id2.toString();
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
  })
};


},{}]},{},["./public/common/lite.js"]);
