(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
require('./../directives/share.js');
require('./../directives/post.js');
require('./../common/filters.js');
require('./../common/postsService.js');
require('./../common/postHelpers.js');
require('./../common/sessionService.js');
require('./myPostsList.js');
require('./editor.js');
angular.module("APPosts", ['ngRoute', 'APFilters', 'APShare', 'APMyPostsList', 'APPostEditor', 'APPost', 'APSvcSession', 'APSvcPosts']).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
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
  SessionService.onUnauthenticated((function(session) {}));
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
  $scope.post.by = session;
  $scope.save = (function() {
    $scope.post.md = "Type markdown ...";
    PostsService.create($scope.post, (function(result) {
      $location.path('/posts/edit/' + result._id);
    }));
  });
}]).controller('EditCtrl', ['$scope', 'PostsService', '$routeParams', 'session', function($scope, PostsService, $routeParams, session) {
  var self = this;
  $scope.preview = {mode: 'edit'};
  PostsService.getById($routeParams.id, (function(r) {
    $scope.post = _.extend(r, {saved: true});
  }));
  $scope.save = (function() {
    $scope.post.md = angular.element(document.querySelector('#markdownTextarea')).val(), PostsService.update($scope.post, (function(r) {
      $scope.post = _.extend(r, {saved: true});
    }));
  });
}]).controller('PublishCtrl', ['$scope', 'PostsService', '$routeParams', 'session', function($scope, PostsService, $routeParams, session) {
  var self = this;
  $scope.preview = {mode: 'publish'};
  $scope.setPublishedOverride = (function() {
    if (!$scope.post.publishedOverride) {
      $scope.post.publishedOverride = $scope.post.published || moment().format();
    }
  });
  PostsService.getById($routeParams.id, (function(r) {
    if (!r.slug) {
      r.slug = r.title.toLowerCase().replace(/ /g, '-');
    }
    if (!r.meta) {
      var ogVideo = null;
      var ogImage = r.assetUrl;
      if (r.assetUrl.indexOf('http://youtub.be/', 0)) {
        var youTubeId = r.assetUrl.replace('http://youtu.be/', '');
        ogImage = ("http://img.youtube.com/vi/" + youTubeId + "/hqdefault.jpg");
        ogVideo = ("https://www.youtube-nocookie.com/v/" + youTubeId);
      }
      r.meta = {
        title: r.title,
        canonical: 'http://www.airpair.com/v1/posts/' + r.slug,
        ogTitle: r.title,
        ogImage: ogImage,
        ogVideo: ogVideo,
        ogUrl: 'http://www.airpair.com/v1/posts/' + r.slug
      };
    }
    $scope.post = _.extend(r, {saved: true});
  }));
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


},{"../me/profile.html":11,"./../common/filters.js":2,"./../common/postHelpers.js":3,"./../common/postsService.js":4,"./../common/sessionService.js":5,"./../directives/post.js":7,"./../directives/share.js":10,"./author.html":12,"./editor.js":14,"./myPostsList.js":16}],2:[function(require,module,exports){
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
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
};
postHlpr.loadPoSt = function() {
  window.pwidget_config = {
    shareQuote: false,
    afterShare: false
  };
  (function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//i.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
};


},{}],4:[function(require,module,exports){
"use strict";
var headings = [];
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
    $http.get((API + "/posts/" + id)).success(success);
  };
  this.getByUsername = function(username, success) {
    $http.get((API + "/posts/by/" + username)).success(success);
  };
  this.getMyPosts = function(success) {
    $http.get((API + "/posts/me")).success(success);
  };
  this.getRecentPosts = function(success) {
    $http.get((API + "/posts/recent")).success(success);
  };
  this.getToc = function(md, success) {
    if (mdHelper.headingsChanged(md)) {
      $http.post((API + "/posts-toc"), {md: md}).success(success);
    }
  };
  this.create = function(data, success) {
    $http.post((API + "/posts"), data).success(success);
  };
  this.update = function(data, success) {
    $http.put((API + "/posts/" + data._id), data).success(success);
  };
  this.publish = function(data, success) {
    $http.put((API + "/posts/publish/" + data._id), data).success(success);
  };
}]);


},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
module.exports = "\n<div class=\"preview\">\n  <article class=\"blogpost\">\n    <h1 class=\"entry-title\" itemprop=\"headline\">{{ post.title || \"Type post title ...\" }}</h1>\n    <h4 id=\"table-of-contents\" ng-if=\"preview.toc\">Table of Contents</h4>\n    <ul id=\"previewToc\" ng-bind-html=\"preview.toc | markdownHtml\"></ul>\n    <h6 id=\"author\">Author</h6>\n    <p><img ng-alt=\"{{post.by.name}}\" ng-src=\"{{post.by.avatar}}?s=100\"> </p>\n    <blockquote>\n      <p>{{post.by.bio}}</p>\n    </blockquote>\n    <p class=\"asset\" ng-bind-html=\"preview.asset | markdownHtml\" ng-if=\"post.title && post.by.bio\"></p>\n    <hr />\n    <div id=\"body\" ng-bind-html=\"preview.body | markdownHtml\"></div>\n  </article>\n</div>\n\n<hr />\n";

},{}],7:[function(require,module,exports){
"use strict";
angular.module("APPost", []).directive('apPostListItem', ['$parse', function($parse) {
  return {
    restrict: 'E',
    template: require('./postListItem.html'),
    scope: {p: '=post'},
    link: function(scope, element, attrs) {
      scope.url = scope.p.url;
      scope.title = scope.p.title;
      scope.published = scope.p.published;
      scope.publishedFormat = moment(scope.p.published).format('d0 MMM, YYYY');
      scope.by = {
        name: scope.p.by.name,
        avatar: scope.p.by.avatar
      };
      scope.meta = {description: scope.p.meta.description};
      scope.tags = scope.p.tags;
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


},{"./post.html":6,"./postListItem.html":8}],8:[function(require,module,exports){
module.exports = "<article itemscope=\"itemscope\" itemtype=\"http://schema.org/BlogPosting\" itemprop=\"blogPost\">\n<a href=\"{{ url }}\" title=\"{{ title }}\" target=\"_self\" rel=\"bookmark\">\n  <header class=\"entry-header\">\n    <h2 class=\"entry-title\" itemprop=\"headline\">{{ title }}</h2> \n    <p class=\"entry-meta\">\n      <time class=\"entry-time\" itemprop=\"datePublished\" datetime=\"{{ published }}\">{{ publishedFormat }}</time> \n      by \n      <span class=\"entry-author\" itemprop=\"author\" itemscope=\"itemscope\" itemtype=\"http://schema.org/Person\">\n        <span class=\"entry-author-name\" itemprop=\"name\">{{ by.name }}</span>\n      </span> \n    </p>\n  </header>\n  <div class=\"entry-content\" itemprop=\"text\">\n    <img class=\"entry-author-image\" itemprop=\"image\" ng-src=\"{{ by.avatar }}?s=50\" align=\"left\" />\n    <p>{{ meta.description }}</p>\n  </div>\n</a>\n  <footer class=\"entry-footer\">\n    <p class=\"entry-meta\">\n      <span class=\"entry-categories\"> \n      </span>\n    </p>\n  </footer>\n</article>  ";

},{}],9:[function(require,module,exports){
module.exports = "<div class=\"pw-widget pw-counter-vertical\" pw:twitter-via=\"airpair\"> \n  <a ng-show=\"fb\" class=\"pw-button-facebook pw-look-native\"></a>     \n  <a ng-show=\"tw\" class=\"pw-button-twitter pw-look-native\"></a>      \n  <a ng-show=\"in\" class=\"pw-button-linkedin pw-look-native\"></a>     \n</div>";

},{}],10:[function(require,module,exports){
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


},{"./share.html":9}],11:[function(require,module,exports){
module.exports = "<header>Profile > {{ username }} </header>\n\n<div class=\"posts\">\n  <ap-post-list-item post=\"p\" ng-repeat=\"p in posts\"></ap-post-list-item>\n</div>";

},{}],12:[function(require,module,exports){
module.exports = "<header><a href=\"/posts\">Posts</a> > Author</header>\n\n<div id=\"author\" ng-attr-class=\"{{preview.mode}}\">\n\n  <div class=\"editor\" ap-post-editor=\"\"></div>\n\n  <hr />\n\n  <div id=\"preview\" ap-post=\"\"></div>\n\n  <div id=\"tips\">\n    <h6>Tips</h6>\n    <ul>\n      <li>Use h2 (##) and lower (###) for headings in your markdown (title is already the h1).</li>\n      <li>Prefix your headings with number like 1 1.1 1.2 2 etc.</li>\n      <li>Scroll to the part of your post you're interested in while you edit.</li>\n      <li>Submit your post by email to have it review and published by an editor.</li>\n      <li>Code blocks require a comments (e.g. <code>&lt;!--code lang=coffeescript linenums=true--&gt;</code> followed by a line break, to indicate language and optionally show line numbers.\n      </li>\n    </ul> \n  </div>  \n\n</div>";

},{}],13:[function(require,module,exports){
module.exports = "\n  <div class=\"md\" ng-if=\"post._id\">\n    <div class=\"form-group\">\n      <label>Markdown <span>see <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\">markdown guide</a><span></label>\n        <textarea id=\"markdownTextarea\" ng-model=\"post.md\" class=\"form-control\" ng-model-options=\"{ updateOn: 'default blur', debounce: { blur: 0, default: (post.md.length * 10) }}\"></textarea>\n    </div>\n\n    <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">\n      <div class=\"form-group\">\n        <label>Tags <span>(coming later this week)</span></label>\n        <input ng-model=\"post.tags\" type=\"text\" class=\"form-control\" disabled/>\n      </div>\n      <div class=\"form-group\">\n        <label>Slug url</label>\n        <input ng-model=\"post.slug\" type=\"text\" class=\"form-control\" />\n      </div>      \n    </div>\n\n    <div class=\"posts\"><ap-post-list-item post=\"post\"></ap-post-list-item></div>\n  </div>\n\n  <div class=\"meta\">\n    <div class=\"form-group\">\n      <label>Title</label>\n      <input ng-model=\"post.title\" type=\"text\" class=\"form-control\" placeholder=\"Type post title ...\" />\n    </div>\n    <div class=\"form-group\">\n      <label>Author bio</label>\n      <input ng-model=\"post.by.bio\" type=\"text\" class=\"form-control\" />\n    </div>  \n    <div class=\"form-group\">\n      <label>Feature media <span ng-show=\"post.title && post.by.bio\">\n      <a href ng-click=\"exampleImage()\">image url</a>\n      or <a href ng-click=\"exampleYouTube()\">youtu.be url</a></span></label>\n      <input ng-model=\"post.assetUrl\" type=\"text\" class=\"form-control\" />\n    </div>\n\n    <div class=\"publishMeta\" ng-if=\"preview.mode == 'publish'\">    \n      <div class=\"form-group\">\n        <label>Author username</label>\n        <input ng-model=\"post.by.username\" type=\"text\" class=\"form-control\" />\n      </div>          \n      <div class=\"form-group\">\n        <label>Meta</label>\n        <input ng-model=\"post.meta.title\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n        <input ng-model=\"post.meta.keyword\" type=\"text\" class=\"form-control\" placeholder=\"keyword\"/>\n        <input ng-model=\"post.meta.description\" type=\"text\" class=\"form-control\" placeholder=\"description\" />\n        <input ng-model=\"post.meta.canonical\" type=\"text\" class=\"form-control\" placeholder=\"canonical url\" />\n      </div>\n      <div class=\"form-group\">\n        <label>Open Graph</label>\n        <input ng-model=\"post.meta.ogTitle\" type=\"text\" class=\"form-control\" placeholder=\"title\" />\n        <input ng-model=\"post.meta.ogType\" type=\"text\" class=\"form-control\" placeholder=\"type\"/>\n        <input ng-model=\"post.meta.ogImage\" type=\"text\" class=\"form-control\" placeholder=\"image\" />\n        <input ng-model=\"post.meta.ogVideo\" type=\"text\" class=\"form-control\" placeholder=\"video\" />\n        <input ng-model=\"post.meta.ogUrl\" type=\"text\" class=\"form-control\" placeholder=\"url\" />        \n      </div>      \n      <div class=\"form-group\">\n        <label>Publish Date Override</label>   \n        <input ng-model=\"post.publishedOverride\" type=\"text\" class=\"form-control\" ng-click=\"setPublishedOverride()\" />\n      </div>\n    </div>\n\n    <div class=\"dates\" ng-if=\"post.created\">\n      <label>Created</label> <span>{{ post.created | publishedTime }}</span>\n      <label>Updated</label> <span>{{ post.updated | publishedTime }}</span>\n      <label>Published</label> <span>{{ post.published | publishedTime }}</span>\n      <label></label> <span>{{ post.publishedBy }}</span>\n    </div>\n\n  </div>\n\n  <div class=\"form-actions\">\n    <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"(!post.title && !post.by.bio) || post.saved\">Save</button>\n    <button class=\"btn btnPreview\" ng-click=\"previewToggle()\" ng-disabled=\"!post._id || (preview.mode == 'publish')\">{{preview.mode == 'edit' && 'Preview' || 'Edit' }}</button>  \n    <a class=\"btn\" target=\"_blank\" href=\"mailto:team@airpair.com?subject=Post%20Sumission%20-%20{{post.title}}&body=Can%20you%20look%20at%20and%20publish%20my%20post:%0A%0Ahttps://www.airpair.com/posts/publish/{{ post._id }}%0A%0A{{post.by.name}}\" ng-disabled=\"(!post.title && !post.by.bio) || !post.saved || (preview.mode == 'publish')\">Submit</a>\n    <button class=\"btn\" ng-click=\"save()\" ng-disabled=\"!(preview.mode == 'publish')\">Publish</button>\n    <button class=\"btn\" disabled>Delete</button>  \n  </div>\n";

},{}],14:[function(require,module,exports){
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


},{"./editor.html":13}],15:[function(require,module,exports){
module.exports = "<table class=\"table table-striped\">\n  <tr>\n    <th>Published</th>\n    <th>Created</th>\n    <th>Title</th>\n    <th></th>    \n  </tr>\n  <tr ng-repeat=\"p in myposts\">\n    <td>{{ p.published | publishedTime: 'MM.DD' }}</td>\n    <td>{{ p.created | publishedTime: 'MM.DD' }}</td>  \n    <td>{{ p.title }}</td> \n    <td>\n      <a href=\"/v1/posts/{{p.slug}}\" target=\"_blank\" ng-if=\"p.published\">view</a>\n      <a href=\"/posts/edit/{{p._id}}\" target=\"_blank\" ng-if=\"!p.published\">edit</a>\n    </td>     \n  </tr>\n</table>";

},{}],16:[function(require,module,exports){
"use strict";
angular.module("APMyPostsList", []).directive('apMyPostsList', function() {
  return {
    template: require('./myPostsList.html'),
    controller: function($scope) {}
  };
});


},{"./myPostsList.html":15}]},{},[1]);
