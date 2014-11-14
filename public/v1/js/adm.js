(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/models/adminDataService.js');
require('./../adm/posts/module.js');
require('./../adm/users/module.js');
require('./../adm/redirects/module.js');
angular.module("ADM", ['ngRoute', 'APSvcSession', 'ADMPosts', 'ADMUsers', 'ADMRedirects']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', 'SessionService', function($rootScope, $location, SessionService) {
  SessionService.onAuthenticated((function(session) {}));
}]);
;

//# sourceMappingURL=<compileOutput>


},{"./../adm/posts/module.js":4,"./../adm/redirects/module.js":6,"./../adm/users/module.js":8,"./../common/directives/post.js":10,"./../common/directives/tagInput.js":13,"./../common/filters/filters.js":14,"./../common/models/adminDataService.js":15,"./../common/models/postsService.js":16,"./../common/models/sessionService.js":17}],2:[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\r\n <header class=\"entry-header\">\r\n    <img class=\"entry-header-image\" itemprop=\"image\" ng-src=\"{{ post.meta.ogImage }}\" align=\"left\" />\r\n\r\n    <span class=\"entry-categories\">\r\n      <a ng-repeat='tag in post.tags' href=\"#\" title=\"View all posts in {{ tag.name }}\" rel=\"category tag\">{{ '{'+tag.slug+'}' }}</a>\r\n    </span>\r\n\r\n    <p class=\"entry-meta\">\r\n      <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\r\n        <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\r\n      </span>\r\n    <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\r\n      <br />Updated\r\n      {{ post.updated | agoTime }}\r\n      <span ng-if=\"post.published\">,\r\n      Published {{ post.published | agoTime }}</span>\r\n      <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time>\r\n    </p>\r\n  </header>\r\n  <div class=\"entry-content\" itemprop=\"text\">\r\n    <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2>\r\n    <p>{{ post.meta.description }}</p>\r\n  </div>\r\n\r\n  <footer class=\"entry-footer\" style=\"width:50%\">\r\n    <ul>\r\n      <li><a href=\"/posts/edit/{{ post._id }}\" target=\"_blank\">Edit</a></li>\r\n      <li><a href=\"/posts/publish/{{ post._id }}\" target=\"_blank\">Publish</a></li>\r\n      <li ng-if=\"post.published\"><a href=\"{{ post.url }}\" target=\"_blank\">View</a></li>\r\n    </ul>\r\n\r\n    <p class=\"entry-meta\">\r\n\r\n    </p>\r\n  </footer>\r\n</article>\r\n";

},{}],3:[function(require,module,exports){
module.exports = "<section id=\"posts\">\r\n\r\n  <h3>Recently updated <span><a href=\"/posts/all\" target=\"_blank\">All posts</a></span></h3>\r\n  <div class=\"posts recent\">\r\n    <ap-post-list-item post=\"p\" ng-repeat=\"p in recent\"></ap-post-list-item>\r\n  </div>\r\n\r\n</section>\r\n";

},{}],4:[function(require,module,exports){
"use strict";
angular.module("ADMPosts", ['ngRoute', 'APSvcAdmin', 'APSvcPosts', 'APFilters']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/adm/posts', {
    template: require('./list.html'),
    controller: 'PostsCtrl as posts'
  });
}]).directive('apPostListItem', ['$parse', function($parse) {
  return {
    template: require('./item.html'),
    link: function(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post);
    }
  };
}]).controller('PostsCtrl', ['$scope', 'PostsService', 'AdmDataService', function($scope, PostsService, AdmDataService) {
  AdmDataService.getPosts(function(result) {
    $scope.recent = result;
  });
}]);

