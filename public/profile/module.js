
var resolver = require('./../common/routes/helpers.js').resolveHelper;


angular.module("APProfile", ['ngRoute', 'APFilters', 'APSvcSession', 'APTagInput'])

  .config(function($locationProvider, $routeProvider) {

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

  })

  .run(function($rootScope, SessionService) {

  })


  .controller('AccountCtrl', function($rootScope, $scope, $location, SessionService) {

      var self = this;

      if ($location.search().verify)
      {
        SessionService.verifyEmail({hash:$location.search().verify}, function(result){
          $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! <b>Next step, go to <a href="/billing">BILLING</a></b>` }]
          $location.path("/billing")
        }, function(e){
          $scope.emailAlerts = [{ type: 'danger', msg: `${e} failed` }]
        })
      }

    SessionService.onAuthenticated( (session) =>
      $scope.data = _.pick(session, 'name','email','initials','username')  )

    if ($scope.session)
      $scope.data = _.pick($scope.session, 'name','email','initials','username')

    angular.element('#profileForm input').on('blur', function(event) {
      $scope.profileAlerts = []

      if ($scope.session.name != $scope.data.name ||
        $scope.session.initials != $scope.data.initials ||
        $scope.session.username != $scope.data.username)
      {
        SessionService.updateProfile($scope.data, function(result){
          $scope.profileAlerts.push({ type: 'success', msg: `${event.target.name} updated` })
        }, function(e){
          $scope.data.username = $scope.session.username
          $scope.profileAlerts.push({ type: 'danger', msg: e.message })
        })
      }
    })

    $scope.updateEmail = function(model) {
      if (!model.$valid || $scope.data.email == $scope.session.email) return
      $scope.emailChangeFailed = ""

      SessionService.changeEmail({ email: $scope.data.email },
        (result) => {
          $scope.data.email = result.email
        }
        ,
        (e) => {
          $scope.emailChangeFailed = e.message
          $scope.data.email = null
        }
      )
    }

    $scope.sendVerificationEmail = function() {
      SessionService.changeEmail({email:$scope.session.email}, function(result){
        $scope.emailAlerts = [{ type: 'success', msg: `Email verification mail sent` }]
      }, function(e){
        $scope.emailAlerts = [{ type: 'danger', msg: `${e} failed` }]
      })
    };

    $scope.sendPasswordChange = function() {
      SessionService.requestPasswordChange({email:$scope.session.email}, function(result){
        $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${$scope.session.email}` }]
      }, function(e){
        console.log('requestPasswordChange.failed', e)
      })
    };

  })

  //-- this will be refactored out of the posts module
  .controller('ProfileCtrl', function($scope, PostsService, $routeParams) {

      $scope.username = $routeParams.username;

      PostsService.getByUsername($routeParams.username, (posts) => {
        $scope.posts = posts;
      });

  })


  //-- this will be refactored out of the posts module
  .controller('PasswordCtrl', function($scope, $routeParams, $location, SessionService) {

      $scope.alerts = []

      $scope.data = { password: '', hash: $location.search().token };

      $scope.savePassword = function() {
        SessionService.changePassword($scope.data, function(result){
          $scope.alerts = [{ type: 'success', msg: `New password set` }]

        }, function(e){
          $scope.alerts = [{ type: 'danger', msg: `Password change failed` }]
        })
      }

      if (!$scope.data.hash)
        $scope.alerts.push({ type: 'danger', msg: `Password token expired` })

  })

;
