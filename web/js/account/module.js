angular.module("AirPair.Account", []).config($routeProvider => {

  var route = (ctrl, template) => ({ controller: `account:${ctrl}`, template })

  $routeProvider
    .when('/account', route('index', require('./account.html')))

  // var authd = apRouteProvider.resolver(['session']);
  // var route = apRouteProvider.route
  // route('/login', 'Login', require('./login.html'))
  // route('/account', 'Account', require('./account.html'),{resolve: authd})
  // route('/me/password', 'Password', require('./password.html'))
  // route('/password-reset', 'PasswordResetCtrl', require('./passwordreset.html'))
})

.controller('account:index', function($rootScope, API, PAGE) { require('./index').apply(this, arguments) })


// .controller('LoginCtrl', function($rootScope, $scope, $window, $timeout, $location, SessionService) {
//   var self = this;

//   $scope.returnTo = $location.search().returnTo;
//   $scope.data = {};

//   if ($location.search().as)
//     $scope.data.email = $location.search().as

//   this.submit = function(isValid, formData) {
//     if (!isValid) return
//     SessionService.login(formData,
//       (result) => {
//        // $window.location = '',
//         $timeout(() => { window.location = $scope.returnTo || '/'}, 250)
//       },
//       (e) => {
//         $scope.loginFail = e.message || e
//       }
//     )
//   }
// })

// .controller('PasswordCtrl', function($scope, $location, ServerErrors, SessionService) {

//   $scope.alerts = []

//   $scope.data = { password: '', hash: $location.search().token, email: $location.search().email };

//   $scope.savePassword = function() {
//     SessionService.changePassword($scope.data, function(result){
//       var msg = `New password set`
//       if (!$scope.session._id) msg = `New password set. Return to <a href="/login">Login</a>`

//       $scope.alerts = [{ type: 'success', msg }]
//       $scope.done = true

//     }, ServerErrors.add)
//   }

//   if (!$scope.data.hash)
//     $scope.alerts.push({ type: 'danger', msg: `Password token expired` })

// })

  // .controller('PasswordResetCtrl', function($scope, ServerErrors, SessionService) {

  //   SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/')})

  //   $scope.data = { email: "" }

  //   var self = this;
  //   self.submitReset = function(isValid, formData) {
  //     if (!isValid) return
  //     SessionService.requestPasswordChange(formData, function(result){
  //       $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${result.email}` }]
  //     }, ServerErrors.add)
  //   };
  // })

// angular.module("APProfileDirectives", [])


// .directive('socialLinks', function() {
//   return {
//     template: require('./socialLinks.html'),
//     scope: { p: '=profile' },
//     link(scope, element, attrs) { },
//     controller($scope, $attrs) {
//       $scope.$watch('p', ()=>{
//         if (!$scope.p) return
//         if ($scope.p.so)
//           $scope.p.so.link =
//             $scope.p.so.link.replace('http://stackoverflow.com/users/','')
//       })
//     }
//   };
// })


// .directive('socialScores', function() {

//   return {
//     template: require('./socialScores.html'),
//     scope: { p: '=profile' },
//     link(scope, element, attrs) { },
//     controller($scope, $attrs) {
//     }
//   };
// })