//# sourceMappingURL=<compileOutput>


},{"./item.html":2,"./list.html":3}],5:[function(require,module,exports){
module.exports = "<section id=\"redirects\">\r\n\r\n  <h3>Redirects </h3>\r\n\r\n  <div style=\"float:right\">note a restart is necessary for the redirects to take effect</div>\r\n\r\n  <input type=\"text\" ng-model='previous' placeholder=\"From\" />\r\n  <input type=\"text\" ng-model='current' placeholder=\"To\" />\r\n  <button id=\"btnCreateRedirect\" ng-click=\"createRedirect()\" class=\"btn\">Create</button>\r\n\r\n  <hr />\r\n\r\n  <div class=\"redirects\">\r\n    <ul>\r\n      <li ng-repeat=\"r in redirects\">\r\n        <time>{{ r._id | objectIdToDate : 'MM.DD' }}</time>\r\n        <label><a href=\"{{ r.previous }}\" target=\"_blank\">{{ r.previous }}</a></label>\r\n        <span><a href=\"#\" ng-click=\"deleteRedirect(r._id)\">x</a>===> {{ r.current }}</span>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n</section>\r\n";

},{}],6:[function(require,module,exports){
"use strict";
angular.module("ADMRedirects", ['ngRoute', 'APSvcAdmin', 'APFilters']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/adm/redirects', {
    template: require('./list.html'),
    controller: 'RedirectsCtrl as redirects'
  });
}]).controller('RedirectsCtrl', ['$scope', 'AdmDataService', function($scope, AdmDataService) {
  AdmDataService.getRedirects(function(result) {
    $scope.redirects = result;
  });
  $scope.createRedirect = function() {
    var d = {
      previous: $scope.previous,
      current: $scope.current
    };
    AdmDataService.createRedirect(d, function(result) {
      $scope.redirects.push(result);
    });
  };
  $scope.deleteRedirect = function(id) {
    AdmDataService.deleteRedirect(id, function() {
      var r = _.find($scope.redirects, (function(r) {
        return r._id == id;
      }));
      $scope.redirects = _.without($scope.redirects, r);
    });
  };
}]);

//# sourceMappingURL=<compileOutput>


},{"./list.html":5}],7:[function(require,module,exports){
module.exports = "<section id=\"users\">\r\n\r\n  <br /><br />\r\n  <input type=\"text\" ng-model=\"_id\" placeholder=\"Type userId\" style=\"width:300px\" />\r\n  <select ng-model=\"role\">\r\n    <option>admin</option>\r\n    <option>editor</option>\r\n  </select>\r\n  <button class=\"btn\" ng-click=\"toggleRole()\">Toggle role</button>\r\n\r\n\r\n  <h3>Admins</h3>\r\n  <ul class=\"users admin\">\r\n    <li ng-repeat=\"user in admins\">{{ user.name }}</li>\r\n  </ul>\r\n\r\n  <h3>Editors</h3>\r\n  <ul class=\"users editors\">\r\n    <li ng-repeat=\"user in editors\">{{ user.name }}</li>\r\n  </ul>\r\n\r\n</section>\r\n";

},{}],8:[function(require,module,exports){
"use strict";
angular.module("ADMUsers", ['ngRoute', 'APSvcAdmin', 'APFilters']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/adm/users', {
    template: require('./list.html'),
    controller: 'UsersCtrl as users'
  });
}]).controller('UsersCtrl', ['$scope', 'AdmDataService', function($scope, AdmDataService) {
  $scope.role = "editor";
  AdmDataService.getUsersInRole({role: 'admin'}, function(result) {
    $scope.admins = result;
  });
  AdmDataService.getUsersInRole({role: 'editor'}, function(result) {
    $scope.editors = result;
  });
  $scope.toggleRole = function() {
    AdmDataService.toggleRole({
      _id: $scope._id,
      role: $scope.role
    }, function(result) {
      AdmDataService.getUsersInRole({role: $scope.role}, function(result) {
        $scope[$scope.role + 's'] = result;
      });
    });
  };
}]);

