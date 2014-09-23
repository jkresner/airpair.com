(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/posts/module.js":[function(require,module,exports){
"use strict";
require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters.js');
require('./../common/postsService.js');
require('./../common/postHelpers.js');
require('./../common/sessionService.js');
require('./myPostsList.js');
require('./editor.js');
angular.module("APPosts", ['ngRoute', 'APFilters', 'APShare', 'APMyPostsList', 'APPostEditor', 'APPost', 'APSvcSession', 'APSvcPosts', 'APTagInput']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  var resolveSession = ['SessionService', '$window', '$q', function(SessionService, $window, $q) {
    return SessionService.getSession().then(function(data) {
      return data;
    }, function() {
      $window.location = '/v1/auth/login?returnTo=/posts/new';
      return $q.reject();
    });
  }];
  $locationProvider.html5Mode(true);
  $routeProvider.when('/posts', {
    templateUrl: 'index',
    controller: 'IndexCtrl as index'
  });
  $routeProvider.when('/posts/new', {
    template: require('./author.html'),
    controller: 'NewCtrl as author',
    resolve: {session: resolveSession}
  });
  $routeProvider.when('/posts/edit/:id', {
    template: require('./author.html'),
    controller: 'EditCtrl as author',
    resolve: {session: resolveSession}
  });
  $routeProvider.when('/posts/publish/:id', {
    template: require('./author.html'),
    controller: 'PublishCtrl as author',
    resolve: {session: resolveSession}
  });
  $routeProvider.when('/me/:username', {
    template: require('../me/profile.html'),
    controller: 'ProfileCtrl as profile',
    resolve: {session: resolveSession}
  });
}]).run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
  SessionService.onAuthenticated((function(session) {
    $rootScope.session = session;
  }));
}]).controller('IndexCtrl', ['$scope', 'PostsService', 'SessionService', function($scope, PostsService, SessionService) {
  var self = this;
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


},{"../me/profile.html":"/Users/jkrez/src/airpair.com/public/me/profile.html","./../common/directives/post.js":"/Users/jkrez/src/airpair.com/public/common/directives/post.js","./../common/directives/share.js":"/Users/jkrez/src/airpair.com/public/common/directives/share.js","./../common/directives/tagInput.js":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.js","./../common/filters.js":"/Users/jkrez/src/airpair.com/public/common/filters.js","./../common/postHelpers.js":"/Users/jkrez/src/airpair.com/public/common/postHelpers.js","./../common/postsService.js":"/Users/jkrez/src/airpair.com/public/common/postsService.js","./../common/sessionService.js":"/Users/jkrez/src/airpair.com/public/common/sessionService.js","./author.html":"/Users/jkrez/src/airpair.com/public/posts/author.html","./editor.js":"/Users/jkrez/src/airpair.com/public/posts/editor.js","./myPostsList.js":"/Users/jkrez/src/airpair.com/public/posts/myPostsList.js"}],"/Users/jkrez/src/airpair.com/public/common/directives/post.html":[function(require,module,exports){
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


},{"./tagInput.html":"/Users/jkrez/src/airpair.com/public/common/directives/tagInput.html"}],"/Users/jkrez/src/airpair.com/public/common/filters.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/common/postsService.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/common/sessionService.js":[function(require,module,exports){
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


},{}],"/Users/jkrez/src/airpair.com/public/me/profile.html":[function(require,module,exports){
module.exports = "<header>Profile > {{ username }} </header>\n\n<div class=\"posts\">\n  <ap-post-list-item post=\"p\" ng-repeat=\"p in posts\"></ap-post-list-item>\n</div>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/author.html":[function(require,module,exports){
module.exports = "<header><a href=\"/posts\">Posts</a> > Author</header>\n\n<div id=\"author\" ng-attr-class=\"{{preview.mode}}\">\n\n  <div class=\"editor\" ap-post-editor=\"\"></div>\n\n  <hr />\n\n  <div id=\"preview\" ap-post=\"\"></div>\n\n  <div id=\"tips\">\n    \n    <div ng-if=\"post._id\">\n      <h6>Tips</h6>\n      <ul>\n        <li>Use h2 (##) and lower (###) for headings in your markdown (title is already the h1).</li>\n        <li>Prefix your headings with number like 1 1.1 1.2 2 etc.</li>\n        <li>Scroll to the part of your post you're interested in while you edit.</li>\n        <li>Submit your post by email to have it review and published by an editor.</li>\n        <li>Code blocks require a comments (e.g. <code>&lt;!--code lang=coffeescript linenums=true--&gt;</code> followed by a line break, to indicate language and optionally show line numbers.\n        </li>\n        <li>escape characters with <code>\\</code> to render them non markdown, e.g. for a list bullet you might <code>- \\-</code></li>\n      </ul> \n    </div>\n  </div>  \n\n</div>";

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


},{"./editor.html":"/Users/jkrez/src/airpair.com/public/posts/editor.html"}],"/Users/jkrez/src/airpair.com/public/posts/myPostsList.html":[function(require,module,exports){
module.exports = "<table class=\"table table-striped\">\n  <tr>\n    <th>Created</th>\n    <th>Published</th>\n    <th>Title</th>\n    <th></th>    \n  </tr>\n  <tr ng-repeat=\"p in myposts\">\n    <td>{{ p.created | publishedTime: 'MM.DD' }}</td>  \n    <td>\n      {{ p.published | publishedTime: 'MM.DD' }}\n    </td>\n    <td>\n      <a href=\"/v1/posts/{{p.slug}}\" target=\"_blank\" ng-if=\"p.published\">{{ p.title }}</a>\n      <span ng-if=\"!p.published\">{{ p.title }}</span>\n    </td> \n    <td>\n      <a href=\"/posts/edit/{{p._id}}\" target=\"_blank\">edit</a>\n    </td>     \n  </tr>\n</table>";

},{}],"/Users/jkrez/src/airpair.com/public/posts/myPostsList.js":[function(require,module,exports){
"use strict";
angular.module("APMyPostsList", []).directive('apMyPostsList', function() {
  return {
    template: require('./myPostsList.html'),
    controller: function($scope) {}
  };
});


},{"./myPostsList.html":"/Users/jkrez/src/airpair.com/public/posts/myPostsList.html"}]},{},["./public/posts/module.js"]);
