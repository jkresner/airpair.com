angular.module("AirPair.Author", []).config($routeProvider => {

  var route = (ctrl, template) => ({ controller: `author:${ctrl}`, template })

  $routeProvider
    .when('/new', route('info', require('./info.html')))
    .when('/post-info/:id', route('info', require('./info.html')))
    .when('/editor/:id', route('editor', require('./editor.html')))
    .when('/submit/:id', route('submit', require('./submit.html')))
    .when('/collaborate/:id', route('collaborate', require('./collaborate.html')))
    .when('/publish/:id', route('publish', require('./publish.html')))
    .when('/fork/:id', { template: require('./fork.html'), controller: 'author:fork' })
})


.directive('editHeader', (API, UTIL) => ({
  template: require('./header.html'),
  scope: { post: '=post', step: '=step', editing: '=editing', wordcount: '=wordcount' },
  controller($rootScope, $scope) {
    if ($scope.editing === undefined) $scope.editing = false
    $scope.delete = id => API(`/post/delete/${id}`, r => window.location = '/')
    $scope.stepCss = (step, lock) => {
      if (step == $scope.step) return 'current'
      return lock ? 'lock' : ''
    }

    $scope.$watch('post', post => {
      var {session} = $rootScope
      // console.log('editHeader.session', session)
      if (session && post) {
        $scope.id = post._id
        $scope.new = !post._id
        $scope.status = UTIL.post.status(post)
        $scope.tile = post.title
        $scope.submitted = (post.history||{}).submitted
        $scope.author = UTIL.role.author(session, post)
        // console.log('editHeader.post', $scope.wordcount, post.stats)

        if ($scope.author) {
          var wordcount = $scope.wordcount || (post.stats||{}).words
          $scope.submittable = post.submitted || UTIL.post.submittable(post, wordcount)
          $scope.publishable = post.published || UTIL.post.publishable(post)
          // console.log('$scope.publishable', UTIL.post.publishable(post), $scope.publishable)
        }
      }
    })
  }
}))


.directive('authorFooter', (API, UTIL) => ({
  controller($scope, $element) {
    $element.bind('mouseover', () => $element.addClass('on'))
    $element.bind('mouseout', () => $element.removeClass('on'))
  }
}))


.directive('todoHelper', UTIL => ({
  template: require('./todo.html'),
  scope: { md: '=md', post: '=post', todo: '=todo' },
  controller($scope) {
    $scope._id = $scope.post._id
    if ($scope.md) {
      $scope.$watch('md', md => $scope.wordstogo = 400 - UTIL.str.wordcount(md,50))
      $scope.$watch('todo', todo => $scope.next = todo.next)
    }
  }
}))


.directive('previewWidth', () => ({
  controller($rootScope, $element) {
    $rootScope.$watch('ui.page.preview.w', w => $element.attr(`class`, w ? `s${w}` : 'off'))
  }
}))



.directive('previewMenu', (WINDOW, PAGE, UTIL) => ({
  template: require('./previewMenu.html'),
  controller($rootScope, $scope, $timeout) {
    // console.log('previewMenu', $scope)
    $rootScope.$watch('ui.page.preview', state => {
      console.log('previewupdate.d', state)
      if (state) {
        $scope.toggle = state.toggle
        $scope.preview = state
        $timeout(function() { WINDOW.codeblocks.highlight({}) }, 10)
      }
    })

    $scope.css = device => $scope.preview.mode == device ? 'current' : ''
  }
}))


.controller('author:info', function($scope, $routeParams, $location, API, PAGE, StaticData) { require('./info').apply(this, arguments) })
.controller('author:editor', function($scope, $routeParams, $timeout, $window, API, PAGE, UTIL, StaticData) { require('./editor').apply(this, arguments) })
.controller('author:submit', function($scope, $routeParams, $timeout, $q, API, PAGE) { require('./submit').apply(this, arguments) })
.controller('author:collaborate', function($scope, $routeParams, API, PAGE) { require('./collaborate').apply(this, arguments) })
.controller('author:publish', function($scope, $routeParams, API, PAGE) { require('./publish').apply(this, arguments) })
.controller('author:fork', function($scope, $routeParams, $q, API, PAGE) { require('./fork').apply(this, arguments) })
