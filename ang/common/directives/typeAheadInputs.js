
angular.module('APTypeAheadInputs', ['ui.bootstrap'])

  .value('badUserSearchQuery', function(value, elementSelector) {
    var lengthOk = value && (value.length >= 3);
    var searchBad = !lengthOk;
    angular.element(elementSelector).toggleClass('has-error',searchBad)
    return searchBad;
  })

  .directive('userInput', function(badUserSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./typeAheadUser.html'),
      scope: {},
      controller: function($scope, $attrs, $http) {

        //-- stupid broken angular ui, this fixes it though
        $scope.templateUrl = "userMatch.html"

        $scope.selectUser = $scope.$parent.selectUser

        $scope.getUsers = function(q) {
          if (badUserSearchQuery(q,'.user-input-group')) return [];

          return $http.get('/v1/api/adm/users/search/'+q).then(function(res){
            var results = [];
            angular.forEach(res.data, (item) => results.push(item));
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
      }
    }
  })


  .directive('companyInput', function(badUserSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./typeAheadCompany.html'),
      scope: {},
      controller: function($scope, $attrs, $http) {

        //-- stupid broken angular ui, this fixes it though
        $scope.templateUrl = "companyMatch.html"

        $scope.selectCompany = $scope.$parent.selectCompany

        $scope.getCompanys = function(q) {
          if (badUserSearchQuery(q,'.company-input-group')) return [];

          return $http.get('/v1/api/adm/companys/search/'+q).then(function(res){
            var results = [];
            angular.forEach(res.data, (item) => results.push(item));
            $scope.matches = results;
            return results;
          });
        };

        $scope.selectMatch = function (index) {
          var user = $scope.matches[index];
          $scope.selectCompany(user);
          // $scope.q = user.name;
        };

        $scope.keypressSelect = function(val) {
          if (!val || $scope.matches.length == 0) return null;
          $scope.selectMatch(val);
        }
      }
    }
  })

;
