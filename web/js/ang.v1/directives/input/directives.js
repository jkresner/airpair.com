angular.module("AirPair.Directives.Input", ['angularLoad', 'ui.bootstrap'])


.directive('socialConnect', ($rootScope, $location) => ({

  template: require('./socialConnect.html'),
  scope: {
    unlink: '=onunlink',
    linked: '=linked',
    returnTo: '=returnTo',
  },
  controller($scope, $attrs) {
    $scope.return = $scope.returnTo || $location.path()
    var {linked} = $scope
  }

}))

// .directive('socialConnect', function($rootScope, $location) {
//   return {
//     template: require('./socialConnect.html'),
//     scope: {
//       returnTo: '=returnTo',
//     },
//     controller($scope, $attrs) {
//       $scope.data = {}
//       $scope.return = $scope.returnTo || $location.path()
//       $rootScope.$watch('session', (session) => {
//         if (session.auth) {
//           if (session.auth.gh) $scope.data.gh = session.auth.gh.login
//           if (session.auth.tw) $scope.data.tw = session.auth.tw.screen_name
//           if (session.auth.so) $scope.data.so = session.auth.so.link
//           if (session.auth.in) $scope.data.in = session.auth.in.id
//           if (session.auth.bb) $scope.data.bb = session.auth.bb.username
//           if (session.auth.gp) $scope.data.gp =
//             session.auth.gp.link || session.auth.gp.url || session.auth.gp.id
//           if (session.auth.al) $scope.data.al =
//             session.auth.al.username || session.auth.al.angellist_url
//         }
//       })
//     }
//   };
// })


.directive('singleSubmit', ($timeout, ERR) => ({

  template: `<a class="btn" ng-click="singleClick()" ng-disabled="btnDisabled">
    <span ng-if="btnDisabled">{{waitText}} </span>
    <span ng-if="!btnDisabled">{{buttonText}}</span>
  </a>`,
  scope: {
    buttonText: '=buttonText',
    onSingleClick: '=onSingleClick',
    onError: '=onError',
  },
  link(scope, element, attrs) {
    scope.waitText = attrs.waitText || 'loading'
    scope.btnDisabled = false;
    scope.onError = scope.onError || ERR.addServerError

    scope.singleClick = () => {
      $timeout(() => scope.btnDisabled = true, 0)
      if (!scope.btnDisabled)
        scope.onSingleClick()
          .then(data => scope.btnDisabled = false,
                data => {
                  scope.btnDisabled = false
                  scope.onError(data)
                })
    }
  }
}))


// https://docs.angularjs.org/api/ng/directive/select
.directive('convertToNumber', () => ({
  require: 'ngModel',
  link(scope, element, attrs, ngModel) {
    ngModel.$parsers.push( val => parseInt(val, 10) )
    ngModel.$formatters.push( val => '' + val )
  }
}))


.value('badTagsQuery', function(value) {
  var lengthOk = value && (value.length >= 2 || /r|c/i.test(value))
  var regexMatch = /\[|\]|\{|\}/g.test(value)
  var searchBad = !lengthOk || regexMatch
  // angular.element('.tag-input-group').toggleClass('has-error',searchBad)
  return searchBad;
})

