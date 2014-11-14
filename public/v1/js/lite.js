(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
require('./../common/directives/share.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/bookmarker.js');
require('./../common/directives/analytics.js');
require('./../common/directives/forms.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/pageHelpers.js');
require('./../auth/module.js');
angular.module("AP", ['ngRoute', 'APFilters', 'APAnalytics', 'APSideNav', 'APBookmarker', 'APAuth']).config(['$provide', function($provide) {}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
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

//# sourceMappingURL=<compileOutput>


},{"./../auth/module.js":3,"./../common/directives/analytics.js":5,"./../common/directives/bookmarker.js":6,"./../common/directives/forms.js":8,"./../common/directives/share.js":11,"./../common/directives/sideNav.js":13,"./../common/directives/tagInput.js":16,"./../common/filters/filters.js":17,"./../common/models/postsService.js":18,"./../common/models/sessionService.js":19,"./../common/pageHelpers.js":20}],2:[function(require,module,exports){
module.exports = "<header>Login</header>\n<section id=\"auth\" ng-controller=\"LoginCtrl as LoginCtrl\">\n\n<h3>Welcome back.</h3>\n\n<p ng-if=\"session._id\"><br /><br />You are logged in as {{ session.email }}. <br /><br />Want to <a href=\"/v1/auth/logout\">Logout</a>?</p>\n\n\n<div class=\"choice\" ng-if=\"!session._id\">\n<div class=\"google option\">\n\n  <h2>One-click login</h2>\n  <p>\n    <a class=\"btn btn-error\" href=\"/v1/auth/google\" target=\"_self\">Login with google</a>\n  </p>\n  <p style=\"font-size:12px;margin:20px 0 0 0\">\n\n  * You will be temporarily redirected to a google login page</p>\n\n</div>\n\n<div class=\"local option\">\n\n  <h2>Password login</h2>\n\n  <form novalidate name=\"loginForm\" ng-submit=\"LoginCtrl.submit(loginForm.$valid, data)\">\n    <div form-group>\n      <label class=\"control-label sr-only\" for=\"loginEmail\">Email</label>\n      <input id=\"loginEmail\" form-control type=\"email\" placeholder=\"Email\" name=\"email\" ng-model=\"data.email\" required>\n      <div class=\"error\" ng-if=\"formGroup.showError(loginForm.email)\" ng-messages=\"loginForm.email.$error\">\n        <div ng-message=\"required\">Field required</div>\n        <div ng-message=\"email\">Invalid email</div>\n      </div>\n    </div>\n    <div form-group>\n      <label class=\"control-label sr-only\" for=\"loginPassword\">Password</label>\n      <input id=\"loginPassword\" form-control type=\"password\" placeholder=\"Password\" name=\"password\" ng-model=\"data.password\" required>\n      <div class=\"error\" ng-if=\"formGroup.showError(loginForm.password)\" ng-messages=\"loginForm.password.$error\">\n        <div ng-message=\"required\">Password required</div>\n      </div>\n    </div>\n\n    <button type=\"submit\" class=\"btn btn-warning btn-lg\">Login</button>\n\n    <div class=\"error\" ng-if=\"loginFail\">\n      <b>Login failed:</b> <span ng-if=\"loginFail\">{{loginFail.message}}</span>\n    </div>\n  </form>\n\n\n  <p>New? <a href=\"#\" ng-click=\"openProfile()\">Create an account</a>.</p>\n\n</div>\n</div>\n\n</section>\n";

},{}],3:[function(require,module,exports){
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


},{"./../common/routes/helpers.js":21,"./login.html":2,"./signup.html":4}],4:[function(require,module,exports){
module.exports = "<header>Sign up</header>\n<section id=\"auth\">\n\n  <div class=\"choice\">\n  <div class=\"signup option\">\n\n    <h2>Signup</h2>\n\n    <form novalidate ng-submit=\"SignupCtrl.submit(signupForm.$valid, data)\" name=\"signupForm\" ng-controller=\"SignupCtrl as SignupCtrl\">\n      <div class=\"form-group\">\n        <label>Full name</label>\n        <input type=\"name\" placeholder=\"Full name\" class=\"form-control\" name=\"name\" ng-model=\"data.name\" required >\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n          <div ng-if=\"signupForm.email.$error.required\">Full name required</div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label>Email</label>\n        <input type=\"email\" placeholder=\"Email\" class=\"form-control\" name=\"email\" ng-model=\"data.email\" required >\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.email.$touched\">\n          <div ng-if=\"signupForm.email.$error.required\">Email required</div>\n          <div ng-if=\"signupForm.email.$error.email\">Invalid email</div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label>Password</label>\n        <input type=\"password\" placeholder=\"Password\" class=\"form-control\" name=\"password\" ng-model=\"data.password\" required>\n        <div class=\"error\" ng-if=\"signupForm.$submitted || signupForm.password.$touched\">\n          <div ng-if=\"signupForm.password.$error.required\">Password required</div>\n        </div>\n      </div>\n\n      <button type=\"submit\" class=\"btn btn-warning btn-lg\">Sign up</button>\n\n      <div class=\"error\" ng-if=\"signupFail\">\n        <b>Sign up failed:</b> <span ng-if=\"signupFail\">{{signupFail}}</span>\n      </div>\n    </form>\n\n  </div>\n  </div>\n\n  <h3>Already have an account?</h3>\n\n  <p><a href=\"/v1/auth/login\"><b>Login</b></a> with Google or an email and password</a>.</p>\n\n</section>\n";

},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
"use strict";
angular.module("APBookmarker", ['APSvcSession']).directive('bookmarker', ['SessionService', function(SessionService) {
  return {
    restrict: 'EA',
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
        var success = function(result) {};
        SessionService.updateBookmark(data, success, (function(e) {
          return alert(e.message);
        }));
      };
    }]
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{}],7:[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Bookmark AirPair Content</h3>\n</div>\n<div class=\"modal-body bookmarks bookmark-input-group\">\n\n  <p>Collect your favorite <a href=\"/posts\">posts</a>, <a href=\"/workshops\">workshops</a> and experts.</p>\n\n  <ul class=\"bookmarks\" sortable sort='bookmarks' service='bookmarks'>\n    <li ng-repeat=\"b in session.bookmarks | orderBy:'sort'\" ng-attr-data-id=\"{{b._id}}\">\n      <a href=\"{{b.url}}\" target=\"_self\">{{b.title}}</a>\n      <a class=\"remove\" href=\"#\" ng-click=\"deselectBookmark(b)\">x</a>\n      <a class=\"order\" href=\"#\"></a>\n    </li>\n </ul>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Account info</h3>\n  <a href=\"#\" class=\"close\" ng-click=\"cancel()\">x</a>\n</div>\n\n<div ng-if=\"session._id\" class=\"success\">\n  <div class=\"modal-body profile\">\n    <h2>Account successfully created.</h2>\n  </div>\n\n  <div class=\"modal-footer profile\">\n    <button ng-click=\"cancel()\" class=\"btn btn-primary\">Continue</button>\n  </div>\n</div>\n\n\n<form ng-if=\"!session._id\" id=\"profileForm\" novalidate name=\"profileForm\" ng-submit=\"submit(profileForm.$valid, data)\">\n\n  <div class=\"modal-body profile\">\n\n  <section>\n    <section style=\"height:40px\">\n     <p ng-if=\"!session.email\"><i>{{ avatarQuestion }}</i> <span ng-if=\"!session.email\">Enter your email address to fix your avatar.</span></p>\n     <p ng-if=\"session.email\">Save your name and password to get $10 credit.</p>\n\n    </section>\n\n    <section class=\"avatar\">\n      <img class=\"avatar\" ng-src=\"{{session.avatar}}?s=230\" title=\"Avatars are gravtars generated from your email.\" />\n      <p style=\"font-size:12px\">\n        <span ng-if=\"session.email\">Update the <b><a href=\"http://www.gravatar.com/\" target=\"_blank\">gravatar</a></b> for <br />{{ session.email }}</span>\n        <span ng-if=\"!session.email\">Enter an email address</span>\n        <br /> to change your profile pic.\n      </p>\n      <!-- <hr />\n      <label>Account Credit</label> <b style=\"font-size:26px;color:black\">$10</b> <br />available when you sign up -->\n\n    </section>\n\n    <section class=\"google\">\n    \tHate signup forms and remembering passwords? <br /><br /><a href=\"/v1/auth/google\" target=\"_self\"><b>Sign in with your Google account instead</b></a>.\n    </section>\n\n    <section class=\"info\">\n\n      <div form-group>\n        <label class=\"control-label\" for=\"signupEmail\">Email</label>\n        <input id=\"signupEmail\" name=\"email\" form-control type=\"email\" placeholder=\"Primary contact email\" ng-model=\"data.email\" ng-blur=\"updateEmail(profileForm.email)\" required tabindex=\"1\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.email)\" ng-messages=\"profileForm.email.$error\">\n          <div ng-message=\"required\">Email required</div>\n          <div ng-message=\"email\">Invalid email</div>\n        </div>\n        <span class=\"error\">{{ emailChangeFailed }}</span>\n      </div>\n\n      <div form-group ng-if=\"session.email\">\n        <label class=\"control-label\" for=\"sessionName\">Full name </label>\n        <input id=\"signupName\" name=\"name\" form-control type=\"text\" placeholder=\"Full name\" ng-model=\"data.name\" required ng-minlength=\"4\" ng-minlength=\"60\" ng-pattern=\"/\\w+ \\w+/\" tabindex=\"2\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.name)\" ng-messages=\"profileForm.name.$error\">\n          <div ng-message=\"required\">Name required</div>\n          <div ng-message=\"minlength\">Full name required (e.g. John Smith)</div>\n          <div ng-message=\"pattern\">Full name required (e.g. John Smith)</div>\n          <div ng-message=\"maxlength\">Full name max length 60 chars</div>\n        </div>\n      </div>\n\n      <div form-group ng-if=\"data.name\">\n        <label class=\"control-label\" for=\"signupPassword\">Password </label>\n        <input id=\"signupPassword\" name=\"password\" form-control type=\"password\" placeholder=\"Password\" ng-model=\"data.password\" required ng-minlength=\"5\" ng-maxlength=\"10\" tabindex=\"3\">\n        <div class=\"error\" ng-if=\"formGroup.showError(profileForm.password)\" ng-messages=\"profileForm.password.$error\">\n          <div ng-message=\"required\">Password required</div>\n          <div ng-message=\"minlength\">Password min length 5 chars</div>\n          <div ng-message=\"maxlength\">Password max length 10 chars</div>\n        </div>\n      </div>\n\n    </section>\n\n  </section>\n\n  </div>\n\n  <div class=\"modal-footer profile\">\n    <button type=\"submit\" class=\"btn btn-primary\">Create account</button>\n    <span class=\"error\">{{ signupFail }}</span>\n  </div>\n\n\n</form>\n";

},{}],10:[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\">\n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>\n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>\n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>\n</div>\n";

},{}],11:[function(require,module,exports){
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


},{"./share.html":10}],12:[function(require,module,exports){
module.exports = "<header>\n  <img id=\"sideNavToggle\" track-click=\"SideNav\" data=\"{{ toggleAction }}\" track-click-if=\"!session._id\" ng-click=\"sideNav.toggle()\" src=\"/v1/img/css/sidenav/toggle.png\" />\n</header>\n\n<section class=\"welcome\" ng-if=\"session.authenticated == false\">\n\n  <figure><a id=\"navWelcomeAvatar\" track-click=\"SideNav\" ng-click=\"openProfile()\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}\" /></a></figure>\n\n  <ul class=\"main\">\n    <li ng-if=\"!session.email\">Want your real face?</li>\n    <li ng-if=\"!session.email\"><a id=\"navEditProfile\" href=\"#\" track-click=\"SideNav\" ng-click=\"openProfile()\">Edit your profile</a></li>\n    <li ng-if=\"session.email\">Get $10 credit?</li>\n    <li ng-if=\"session.email\"><a id=\"navEditProfile\" href=\"#\" track-click=\"SideNav\" ng-click=\"openProfile()\">Finish your profile</a></li>\n    <li>Already in the tribe?</li>\n    <li><a id=\"navLogin\" href=\"/v1/auth/login\" track-click=\"SideNav\">Login</a></li>\n    <li>Why join?</li>\n  </ul>\n  <a id=\"navAbout\" track-click=\"SideNav\" href=\"/about\" class=\"icon\">\n    <span>Read about AirPair</span><img src=\"/v1/img/css/sidenav/airpair.png\" />\n  </a>\n</section>\n\n\n<section ng-if=\"session._id\">\n  <figure><a href=\"/me\"><img class=\"avatar\" ng-src=\"{{ session.avatar }}?s=120\" /></a></figure>\n</section>\n\n<section class=\"main\" ng-if=\"session._id\"> <label>{{ session.name.split(' ')[0] }}</label>\n  <ul>\n    <li><a href=\"mailto:team@airpair.com?Subject=Bug spotted!\" target=\"_blank\">see a bug?</a></li>\n    <!-- <li><a href=\"/\" target=\"_self\">dashboard (old)</a></li> -->\n    <li><a href=\"/billing\">billing</a></li>\n    <!-- <li><a href=\"#\">airpairs</a></li> -->\n    <!-- <li><a href=\"#\">settings</a></li> -->\n    <li><a href=\"/v1/auth/logout\" target=\"_self\">logout</a></li>\n  </ul>\n</section>\n\n\n<section class=\"stack\"> <label>Stack</label>\n  <ul>\n    <li ng-repeat=\"tag in session.tags | orderBy:'sort'\">\n      <a href=\"/posts/tag/{{tag.slug}}\">{{tag.name}}</a>\n    </li>\n  </ul>\n  <a id=\"navStackToggle\" track-click=\"SideNav\" href=\"#\" ng-click=\"openStack()\" class=\"icon\">\n    <span>Customize</span><img src=\"/v1/img/css/sidenav/stack.png\" /><i>{{ session.tags.length || 0 }}</i>\n  </a>\n</section>\n\n\n<section class=\"bookmarks\"> <label>Bookmarks</label>\n  <ul class=\"bookmarks\">\n    <li ng-repeat=\"bookmark in session.bookmarks | orderBy:'sort'\">\n      <a href=\"{{bookmark.url}}\" target=\"_self\">{{bookmark.title}}</a>\n    </li>\n  </ul>\n  <a id=\"navBookmarksToggle\" track-click=\"SideNav\" href=\"#\" ng-click=\"openBookmarks()\" class=\"icon\"><span> Manage </span> <img src=\"/v1/img/css/sidenav/bookmark.png\" /><i>{{ session.bookmarks.length || 0 }}</i></a>\n</section>\n\n<div stack></div>\n";

},{}],13:[function(require,module,exports){
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
          var property = attrs['sort'];
          var method = attrs['service'];
          var list = scope.session[property];
          var elems = $(element).children();
          for (var i = 0; i < elems.length; i++) {
            var elem = $(elems[i]);
            var obj = _.find(list, (function(t) {
              return t._id === elem.data('id');
            }));
            obj.sort = i;
          }
          SessionService[method](scope.session[property], scope.sortSuccess, scope.sortFail);
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


},{"../../../shared/validation/users.js":23,"./bookmarks.html":7,"./profile.html":9,"./sideNav.html":12,"./stack.html":14}],14:[function(require,module,exports){
module.exports = "<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Customize AirPair to your Stack</h3>\n</div>\n<div class=\"modal-body stack\">\n\n  <p>Personalize AirPair content, by selecting technologies that make up your stack.</p>\n\n  <div tag-input></div>\n\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Done</button>\n  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";

},{}],15:[function(require,module,exports){
module.exports = "<div class=\"form-group tag-input-group\">\n  <div class=\"nomobile\">This feature is not available on mobile</div>\n\n  <div class=\"drag\">\n    <p>\n      <b>drag in order of importance</b>\n      <br />place most used first\n    </p>\n  </div>\n  <div class=\"selected\">\n    <label for=\"tagInput\">Your stack</label>\n\n    <ul class=\"tags\" sortable sort='tags' service='tags'>\n      <li ng-repeat=\"tag in session.tags | orderBy:'sort'\" ng-attr-data-id=\"{{tag._id}}\">\n        {{tag.slug}}\n        <a class=\"remove\" ng-click=\"deselectMatch(tag)\">x</a>\n        <a class=\"order\" href=\"#\"></a>\n      </li>\n    </ul>\n\n    <p ng-if=\"!selectedTags() || selectedTags().length == 0\">No tags selected yet.</p>\n  </div>\n\n  <label for=\"tagInput\">Search technologies</label>\n  <input type=\"text\" class=\"tagInput form-control\"\n    placeholder=\"type a technology (e.g. javascript)\"\n    ng-model=\"q\"\n    typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\"\n    typeahead-editable=\"false\"\n    typeahead-input-formatter=\"keypressSelect($model)\" tabindex=\"100\">\n  <!-- typeahead-loading=\"loading\"\n  <i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\n   -->\n</div>\n\n<script type=\"text/ng-template\" id=\"template/typeahead/typeahead-match.html\">\n  <div>\n    <a class=\"tagSelect\">\n      <span bind-html-unsafe=\"match.model.slug | typeaheadHighlight:query\"></span>\n      <p bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></p>\n    </a>\n  </div>\n</script>\n";

},{}],16:[function(require,module,exports){
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
    controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
      $scope.getTags = function(q) {
        if (badTagsSearchQuery(q)) {
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
        this.deselectTag(match);
      };
    }]
  };
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./tagInput.html":15}],17:[function(require,module,exports){
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


},{"../../../shared/util.js":22}],18:[function(require,module,exports){
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


},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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

//# sourceMappingURL=<compileOutput>


},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
    var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '');
    return botPattern.test(source);
  })
};

//# sourceMappingURL=<compileOutput>


},{}],23:[function(require,module,exports){
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
    if (!password || !password.match(/.{5,10}/))
      return "Invalid password (need min 5, max 10 chars)";
    return "";
  })
};

//# sourceMappingURL=<compileOutput>


},{}]},{},[1]);
