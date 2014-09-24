(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/common/index.js":[function(require,module,exports){
"use strict";
require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/postHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');
angular.module("AP", ['ngRoute', 'APAuth', 'APPosts', 'APWorkshops']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {}]);
;


},{"./../auth/module.js":"/Users/jkrez/src/airpair.com/public/auth/module.js","./../common/directives/post.js":"/Users/jkrez/src/airpair.com/public/common/directives/post.js","./../common/directives/share.js":"/Users/jkrez/src/airpair.com/public/common/directives/share.js","./../common/directives/tagInput.js":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.js","./../common/filters/filters.js":"/Users/jkrez/src/airpair.com/public/common/filters/filters.js","./../common/models/postsService.js":"/Users/jkrez/src/airpair.com/public/common/models/postsService.js","./../common/models/sessionService.js":"/Users/jkrez/src/airpair.com/public/common/models/sessionService.js","./../common/postHelpers.js":"/Users/jkrez/src/airpair.com/public/common/postHelpers.js","./../posts/module.js":"/Users/jkrez/src/airpair.com/public/posts/module.js","./../workshops/module.js":"/Users/jkrez/src/airpair.com/public/workshops/module.js"}],"/Users/jkrez/src/airpair.com/public/auth/login.html":[function(require,module,exports){
module.exports = "<header>Login</header>\n<section id=\"auth\" class=\"choice\">\n\n<h3>Login</h3>\n\n<div class=\"google option\">\n  <h2>Quick login</h2>\n\n  <p> \n    <a class=\"btn btn-error\" href=\"/v1/auth/google\" target=\"_self\">Sign in with google</a>\n  </p>\n\n  <p style=\"font-size:12px;margin:20px 0 0 0\">You will be redirected to a google sign in page.</p>\n\n</div>\n\n<div class=\"local option\">\n\n<h2>Password login</h2>\n\n<!-- LOGIN FORM -->\n<form novalidate ng-submit=\"LoginCtrl.submit(loginForm.$valid, data)\" name=\"loginForm\" ng-controller=\"LoginCtrl as LoginCtrl\">\n  <div class=\"form-group\">\n    <label>Email</label>\n    <input type=\"email\" placeholder=\"Email\" class=\"form-control\" name=\"email\" ng-model=\"data.email\" required >\n    <div ng-if=\"loginForm.$submitted || loginForm.email.$touched\">\n      <div ng-if=\"loginForm.email.$error.required\">Email required</div>\n      <div ng-if=\"loginForm.email.$error.email\">Invalid email</div>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label>Password</label>\n    <input type=\"password\" placeholder=\"Password\" class=\"form-control\" name=\"password\" ng-model=\"data.password\" required>\n    <div ng-if=\"loginForm.$submitted || loginForm.password.$touched\">\n      <div ng-if=\"loginForm.password.$error.required\">Password required</div>\n    </div>    \n  </div>\n\n  <button type=\"submit\" class=\"btn btn-warning btn-lg\">Login</button>\n</form>\n  \n</div>\n</section>\n\n";

},{}],"/Users/jkrez/src/airpair.com/public/auth/module.js":[function(require,module,exports){
"use strict";
var resolver = require('./../common/routes/helpers.js');
angular.module("APAuth", ['ngRoute', 'APFilters', 'APSvcSession']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/v1/auth/login', {template: require('./login.html')});
  $routeProvider.when('/v1/auth/signup', {template: require('./signup.html')});
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {}]).controller('LoginCtrl', ['$scope', 'SessionService', function($scope, SessionService) {
  var self = this;
  this.submit = function(isValid, formData) {
    console.log('validate me biaaat', isValid);
    if (!isValid)
      return;
  };
}]).controller('SignupCtrl', ['$scope', 'SessionService', function($scope, SessionService) {
  var self = this;
  this.submit = function(isValid, formData) {
    console.log('validate me biaaat', isValid);
    if (!isValid)
      return;
  };
}]);
;


},{"./../common/routes/helpers.js":"/Users/jkrez/src/airpair.com/public/common/routes/helpers.js","./login.html":"/Users/jkrez/src/airpair.com/public/auth/login.html","./signup.html":"/Users/jkrez/src/airpair.com/public/auth/signup.html"}],"/Users/jkrez/src/airpair.com/public/auth/signup.html":[function(require,module,exports){
module.exports = "<div class=\"main-wrap\">\n  <main>\n\n    <hr>\n\n    <h2>Signup</h2>\n\n    <form action=\"/v1/auth/signup\" method=\"post\">\n      <div class=\"form-group\">\n        <label>Full name</label>\n        <input type=\"text\" class=\"form-control\" name=\"name\">\n      </div>\n      <div class=\"form-group\">\n        <label>Email</label>\n        <input type=\"text\" class=\"form-control\" name=\"email\">\n      </div>\n      <div class=\"form-group\">\n        <label>Password</label>\n        <input type=\"password\" class=\"form-control\" name=\"password\">\n      </div>\n\n      <button type=\"submit\" class=\"btn btn-warning btn-lg\">Signup</button>\n    </form>\n\n    <hr>\n\n  </main>\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/post.html":[function(require,module,exports){
module.exports = "\n<div class=\"preview\">\n  <article class=\"blogpost\">\n    <h1 class=\"entry-title\" itemprop=\"headline\">{{ post.title || \"Type post title ...\" }}</h1>\n    <h4 id=\"table-of-contents\" ng-if=\"preview.toc\">Table of Contents</h4>\n    <ul id=\"previewToc\" ng-bind-html=\"preview.toc | markdownHtml\"></ul>\n    <figure class=\"author\">\n      <img ng-alt=\"{{post.by.name}}\" ng-src=\"{{post.by.avatar}}?s=100\">\n      <figcaption>\n        {{post.by.bio}}\n      </figcaption>\n    </figure>  \n    <p class=\"asset\" ng-bind-html=\"preview.asset | markdownHtml\" ng-if=\"post.title && post.by.bio\"></p>\n    <hr />\n    <div id=\"body\" ng-bind-html=\"preview.body | markdownHtml\"></div>\n  </article>\n</div>\n\n<hr />\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/post.js":[function(require,module,exports){
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


},{"./post.html":"/Users/jkrez/src/airpair.com/public/common/directives/post.html","./postListItem.html":"/Users/jkrez/src/airpair.com/public/common/directives/postListItem.html"}],"/Users/jkrez/src/airpair.com/public/common/directives/postListItem.html":[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\n<a href=\"{{ post.url }}\" title=\"{{ post.title }}\" target=\"_self\" rel=\"bookmark\">\n  <header class=\"entry-header\">\n    <h2 class=\"entry-title\" itemprop=\"headline\">{{ post.title }}</h2> \n    <p class=\"entry-meta\">\n      <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ post.published }}\">{{ post.publishedFormat }}</time> \n      by \n      <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\n        <span class=\"entry-author-name\" itemprop=\"name\">{{ post.by.name }}</span>\n      </span> \n    </p>\n  </header>\n  <div class=\"entry-content\" itemprop=\"text\">\n    <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ post.by.avatar }}?s=50\" align=\"left\" />\n    <p>{{ post.meta.description }}</p>\n  </div>\n</a>\n  <footer class=\"entry-footer\">\n    <p class=\"entry-meta\">\n      <span class=\"entry-categories\">\n        <a ng-repeat='tag in post.tags' href=\"#\" title=\"View all posts in {{ tag.name }}\" rel=\"category tag\">{{ '{'+tag.slug+'}' }}</a>\n      </span>\n    </p>\n  </footer>\n</article>  \n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/share.html":[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\"> \n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>     \n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>      \n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>     \n</div>";

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


},{"./share.html":"/Users/jkrez/src/airpair.com/public/common/directives/share.html"}],"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.html":[function(require,module,exports){
module.exports = "<script type=\"text/ng-template\" id=\"template/typeahead/typeahead-match.html\">\n  <a>\n    <label bind-html-unsafe=\"match.model.name | typeaheadHighlight:query\"></label>\n    <br /><span bind-html-unsafe=\"match.model.desc | typeaheadHighlight:query\"></span>\n  </a>\n</script>\n\n    \n<input type=\"text\" \n  placeholder=\"Type technology\" \n  class=\"form-control\"\n  ng-model=\"q\" \n  typeahead=\"t as t for t in getTags($viewValue) | filter:$viewValue\" \n  >\n<!-- typeahead-loading=\"loading\"\n<i ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></i>\n -->Tags: <label ng-repeat=\"tag in post.tags\">{ {{tag.name}} } <a ng-click=\"deselectMatch(tag)\" style=\"color:red\">x</a> &nbsp </label>\n";

},{}],"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.js":[function(require,module,exports){
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


},{"./tagInput.html":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.html"}],"/Users/jkrez/src/airpair.com/public/common/filters/filters.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/common/models/postsService.js":[function(require,module,exports){
"use strict";
var headings = [];
var lazyErrorCb = function(resp) {
  console.log('error:', resp);
};
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


},{}],"/Users/jkrez/src/airpair.com/public/common/models/sessionService.js":[function(require,module,exports){
"use strict";
angular.module('APSvcSession', []).constant('API', '/v1/api').service('SessionService', ['$http', 'API', '$cacheFactory', function($http, API, $cacheFactory) {
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
}]);


},{}],"/Users/jkrez/src/airpair.com/public/common/postHelpers.js":[function(require,module,exports){
"use strict";
window.postHlpr = {};
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
postHlpr.highlightSyntax = function(opts) {
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
        element.outerHTML += '<footer>Get expert <a href="/find-an-expert">' + config.lang + ' help</a></footer>';
      }
    });
  }
};
postHlpr.loadDisqus = function() {
  (function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'https://airpairblog.disqus.com/embed.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(p, dsq);
  })();
};
postHlpr.loadPoSt = function() {
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


},{}],"/Users/jkrez/src/airpair.com/public/common/routes/helpers.js":[function(require,module,exports){
"use strict";
(function() {
  var self = {};
  self.resolveSession = function(args) {
    return ['SessionService', '$window', '$location', '$q', function(SessionService, $window, $location, $q) {
      return SessionService.getSession().then(function(data) {
        return data;
      }, function() {
        $location.path('/v1/auth/login');
        return $q.reject();
      });
    }];
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
  module.exports = resolveHelper;
})();


},{}],"/Users/jkrez/src/airpair.com/public/me/profile.html":[function(require,module,exports){
module.exports = "<header>Profile > {{ username }} </header>\n\n<div class=\"posts\">\n  <ap-post-list-item post=\"p\" ng-repeat=\"p in posts\"></ap-post-list-item>\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/author.html":[function(require,module,exports){
module.exports = "<header><a href=\"/posts\">Posts</a> > Author</header>\n<section id=\"posts\">\n<div id=\"author\" ng-attr-class=\"{{preview.mode}}\">\n\n  <div class=\"editor\" ap-post-editor=\"\"></div>\n\n  <hr />\n\n  <div id=\"preview\" ap-post=\"\"></div>\n\n  <div id=\"tips\">\n    \n    <div ng-if=\"post._id\">\n      <h6>Tips</h6>\n      <ul>\n        <li>Use h2 (##) and lower (###) for headings in your markdown (title is already the h1).</li>\n        <li>Prefix your headings with number like 1 1.1 1.2 2 etc.</li>\n        <li>Scroll to the part of your post you're interested in while you edit.</li>\n        <li>Submit your post by email to have it review and published by an editor.</li>\n        <li>Code blocks require a comments (e.g. <code>&lt;!--code lang=coffeescript linenums=true--&gt;</code> followed by a line break, to indicate language and optionally show line numbers.\n        </li>\n        <li>escape characters with <code>\\</code> to render them non markdown, e.g. for a list bullet you might <code>- \\-</code></li>\n      </ul> \n    </div>\n  </div>  \n\n</div>\n</section>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/editor.html":[function(require,module,exports){
module.exports = "\n  <div class=\"md\" ng-if=\"post._id\">\n    <div class=\"form-group\">\n      <label>Markdown <span>see <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\">markdown guide</a><span></label>\n        <textarea id=\"markdownTextarea\" ng-model=\"post.md\" class=\"form-control\" ng-model-options=\"{ updateOn: 'default blur', debounce: { blur: 0, default: (post.md.length * 10) }}\"></textarea>\n    </div>\n\n    <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">\n      <div class=\"form-group\">\n        <label>Tags </label>\n        <div tag-input=\"\"></div>\n      </div>\n      <div class=\"form-group\">\n        <label>Slug url</label>\n        <input ng-model=\"post.slug\" type=\"text\" class=\"form-control\" />\n      </div>      \n\n      <div class=\"posts\"><ap-post-list-item post=\"post\"></ap-post-list-item></div>\n    </div>\n\n  </div>\n\n  <div class=\"meta\">\n    <div class=\"form-group\">\n      <label>Title</label>\n      <input ng-model=\"post.title\" type=\"text\" class=\"form-control\" placeholder=\"Type post title ...\" />\n    </div>\n    <div class=\"form-group\">\n      <label>Author bio</label>\n      <input ng-model=\"post.by.bio\" type=\"text\" class=\"form-control\" />\n    </div>  \n    <div class=\"form-group\">\n      <label>Feature media <span ng-show=\"post.title && post.by.bio\">\n      <a href ng-click=\"exampleImage()\">image url</a>\n      or <a href ng-click=\"exampleYouTube()\">youtu.be url</a></span></label>\n      <input ng-model=\"post.assetUrl\" type=\"text\" class=\"form-control\" />\n    </div>\n\n    <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">    \n      <div class=\"form-group\">\n        <label>Author username</label>\n        <input ng-model=\"post.by.username\" type=\"text\" class=\"form-control\" />\n      </div>          \n      <div class=\"form-group\">\n        <label>Meta</label>\n        <input ng-model=\"post.meta.title\" type=\"text\" class=\"form-control\" placeholder=\"title\" /> \n        <input ng-model=\"post.meta.description\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n        <input ng-model=\"post.meta.canonical\" type=\"text\" class=\"form-control\" placeholder=\"canonical url\" />\n      </div>\n      <div class=\"form-group\">\n        <label>Open Graph</label>\n        <input ng-model=\"post.meta.ogTitle\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n        <input ng-model=\"post.meta.ogType\" type=\"text\" class=\"form-control\" placeholder=\"type\"/>\n        <input ng-model=\"post.meta.ogImage\" type=\"text\" class=\"form-control\" placeholder=\"image\" />\n        <input ng-model=\"post.meta.ogVideo\" type=\"text\" class=\"form-control\" placeholder=\"video\" />\n        <input ng-model=\"post.meta.ogUrl\" type=\"text\" class=\"form-control\" placeholder=\"url\" />        \n      </div>      \n    </div>\n\n    <div class=\"dates\" ng-if=\"post.created\">\n      <div class=\"form-group\" ng-if=\"preview.mode == 'publish'\">\n        <label>Override Publish Date</label>   \n        <input ng-model=\"post.publishedOverride\" type=\"text\" class=\"form-control\" ng-click=\"setPublishedOverride()\" />\n      </div>\n\n      <section>\n        <label>Created</label> <span>{{ post.created | publishedTime }}</span>\n        <label>Updated</label> <span>{{ post.updated | publishedTime }}</span>\n        <label>Published</label> <span>{{ post.published | publishedTime }}</span>\n        <label></label> <span>{{ post.publishedBy }}</span>\n      </section>\n    </div>\n\n  </div>\n\n  <div class=\"form-actions\">\n    <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"(!post.title && !post.by.bio) || post.saved || post.published\">Save</button>\n    <button class=\"btn btnPreview\" ng-click=\"previewToggle()\" ng-disabled=\"!post._id || (preview.mode == 'publish')\">{{preview.mode == 'edit' && 'Preview' || 'Edit' }}</button>  \n    <a class=\"btn\" target=\"_blank\" href=\"mailto:team@airpair.com?subject=Post%20Sumission%20-%20{{post.title}}&body=Can%20you%20look%20at%20and%20publish%20my%20post:%0A%0Ahttps://www.airpair.com/posts/publish/{{ post._id }}%0A%0A{{post.by.name}}\" ng-disabled=\"(!post.title && !post.by.bio) || !post.saved || (preview.mode == 'publish')\">Submit</a>\n    <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"!(preview.mode == 'publish')\">Publish</button>\n    <button class=\"btn\" ng-click=\"delete()\" ng-disabled=\"(!(preview.mode == 'edit') || post.published) || !post._id\">Delete</button>  \n  </div>\n";

},{}],"/Users/jkrez/src/airpair.com/public/posts/editor.js":[function(require,module,exports){
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
    }
  };
});


},{"./editor.html":"/Users/jkrez/src/airpair.com/public/posts/editor.html"}],"/Users/jkrez/src/airpair.com/public/posts/list.html":[function(require,module,exports){
module.exports = "<header>Posts</header>\n<section id=\"posts\">\n\n  <h3>Recent</h3>\n  <div class=\"posts recent\">\n    <ap-post-list-item post=\"p\" ng-repeat=\"p in recent\"></ap-post-list-item>\n  </div>\n      \n  <h3>My Posts</h3>\n  <br />\n  <div class=\"editOptions\">\n    <a href=\"/posts/new\" class=\"btn\">Create new post</a>      \n  </div>\n  <div class=\"myposts\" ap-my-posts-list=\"\"></div>\n\n</section>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/module.js":[function(require,module,exports){
"use strict";
require('./myPostsList.js');
require('./editor.js');
var resolver = require('./../common/routes/helpers.js');
angular.module("APPosts", ['ngRoute', 'APFilters', 'APShare', 'APMyPostsList', 'APPostEditor', 'APPost', 'APSvcSession', 'APSvcPosts', 'APTagInput']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
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
    template: require('./author.html'),
    controller: 'PublishCtrl as author',
    resolve: authd
  });
  $routeProvider.when('/me/:username', {
    template: require('../me/profile.html'),
    controller: 'ProfileCtrl as profile',
    resolve: authd
  });
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  SessionService.onAuthenticated((function(session) {
    $rootScope.session = session;
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
  var self = this;
  $scope.preview = {mode: 'publish'};
  $scope.post = {tags: []};
  $scope.setPublishedOverride = (function() {
    if (!$scope.post.publishedOverride) {
      $scope.post.publishedOverride = $scope.post.published || moment().format();
    }
  });
  PostsService.getById($routeParams.id, (function(r) {
    if (!r.slug) {
      r.slug = r.title.toLowerCase().replace(/ /g, '-');
    }
    $scope.canonical = 'http://www.airpair.com/v1/posts/' + r.slug;
    if (r.tags.length > 0) {
      $scope.canonical = ("http://www.airpair.com/" + r.tags[0].slug + "/posts/" + r.slug);
    }
    if (!r.meta) {
      var ogVideo = null;
      var ogImage = r.assetUrl;
      if (r.assetUrl && r.assetUrl.indexOf('http://youtub.be/') == 0) {
        var youTubeId = r.assetUrl.replace('http://youtu.be/', '');
        ogImage = ("http://img.youtube.com/vi/" + youTubeId + "/hqdefault.jpg");
        ogVideo = ("https://www.youtube-nocookie.com/v/" + youTubeId);
      }
      r.meta = {
        title: r.title,
        canonical: $scope.canonical,
        ogType: 'article',
        ogTitle: r.title,
        ogImage: ogImage,
        ogVideo: ogVideo,
        ogUrl: $scope.canonical
      };
    }
    $scope.post = _.extend(r, {saved: true});
  }));
  $scope.$watch('post.tags', function(value) {
    if (value.length > 0) {
      $scope.post.meta.canonical = ("http://www.airpair.com/" + $scope.post.tags[0].slug + "/posts/" + $scope.post.slug);
      $scope.post.meta.ogUrl = ("http://www.airpair.com/" + $scope.post.tags[0].slug + "/posts/" + $scope.post.slug);
    }
  });
  $scope.save = (function() {
    $scope.post.md = angular.element(document.querySelector('#markdownTextarea')).val();
    PostsService.publish($scope.post, (function(r) {
      $scope.post = _.extend(r, {saved: true});
    }));
  });
}]).controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams', 'session', function($scope, PostsService, $routeParams, session) {
  $scope.username = $routeParams.username;
  PostsService.getByUsername($routeParams.username, (function(posts) {
    $scope.posts = posts;
  }));
}]);
;


},{"../me/profile.html":"/Users/jkrez/src/airpair.com/public/me/profile.html","./../common/routes/helpers.js":"/Users/jkrez/src/airpair.com/public/common/routes/helpers.js","./author.html":"/Users/jkrez/src/airpair.com/public/posts/author.html","./editor.js":"/Users/jkrez/src/airpair.com/public/posts/editor.js","./list.html":"/Users/jkrez/src/airpair.com/public/posts/list.html","./myPostsList.js":"/Users/jkrez/src/airpair.com/public/posts/myPostsList.js"}],"/Users/jkrez/src/airpair.com/public/posts/myPostsList.html":[function(require,module,exports){
module.exports = "<table class=\"table table-striped\">\n  <tr>\n    <th>Created</th>\n    <th>Published</th>\n    <th>Title</th>\n    <th></th>    \n  </tr>\n  <tr ng-repeat=\"p in myposts\">\n    <td>{{ p.created | publishedTime: 'MM.DD' }}</td>  \n    <td>\n      {{ p.published | publishedTime: 'MM.DD' }}\n    </td>\n    <td>\n      <a href=\"/v1/posts/{{p.slug}}\" target=\"_blank\" ng-if=\"p.published\">{{ p.title }}</a>\n      <span ng-if=\"!p.published\">{{ p.title }}</span>\n    </td> \n    <td>\n      <a href=\"/posts/edit/{{p._id}}\" target=\"_blank\">edit</a>\n    </td>     \n  </tr>\n</table>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/myPostsList.js":[function(require,module,exports){
"use strict";
angular.module("APMyPostsList", []).directive('apMyPostsList', function() {
  return {
    template: require('./myPostsList.html'),
    controller: function($scope) {}
  };
});


},{"./myPostsList.html":"/Users/jkrez/src/airpair.com/public/posts/myPostsList.html"}],"/Users/jkrez/src/airpair.com/public/workshops/list.html":[function(require,module,exports){
module.exports = "<header>Workshops</header>\n<section id=\"workshops\">\n\n<div id=\"index\">\n\n  <div id=\"calendar\">\n\n    <h2>Calendar</h2>\n\n    <p>Keep track of the schedule:</p>\n\n    <a class=\"btn\" href=\"/workshops/subscribe\">Subscribe to calendar</a>\n\n    <hr />\n    <h5>Next 30 days</h5>\n    <ul id=\"month\">\n      <li ng-repeat=\"entry in workshops.month\">\n        <time>{{entry.time | locaTime }}</time> \n        <a href=\"{{entry.url}}\"> {{ entry.title }}</a></li>\n    </ul> \n\n  </div>\n\n\n  <div id=\"next\">\n    <h2>Next up</h2>\n\n    <p style=\"font-size:11px\"><i>* Times shown in <b>{{ timeZoneOffset }}</b> (your browser's timezone)</i> </p>\n\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.upcoming\">\n      <time datetime=\"{{entry.time}}\">{{ entry.time | locaTime }}</time>\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\t\n\n  <div id=\"featured\">\n    <h2>Featured</h2>\n    <a class=\"workshop\" href=\"{{entry.url}}\"\n       ng-repeat=\"entry in workshops.featured\">\n      <div ng-repeat=\"speaker in entry.speakers\">\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=80\" />\n        <h5>{{ speaker.name }}</h5>\n      </div>\n      <figure>{{ entry.title }}</figure>\n    </a>\n  </div>\n\n  <div id=\"past\">\n    <h2>Library</h2>\n    <ul>\n      <li ng-repeat=\"entry in workshops.past\">\n        <a href=\"{{entry.url}}\">\n          <img src=\"//0.gravatar.com/avatar/{{entry.speakers[0].gravatar }}\"></time> \n          <time>{{entry.speakers[0].name }}</time> \n          {{ entry.title }}</a>\n        </li>\n      </li>  \n    </ul> \n  </div>\n\n</div>\n\n</section>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/module.js":[function(require,module,exports){
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


},{"./list.html":"/Users/jkrez/src/airpair.com/public/workshops/list.html","./show.html":"/Users/jkrez/src/airpair.com/public/workshops/show.html","./signup.html":"/Users/jkrez/src/airpair.com/public/workshops/signup.html","./subscribe.html":"/Users/jkrez/src/airpair.com/public/workshops/subscribe.html"}],"/Users/jkrez/src/airpair.com/public/workshops/show.html":[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > {{ entry.title }}</header>\n\n<section id=\"workshops\">\n<div id=\"show\">\n\n  <h1>{{ entry.title }}</h1>\n\n  <div class=\"share\" ap-share=\"\" ap-fb=\"true\" ap-tw=\"true\" ap-in=\"true\"></div>\n\n  <div class=\"speakers\">\n    <h2>Presenting</h2>\n    <ul>\n      <li ng-repeat=\"speaker in entry.speakers\">\n        <h3>{{ speaker.name }}</h3>\n        <img src=\"//0.gravatar.com/avatar/{{ speaker.gravatar }}?s=400\" />\n\n        {{ speaker.fullBio }}\n      </li>\n    </ul>\n  </div>\n\n  <time>{{entry.time | date:'medium'}}</time>\n\n  {{ entry.difficulty }} <label ng-repeat=\"tag in entry.tags\"> { {{ tag }} } </label>\n\n  <p>{{ entry.description }}</p>\n\n  <div class=\"action\">\n    <div ng-if=\"entry.youtube\">\n      <a ng-href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Get access to all live talks</a>      \n      <label>with AirPair Membership</label>        \n    </div>\n    <div ng-if=\"!entry.youtube\">\n      <a ng-href=\"/workshops/signup/{{entry.slug}}\" class=\"btn\" style=\"width:300px\">Sign up to attend workshop</a>\n      <label>3 spots left</label>  \n    </div>    \n  </div>\n  <div class=\"player\" ng-if=\"entry\">\n\n    <div class=\"recording\" ng-if=\"entry.youtube\">\n\n      <iframe width=\"640\" height=\"360\" ng-src=\"{{ '//www.youtube-nocookie.com/embed/' + entry.youtube | trustUrl }}\" frameborder=\"0\" allowfullscreen></iframe>\n\n    </div>\n  \n    <div class=\"slide\" ng-if=\"entry && !entry.youtube && entry.slug\">\n      <iframe ng-src=\"{{ '/workshops-slide/' + entry.slug  | trustUrl }}\" width=\"640\" height=\"360\" frameborder=\"0\" scrolling=\"no\" style=\"overflow:hidden\"></iframe>\n    </div>\n\n  </div>\n\n\n  <hr />\n<!-- \n  <h3>Chat</h3> -->\n\n</div>\n</section>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/signup.html":[function(require,module,exports){
module.exports = "<header>\n  <a href=\"/workshops\">Workshops</a> > \n  <a href=\"{{ entry.url }}\">{{ entry.title }}</a> > \n  Signup\n</header>\n\n<section id=\"workshops\">\n<div id=\"signup\">\n\n  <div class=\"choice\" ng-if=\"!hasAccess\">\n\n    <h2>two ways to attend</h2>\n    <h4>Please choose an option access this workshop</h4>\n\n    <div class=\"option\">\n      <h2>Ticket</h2>\n\n      <ul>\n        <li><b>$50 one off</b></li>\n        <li>Access to this workshops</li>        \n        <li>Access the recording</li>            \n        <li>$10 credit towards pairing with {{ entry.speakers[0].name }}</li>        \n      </ul>\n\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Buy a ticket</a>\n    </div>\n\n    <div class=\"option\">\n      <h2>Membership</h2>    \n      <ul>\n        <li><b>$300 for 6 months</b></li>      \n        <li>Access to all workshops</li>        \n        <li>$5/hr off all AirPairing</li>                  \n        <li>Instant chat access to experts</li>                          \n      </ul>\n      <a href=\"alert('Sign up for this workshop is free, please fill the form below')\" class=\"btn\">Get a membership</a>      \n    </div>\n    \n  </div>\n\n  <div class=\"rsvp\" ng-if=\"hasAccess && !entry.youtube\">\n\n    <h2>RSVP for workshop</h2>\n\n    <iframe src=\"{{ 'http://airpa.ir/aircast-signup-' + entry.slug | trustUrl }}\" width=\"100%\" height=\"920\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n\n  </div>\n\n  <div class=\"attending\" ng-if=\"hasAccess && entry.youtube\">\n\n    <h2>This workshop has already happened.</h2>\n\n  </div>\n\n  <hr />\n\n  <a href=\"{{ entry.url }}\" class=\"btn\">Back to workshop</a>\n\n  <hr />\n\n</div>\n</section>";

},{}],"/Users/jkrez/src/airpair.com/public/workshops/subscribe.html":[function(require,module,exports){
module.exports = "<header><a href=\"/workshops\">Workshops</a> > Subscribe</header>\n<section id=\"workshops\">\n<div id=\"subscribe\">\n\n  <h1>Subscribe to Workshops Calendar</h1>\n\n  <p>For convenience, we provide an iCal feed that automatically updates as we make changes to the workshops schedule.</p>\n\n  <input type=\"text\" style=\"width:100%;margin:15px 0 20px 0\" value=\"https://www.google.com/calendar/ical/airpair.co_o3u16m7fv9fc3agq81nsn0bgrs%40group.calendar.google.com/public/basic.ics\" />\n\n  <p>Make sure your client is setup correctly to receive live changes and that you haven't just imported a static view of the schedule.</p>\n\n  <h2>Google hangouts guide</h2>\n\n  <p>Copy and paste the following url in the \"Add by url\" dialog.\n\n  <p>If you select the 'Import calendar' option you will NOT see updates to the schedule as they are made.</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-1.png\" />\n\n  <p>Once the calendar url is added, you will see \"AirCasts\" listed down the left and workshops will appear in your calendar..</p>\n\n  <img src=\"/v1/img/pages/workshops/ical-google-guide-2.png\" />\n\n  <p>See guide to make sure you're correctly subscribe for updates to the AirCasts schedule.</p>\n\n  <hr />\n\n  <a href=\"/workshops\" class=\"btn\">Back to the workshops page</a>\n\n  <hr />\n\n</div>\n</section>";

},{}]},{},["./public/common/index.js"]);