.directive('inputTags', (badTagsQuery) => ({

  template: require('./tags.html'),
  scope: {
    data: '=data',
    onSelect: '=onSelect',
    onRemove: '=onRemove',
  },
  controller($scope, $http) {

    $scope.selected = undefined

    $scope.getTags = function(q) {
      // $scope.addErrorMsg = false
      if (badTagsQuery(q)) return []

      return $http.get(`/api/tags/search?q=${encodeURIComponent(q)}`)
        .then(function(res) {
          var tags = []
          angular.forEach(res.data, function(item) {
            if (item)
              tags.push(item)
          });

          $scope.none = tags.length == 0 ? q : null

          return tags
        })
    }

    if (!$scope.onSelect)
      $scope.onSelect = ($item, $model, $label) => {
        var existing = _.find($scope.data, t => t.slug == $item.slug)
        $scope.data = existing ? _.without($scope.data, existing)
                               : _.union($scope.data, [$item])
        $scope.selected = null
      }

    if (!$scope.onRemove)
      $scope.onRemove = $item => $scope.data = _.without($scope.data, $item)

    // $scope.tags = $scope.$parent.tags
    // $scope.selectTag = $scope.$parent.selectTag
    // $scope.deselectTag = $scope.$parent.deselectTag
    // $scope.updateTags = $scope.$parent.updateTags
    // $scope.sortSuccess = $scope.$parent.sortSuccess
    // $scope.sortFail = $scope.$parent.sortFail

    //   $scope.addErrorMsg = false

    // $scope.keypressSelect = function(val) {
    //   if (!val || $scope.matches.length == 0) return null;
    //   $scope.selectMatch(0);
    // }

    // $scope.selectMatch = function (index) {
    //   var tag = $scope.matches[index]
    //   if (tag) $scope.selectTag(tag)
    //   $scope.q = ""
    // };

    // $scope.deselectMatch = function (match) {
    //   $scope.deselectTag(match)
    // };

    // $scope.addTag = function(q) {
    //   $scope.adding = true
    //   DataService.tags.create({ tagfrom3rdparty: q }, function(tag) {
    //     $scope.adding = false
    //     if (tag) $scope.selectTag(tag)
    //     $scope.q = ""
    //   },
    //   function(e) {
    //     // console.log(e)
    //     $scope.adding = false
    //     $scope.addErrorMsg = true
    //   })
    // };
  }

}))

.directive('inputDatetime', () => ({

  restrict: 'EA',
  template: require('./datetime.html'),
  scope: {
    picktime: '=picktime',
    datetime: '=datetime',
    onChange: '=onChange'
  },
  // link(scope, element, attrs) {
    // scope.id = attrs.id
    // scope.minView = attrs.minView || 'day'
    // scope.startView = attrs.startView || 'day'
    // scope.minuteStep = attrs.minuteStep || 30
    // scope.dateFormat = attrs.dateFormat || 'YYYY MMM DD'
  // },
  controller($scope, $element) {
    $scope.picktime = $scope.picktime || false

    // console.log('inputDatetime')
    // $scope.onSetTime = (newDate, oldDate) => {
    //   if ($scope.setTimeCallback)
    //     scope.setTimeCallback(newDate, oldDate)
    //   $element.find('.dropdown').removeClass('open')
    //   $scope.datetime = moment(newDate)
    // }

  }

}))


// var keymap =
//   9,  // tab
//   13, // enter
//   27, // esc
//   38, // up
//   40  // down
.directive('inputLocation', (angularLoad) => ({

  restrict: 'EA',
  template: require('./location.html'),
  scope: {
    tbIdx: '=tabindex',
    onSelect: '=onSelect',
    data: '=data',
    ngModel: '=',
    details: '=?'
  },
  link(scope, element, attrs) {
    var src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=mapInitialize';

    scope.tbIdx = scope.tbIdx || 101
    scope.ui = { loaded: false }
    scope.ui.input = scope.data ? scope.data.name : null
    scope.ui.selected = scope.data ? scope.data.shortName : "Location not yet set..."

    window.mapInitialize = function () {
      var options = { types: ['(cities)'], componentRestrictions: {} }
      var input = element.find('input')[0]
      scope.gPlace = new google.maps.places.Autocomplete(input, options)

      var selectPlace = function() {
        var details = scope.gPlace.getPlace()
        // console.log('selectPlace', details)

        if (!details || !details.geometry) {
          // var suggestion_selected = $(".pac-item-selected").length > 0
          // var first_text = $(".pac-container .pac-item:first").text()
          alert('Please click on an option from the list that appears as you type to save timezone')
        }
        else
        {
          var lat = details.geometry.location.lat()
          var lng = details.geometry.location.lng()
          scope.ui.selected = $(input).val()
          if (scope.onSelect)
            scope.onSelect(_.extend(details,{coordinates:{lat,lng}}))
        }
      }

      google.maps.event.addListener(scope.gPlace, 'place_changed', () => scope.$apply(selectPlace))

      scope.onKeydown = function($event) {
        // console.log('onKeydown', $event.keyCode, $(input).val(), scope.data, previousLocation)
        if ($event.keyCode == 9 && $(input).val() != scope.ui.selected)
          alert('Please click on an option from the list that appears as you type to save timezone')
      }

      delete window.mapInitialize
    }

    angularLoad.loadScript(src).then(() => scope.ui.loaded = true)
  }

}))