//# sourceMappingURL=<compileOutput>


},{"./list.html":7}],9:[function(require,module,exports){
module.exports = "<div class=\"preview\">\r\n  <article class=\"blogpost\">\r\n    <h1 class=\"entry-title\" itemprop=\"headline\">{{ post.title || \"Type post title ...\" }}</h1>\r\n    <h4 id=\"table-of-contents\" ng-if=\"preview.toc\">Table of Contents</h4>\r\n    <ul id=\"previewToc\" ng-bind-html=\"preview.toc | markdownHtml\"></ul>\r\n    <figure class=\"author\">\r\n      <img ng-alt=\"{{post.by.name}}\" ng-src=\"{{post.by.avatar}}?s=100\">\r\n      <figcaption>\r\n        {{post.by.bio}}\r\n      </figcaption>\r\n    </figure>\r\n    <p class=\"asset\" ng-bind-html=\"preview.asset | markdownHtml\" ng-if=\"post.title && post.by.bio\"></p>\r\n    <hr />\r\n    <div id=\"body\" ng-bind-html=\"preview.body | markdownHtml\"></div>\r\n  </article>\r\n</div>\r\n\r\n<hr />\r\n";

},{}],10:[function(require,module,exports){
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


},{"./post.html":9,"./postListItem.html":11}],11:[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\r\n  <a href=\"{{ post.url }}\" title=\"{{ post.title }}\" target=\"_self\" rel=\"bookmark\">\r\n    <header class=\"entry-header\">\r\n      <img class=\"entry-header-image\" itemprop=\"image\" ng-src=\"{{ post.meta.ogImage }}\" align=\"left\" />\r\n\r\n      <span class=\"entry-categories\">\r\n        <em ng-repeat='tag in post.tags'>{{ '{'+tag.slug+'}' }}</em>\r\n      </span>\r\n\r\n      <p class=\"entry-meta\">\r\n\r\n        <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\r\n          <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\r\n          <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\r\n          <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time>\r\n\r\n        </span>\r\n      </p>\r\n    </header>\r\n    <div class=\"entry-content\" itemprop=\"text\">\r\n      <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2>\r\n      <p>{{ post.meta.description }}</p>\r\n\r\n    </div>\r\n  </a>\r\n  <footer class=\"entry-footer\">\r\n    <bookmarker type=\"post\" object-id=\"post._id\"></bookmarker>\r\n  </footer>\r\n</article>\r\n";

},{}],12:[function(require,module,exports){
module.exports = "<div class=\"form-group tag-input-group\">\r\n  <div class=\"nomobile\">This feature is not available on mobile</div>\r\n\r\n  <div class=\"drag\">\r\n    <p>\r\n      <b>drag in order of importance</b>\r\n      <br />place most used first\r\n    </p>\r\n  </div>\r\n  <div class=\"selected\">\r\n    <label for=\"tagInput\">Your stack</label>\r\n\r\n    <ul class=\"tags\" sortable get='tags' set='updateTags'>\r\n      <li ng-repeat=\"tag in tags() | orderBy:'sort'\" ng-attr-data-id=\"{{tag._id}}\">\r\n        {{tag.slug}}\r\n        <a class=\"remove\" ng-click=\"deselectMatch(tag)\">x</a>\r\n        <a class=\"order\" href=\"#\"></a>\r\n      </li>\r\n    </ul>\r\n\r\n    <p ng-if=\"!tags() || tags().length == 0\">No tags selected yet.</p>\r\n  </div>\r\n\r\n  <label for=\"tagInput\">Search technologies</label>\r\n  <input type=\"text\" class=\"tagInput form-control\"\r\n    placeholder=\"type a technology (e.g. javascript)\"\r\n    ng-model=\"q\"\r\n    typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\"\r\n    typeahead-editable=\"false\"\r\n    typeahead-input-formatter=\"keypressSelect($model)\" tabindex=\"100\"\r\n    typeahead-template-url=\"tagMatch.html\"\r\n    >\r\n  <!-- typeahead-loading=\"loading\"\r\n  <i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\r\n   -->\r\n</div>\r\n\r\n<script type=\"text/ng-template\" id=\"tagMatch.html\">\r\n  <div>\r\n    <a class=\"tagSelect\">\r\n      <span bind-html-unsafe=\"match.model.slug | typeaheadHighlight:query\"></span>\r\n      <p bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></p>\r\n    </a>\r\n  </div>\r\n</script>\r\n";

},{}],13:[function(require,module,exports){
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


},{"./tagInput.html":12}],14:[function(require,module,exports){
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


},{"../../../shared/util.js":18}],15:[function(require,module,exports){
"use strict";
var lazyErrorCb = function(resp) {
  console.log('error:', resp);
};
angular.module('APSvcAdmin', []).constant('APIAdm', '/v1/api/adm').service('AdmDataService', ['$http', 'APIAdm', function($http, APIAdm) {
  this.getPosts = function(success) {
    $http.get((APIAdm + "/posts")).success(success).error(lazyErrorCb);
  };
  this.getUsersInRole = function(data, success) {
    $http.get((APIAdm + "/users/role/" + data.role)).success(success).error(lazyErrorCb);
  };
  this.toggleRole = function(data, success) {
    $http.put((APIAdm + "/users/" + data._id + "/role/" + data.role), data).success(success).error(lazyErrorCb);
  };
  this.getRedirects = function(success) {
    $http.get((APIAdm + "/redirects")).success(success).error(lazyErrorCb);
  };
  this.createRedirect = function(data, success) {
    $http.post((APIAdm + "/redirects"), data).success(success).error(lazyErrorCb);
  };
  this.deleteRedirect = function(id, success) {
    $http.delete((APIAdm + "/redirects/" + id)).success(success).error(lazyErrorCb);
  };
}]);

//# sourceMappingURL=<compileOutput>


},{}],16:[function(require,module,exports){
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


},{}],17:[function(require,module,exports){
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


},{}],18:[function(require,module,exports){
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
      return false;
    var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '');
    return botPattern.test(source);
  })
};

//# sourceMappingURL=<compileOutput>


},{}]},{},[1]);
