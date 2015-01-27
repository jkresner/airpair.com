
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
        var keymap = [
          9, //tab:
          13, //enter:
          27, //esc:
          38, //up:
          40 //down:
        ];

        var options = {
            types: ['(cities)'],
            componentRestrictions: {}
        }

        var mapInitialize = function ()
        {
          var previousLocation = scope.data.location
          var input = element.find('input')[0]

          scope.gPlace = new google.maps.places.Autocomplete(input, options)

          var selectPlace = function() {
            scope.details = scope.gPlace.getPlace()

            // console.log('details', scope.details)
            if (!scope.details || !scope.details.geometry) {
              // var suggestion_selected = $(".pac-item-selected").length > 0
              // var first_text = $(".pac-container .pac-item:first").text()
              alert('Please click on an option from the list that appears as you type to save timezone')
            }
            else
            {
              scope.data.location = $(input).val()
              previousLocation = scope.data.location
              if (scope.onSelect)
                scope.onSelect(scope.details)
            }
          }

          google.maps.event.addListener(scope.gPlace, 'place_changed', () => scope.$apply(selectPlace))

          scope.onKeydown = function($event) {
            // console.log('onKeydown', $event.keyCode, $(input).val(), scope.data, previousLocation)
            if ($event.keyCode == 9 && $(input).val() != previousLocation)
              alert('Please click on an option from the list that appears as you type to save timezone')
          }

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