/**
 * A generic confirmation for risky actions.
 * Usage: Add attributes: confirm-msg="Really?" ng-confirm-click="takeAction()" function
 */
.directive('ngConfirmClick', () => ({

  restrict: 'A',
  link(scope, element, attrs) {
    element.bind('click', function() {
      if (attrs.confirm && confirm(attrs.confirm))
        scope.$apply(attrs.ngConfirmClick)
    })
  }

}))



.directive('stars', () => ({

  template: require('./stars.html'),
  scope: { stars: '=val' },
  controller($scope, $element) {

  }

}))


// .directive('inputStars', () => ({

//   template: require('./stars.html'),
//   scope: { stars: '=val' },

// }))




// https://github.com/melloc01/angular-input-stars
.directive('inputStars', function () {

    var directive = {

        restrict: 'EA',
        replace: true,
        template: '<ul ng-class="listClass">' +
        '<li ng-touch="paintStars($index)" ng-mouseenter="paintStars($index, true)" ng-mouseleave="unpaintStars($index, false)" ng-repeat="item in items track by $index">' +
        '<i  ng-class="getClass($index)" ng-click="setValue($index, $event)"></i>' +
        '</li>' +
        '</ul>',
        require: 'ngModel',
        scope: true,

        link: link

    };

    return directive;

    function link(scope, element, attrs, ngModelCtrl) {

        scope.items = new Array(+attrs.max);

        var emptyIcon = attrs.iconEmpty || 'fa-star-o';
        var iconHover = attrs.iconHover || 'angular-input-stars-hover';
        var fullIcon = attrs.iconFull || 'fa-star';
        var iconBase = attrs.iconBase || 'fa fa-fw';
        scope.listClass = attrs.listClass || 'angular-input-stars';
        scope.readonly  = ! (attrs.readonly === undefined);

        ngModelCtrl.$render = function () {

            scope.last_value = ngModelCtrl.$viewValue || 0;

        };

        scope.getClass = function (index) {

            return index >= scope.last_value ? iconBase + ' ' + emptyIcon : iconBase + ' ' + fullIcon + ' active ';

        };

        scope.unpaintStars = function ($index, hover) {

            scope.paintStars(scope.last_value - 1, hover);

        };

        scope.paintStars = function ($index, hover) {

            //ignore painting, if readonly
            if (scope.readonly) {
                return;
            }
            var items = element.find('li').find('i');

            for (var index = 0; index < items.length; index++) {

                var $star = angular.element(items[index]);

                if ($index >= index) {

                    $star.removeClass(emptyIcon);
                    $star.addClass(fullIcon);
                    $star.addClass('active');
                    $star.addClass(iconHover);

                } else {

                    $star.removeClass(fullIcon);
                    $star.removeClass('active');
                    $star.removeClass(iconHover);
                    $star.addClass(emptyIcon);

                }
            }

            !hover && items.removeClass(iconHover);

        };

        scope.setValue = function (index, e) {

            //ignore painting
            if (scope.readonly) {
                return;
            }
            var star = e.target;

            if (e.pageX < star.getBoundingClientRect().left + star.offsetWidth / 2) {
                scope.last_value = index + 1;
            } else {
                scope.last_value = index + 1;
            }

            ngModelCtrl.$setViewValue(scope.last_value);

        };

    }

});
