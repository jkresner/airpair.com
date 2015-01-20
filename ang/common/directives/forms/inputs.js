
angular.module('APInputs', ['ui.bootstrap','angularLoad'])

  .directive('locationInput', function(angularLoad) {

    var src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=mapInitialize';
    var ngLoadPromise = angularLoad.loadScript(src);

    return {
      restrict: 'EA',
      template: require('./locationInput.html'),
      scope: {
        onSelect: '=onSelect',
        data: '=data',
        ngModel: '=',
        details: '=?'
      },
      link: function(scope, element, attrs) {
        var options = {
            types: ['(cities)'],
            componentRestrictions: {}
        }

        var mapInitialize = function ()
        {
          var input = element.find('input')[0]

          scope.gPlace = new google.maps.places.Autocomplete(input, options);

          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
              scope.details = scope.gPlace.getPlace()
              scope.data.location = $(input).val()

              if (scope.onSelect)
                scope.onSelect(scope.details)

            })
          })

          delete window.mapInitialize
        }

        window.mapInitialize = mapInitialize

        ngLoadPromise.then(() => {})
      }
    }
  })

  .directive('datetimeInput', function() {
    return {
      restrict: 'EA',
      template: require('./datetimepicker.html'),
      scope: {
        datetime: '=datetime',
        setCallback: '=setCallback'
      },
      link: function(scope, element, attrs) {
        scope.id = attrs.id
        scope.minView = attrs.minView || 'day'
        scope.startView = attrs.startView || 'day'
        scope.minuteStep = attrs.minuteStep || 30
        scope.dateFormat = attrs.dateFormat || 'YYYY MMM DD'
      },
      controller: function($scope, $element, $attrs) {

        $scope.onSetTime = (newDate, oldDate) => {
          if ($scope.setTimeCallback)
            scope.setTimeCallback(newDate, oldDate)
          $element.find('.dropdown').removeClass('open')
          $scope.datetime = moment(newDate)
        }

      }
    };
  })

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


  .directive('expertInput', function(badUserSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./typeAheadExpert.html'),
      scope: {},
      controller: function($scope, $attrs, $http) {
        //-- stupid broken angular ui, this fixes it though
        $scope.templateUrl = "expertMatch.html"

        $scope.selectExpert = $scope.$parent.selectExpert

        $scope.getsExperts = function(q) {
          if (badUserSearchQuery(q,'.user-input-group')) return [];

          return $http.get('/v1/api/experts/search/'+q).then(function(res){
            var results = [];
            angular.forEach(res.data, (item) => results.push(item));
            $scope.matches = results;
            return results;
          });
        };

        $scope.selectMatch = function (index) {
          var m = $scope.matches[index];
          $scope.selectExpert(m);
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
