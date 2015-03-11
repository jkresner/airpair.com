
angular.module('APInputs', ['ui.bootstrap','angularLoad'])

  .directive('locationInput', function(angularLoad) {

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

        var src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=mapInitialize';
        var ngLoadPromise = angularLoad.loadScript(src);

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


  .directive('textareaGrow', [
    '$timeout', '$window',
    function($timeout, $window) {
      'use strict';

      return {
        require: 'ngModel',
        restrict: 'A, C',
        link: function(scope, element, attrs, ngModel) {

          // cache a reference to the DOM element
          var ta = element[0],
              $ta = element;

          // ensure the element is a textarea, and browser is capable
          if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
            return;
          }

          // set these properties before measuring dimensions
          $ta.css({
            'overflow': 'hidden',
            'overflow-y': 'hidden',
            'word-wrap': 'break-word'
          });

          // force text reflow
          var text = ta.value;
          ta.value = '';
          ta.value = text;

          var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : '',
              $win = angular.element($window),
              mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                                'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                                '-moz-box-sizing: content-box; box-sizing: content-box;' +
                                'min-height: 0 !important; height: 0 !important; padding: 0;' +
                                'word-wrap: break-word; border: 0;',
              $mirror = angular.element('<textarea tabindex="-1" ' +
                                        'style="' + mirrorInitStyle + '"/>').data('elastic', true),
              mirror = $mirror[0],
              taStyle = getComputedStyle(ta),
              resize = taStyle.getPropertyValue('resize'),
              borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                          taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                          taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
              boxOuter = !borderBox ? {width: 0, height: 0} : {
                            width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                                    parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                            height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                                    parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                          },
              minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
              heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
              minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
              maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
              mirrored,
              active,
              copyStyle = ['font-family',
                           'font-size',
                           'font-weight',
                           'font-style',
                           'letter-spacing',
                           'line-height',
                           'text-transform',
                           'word-spacing',
                           'text-indent'];

          // exit if elastic already applied (or is the mirror element)
          if ($ta.data('elastic')) {
            return;
          }

          // Opera returns max-height of -1 if not set
          maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

          // append mirror to the DOM
          if (mirror.parentNode !== document.body) {
            angular.element(document.body).append(mirror);
          }

          // set resize and apply elastic
          $ta.css({
            'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
          }).data('elastic', true);

          /*
           * methods
           */

          function initMirror() {
            var mirrorStyle = mirrorInitStyle;

            mirrored = ta;
            // copy the essential styles from the textarea to the mirror
            taStyle = getComputedStyle(ta);
            angular.forEach(copyStyle, function(val) {
              mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
            });
            mirror.setAttribute('style', mirrorStyle);
          }

          function adjust() {
            var taHeight,
                taComputedStyleWidth,
                mirrorHeight,
                width,
                overflow;

            if (mirrored !== ta) {
              initMirror();
            }

            // active flag prevents actions in function from calling adjust again
            if (!active) {
              active = true;

              mirror.value = ta.value + append; // optional whitespace to improve animation
              mirror.style.overflowY = ta.style.overflowY;

              taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

              taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

              // ensure getComputedStyle has returned a readable 'used value' pixel width
              if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                // update mirror width in case the textarea width has changed
                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                mirror.style.width = width + 'px';
              }

              mirrorHeight = mirror.scrollHeight;

              if (mirrorHeight > maxHeight) {
                mirrorHeight = maxHeight;
                overflow = 'scroll';
              } else if (mirrorHeight < minHeight) {
                mirrorHeight = minHeight;
              }
              mirrorHeight += boxOuter.height;
              ta.style.overflowY = overflow || 'hidden';

              if (taHeight !== mirrorHeight) {
                ta.style.height = mirrorHeight + 'px';
                scope.$emit('elastic:resize', $ta);
              }

              // small delay to prevent an infinite loop
              $timeout(function() {
                active = false;
              }, 1);

            }
          }

          function forceAdjust() {
            active = false;
            adjust();
          }

          /*
           * initialise
           */

          // listen
          if ('onpropertychange' in ta && 'oninput' in ta) {
            // IE9
            ta['oninput'] = ta.onkeyup = adjust;
          } else {
            ta['oninput'] = adjust;
          }

          $win.bind('resize', forceAdjust);

          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            forceAdjust();
          });

          scope.$on('elastic:adjust', function() {
            initMirror();
            forceAdjust();
          });

          $timeout(adjust);

          /*
           * destroy
           */

          scope.$on('$destroy', function() {
            $mirror.remove();
            $win.unbind('resize', forceAdjust);
          });
        }
      };
    }
  ])
