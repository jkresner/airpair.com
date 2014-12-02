
angular.module('APUserInput', ['ui.bootstrap'])

  .value('badUserSearchQuery', function(value) {
    var lengthOk = value && (value.length >= 2);
    var searchBad = !lengthOk;
    angular.element('.user-input-group').toggleClass('has-error',searchBad)
    return searchBad;
  })

  .directive('userInput', ['badUserSearchQuery', function(badUserSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./userInput.html'),
      scope: {
      },
      controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {

        $scope.selectUser = $scope.$parent.selectUser

        //-- stupid broken angular ui, this fixes it though
        $scope.templateUrl = "userMatch.html"

        $scope.getUsers = function(q) {
          if (badUserSearchQuery(q)) return [];

          return $http.get('/v1/api/adm/users/search/'+q).then(function(res){
            var results = [];
            angular.forEach(res.data, function(item){
              results.push(item);
            });

            $scope.matches = results;
            return results;
          });
        };

        $scope.selectMatch = function (index) {
          var user = $scope.matches[index];
          $scope.selectUser(user);
          // $scope.q = user.name;
        };

        $scope.keypressSelect = function(val) {
          if (!val || $scope.matches.length == 0) return null;
          $scope.selectMatch(val);
        }

      }]
    }
  }])

;
