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
  SessionService.onAuthenticated((function(session) {
    $rootScope.session = session;
  }));
}]);
;


},{"./../adm/posts/module.js":4,"./../adm/redirects/module.js":6,"./../adm/users/module.js":8,"./../common/directives/post.js":10,"./../common/directives/tagInput.js":13,"./../common/filters/filters.js":14,"./../common/models/adminDataService.js":15,"./../common/models/postsService.js":16,"./../common/models/sessionService.js":17}],2:[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\n <header class=\"entry-header\">\n    <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2>\n    <p class=\"entry-meta\">\n      <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time>\n      <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\n        <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\n      </span>\n      <br />Updated\n      {{ post.updated | agoTime }}\n      <span ng-if=\"post.published\">,\n      Published {{ post.published | agoTime }}</span>\n    </p>\n  </header>\n  <div class=\"entry-content\" itemprop=\"text\">\n    <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\n    <p>{{ post.meta.description }}</p>\n  </div>\n\n  <footer class=\"entry-footer\">\n    <ul>\n      <li><a href=\"/posts/edit/{{ post._id }}\" target=\"_blank\">Edit</a></li>\n      <li><a href=\"/posts/publish/{{ post._id }}\" target=\"_blank\">Publish</a></li>\n      <li ng-if=\"post.published\"><a href=\"{{ post.url }}\" target=\"_blank\">View</a></li>\n    </ul>\n\n    <p class=\"entry-meta\">\n      <span class=\"entry-categories\">\n        <a ng-repeat='tag in post.tags' href=\"#\" title=\"View all posts in {{ tag.name }}\" rel=\"category tag\">{{ '{'+tag.slug+'}' }}</a>\n      </span>\n    </p>\n  </footer>\n</article>\n";

},{}],3:[function(require,module,exports){
module.exports = "<section id=\"posts\">\n\n  <h3>Recently updated <span><a href=\"/posts/all\" target=\"_blank\">All posts</a></span></h3>\n  <div class=\"posts recent\">\n    <ap-post-list-item post=\"p\" ng-repeat=\"p in recent\"></ap-post-list-item>\n  </div>\n\n</section>\n";

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


},{"./item.html":2,"./list.html":3}],5:[function(require,module,exports){
module.exports = "<section id=\"redirects\">\n\n  <h3>Redirects </h3>\n\n  <div style=\"float:right\">note a restart is necessary for the redirects to take effect</div>\n\n  <input type=\"text\" ng-model='previous' placeholder=\"From\" />\n  <input type=\"text\" ng-model='current' placeholder=\"To\" />\n  <button id=\"btnCreateRedirect\" ng-click=\"createRedirect()\" class=\"btn\">Create</button>\n\n  <hr />\n\n  <div class=\"redirects\">\n    <ul>\n      <li ng-repeat=\"r in redirects\">\n        <time>{{ r._id | objectIdToDate : 'MM.DD' }}</time>\n        <label><a href=\"{{ r.previous }}\" target=\"_blank\">{{ r.previous }}</a></label>\n        <span><a href=\"#\" ng-click=\"deleteRedirect(r._id)\">x</a>===> {{ r.current }}</span>\n      </li>\n    </ul>\n  </div>\n\n</section>\n";

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


},{"./list.html":5}],7:[function(require,module,exports){
module.exports = "<section id=\"users\">\n\n\t<br /><br />\n\t<input type=\"text\" ng-model=\"_id\" placeholder=\"Type userId\" style=\"width:300px\" />\n\t<select ng-model=\"role\">\n\t\t<option>admin</option>\n\t\t<option>editor</option>\n\t</select>\n\t<button class=\"btn\" ng-click=\"toggleRole()\">Toggle role</button>\n\n\n\t<h3>Admins</h3>\n\t<ul class=\"users admin\">\n\t\t<li ng-repeat=\"user in admins\">{{ user.name }}</li>\n\t</ul>\n\n\t<h3>Editors</h3>\n\t<ul class=\"users editors\">\n\t\t<li ng-repeat=\"user in editors\">{{ user.name }}</li>\n\t</ul>\n\t<!--\n\t<h3>Pipeliners</h3>\n\t<ul class=\"users pipeliners\">\n\t<li ng-repeat=\"user in pipeliners\">{{ user.name }}</li>\n\t</ul>\n\n\n\t<h3>Matchmakers</h3>\n\t<ul class=\"users matchmakers\">\n\t<li ng-repeat=\"user in matchmakers\">{{ user.name }}</li>\n\t</ul>\n\n\t -->\n</section>\n";

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


},{"./list.html":7}],9:[function(require,module,exports){
module.exports = "<div class=\"preview\">\n  <article class=\"blogpost\">\n    <h1 class=\"entry-title\" itemprop=\"headline\">{{ post.title || \"Type post title ...\" }}</h1>\n    <h4 id=\"table-of-contents\" ng-if=\"preview.toc\">Table of Contents</h4>\n    <ul id=\"previewToc\" ng-bind-html=\"preview.toc | markdownHtml\"></ul>\n    <figure class=\"author\">\n      <img ng-alt=\"{{post.by.name}}\" ng-src=\"{{post.by.avatar}}?s=100\">\n      <figcaption>\n        {{post.by.bio}}\n      </figcaption>\n    </figure>\n    <p class=\"asset\" ng-bind-html=\"preview.asset | markdownHtml\" ng-if=\"post.title && post.by.bio\"></p>\n    <hr />\n    <div id=\"body\" ng-bind-html=\"preview.body | markdownHtml\"></div>\n  </article>\n</div>\n\n<hr />\n";

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
        postHlpr.highlightSyntax();
      }, 100);
    }
  };
});
;


},{"./post.html":9,"./postListItem.html":11}],11:[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\n\t<a href=\"{{ post.url }}\" title=\"{{ post.title }}\" target=\"_self\" rel=\"bookmark\">\n\t  <header class=\"entry-header\">\n\t    <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2>\n\t    <p class=\"entry-meta\">\n\t      <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time>\n\t      by\n\t      <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\n\t        <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\n\t      </span>\n\t    </p>\n\t  </header>\n\t  <div class=\"entry-content\" itemprop=\"text\">\n\t    <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\n\t    <p>{{ post.meta.description }}</p>\n\t  </div>\n\t</a>\n  <footer class=\"entry-footer\">\n    <p class=\"entry-meta\">\n      <span class=\"entry-categories\">\n        <a ng-repeat='tag in post.tags' href=\"#\" title=\"View all posts in {{ tag.name }}\" rel=\"category tag\">{{ '{'+tag.slug+'}' }}</a>\n      </span>\n    </p>\n  </footer>\n</article>\n";

},{}],12:[function(require,module,exports){
module.exports = "<script type=\"text/ng-template\" id=\"template/typeahead/typeahead-match.html\">\n  <a>\n    <label bind-html-unsafe=\"match.model.name | typeaheadHighlight:query\"></label>\n    <br /><span bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></span>\n  </a>\n</script>\n\n    \n<input type=\"text\" \n  placeholder=\"Type technology\" \n  class=\"form-control\"\n  ng-model=\"q\" \n  typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\" \n  >\n<!-- typeahead-loading=\"loading\"\n<i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\n -->Tags: <label ng-repeat=\"tag in post.tags\">{ {{tag.name}} } <a ng-click=\"deselectMatch(tag)\" style=\"color:red\">x</a> &nbsp </label>\n";

},{}],13:[function(require,module,exports){
"use strict";
angular.module('APTagInput', ['ui.bootstrap']).value('acceptableTagsSearchQuery', function(value) {
  return value && (value.length >= 2 || /r/i.test(value));
}).directive('tagInput', ['acceptableTagsSearchQuery', function(acceptableTagsSearchQuery) {
  return {
    restrict: 'EA',
    template: require('./tagInput.html'),
    controller: ['$attrs', '$scope', '$http', function($attrs, $scope, $http) {
      $scope.getTags = function(q) {
        if (!acceptableTagsSearchQuery(q)) {
          return [];
        }
        return $http.get('v1/api/tags/search/' + q).then(function(res) {
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
        var tags = $scope.post.tags;
        if (_.contains(tags, tag))
          $scope.post.tags = _.without(tags, tag);
        else
          $scope.post.tags = _.union(tags, [tag]);
        $scope.q = "";
      };
      $scope.deselectMatch = function(match) {
        $scope.post.tags = _.without($scope.post.tags, match);
      };
    }]
  };
}]);
;


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


},{}],17:[function(require,module,exports){
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
}]);


},{}],18:[function(require,module,exports){
"use strict";
var idsEqual = (function(id1, id2) {
  return id1.toString() == id2.toString();
});
module.exports = {
  idsEqual: idsEqual,
  ObjectId2Date: (function(id) {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000);
  }),
  toggleItemInArray: (function(array, item) {
    if (!array)
      return [item];
    else {
      var existing = _.find(array, (function(i) {
        return idsEqual(i._id, item._id);
      }));
      if (existing)
        return _.without(array, existing);
      else
        return array.push(t);
    }
  }),
  sessionCreatedAt: (function(session) {
    return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge, 'ms').toDate();
  }),
  dateWithDayAccuracy: (function() {
    return moment('yyyy-MM-dd', moment().format('yyyy-MM-dd')).toDate();
  })
};


},{}]},{},[1]);
