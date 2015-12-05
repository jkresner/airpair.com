angular.module("APDealsDirectives", [])


// .directive('dealTile', function() {

//   return {
//     restrict: 'E',
//     template: require('./dealTile.html'),
//     link(scope, element, attrs) {
//       scope.post = scope.$eval(attrs.post)
//     }
//   }

// })


.directive('dealForm', (DataService) => {
  return {
    template: require('./dealForm.html'),
    scope: { data: '=deal', success: '=success', expert: '=expert' },
    controller($scope, $rootScope, $element, $attrs, $http) {

      if (!$scope.data)
        $scope.data = { target: { type: 'all' }, type: 'airpair', q: '' }


      $scope.checkCode = (code) => {
        if (!code || code == '') return
        console.log('impl check code')
      }

      $scope.saveDeal = (isValid, data, form) => {
        // console.log('form', form.q.$invalid, form.q)
        var deal = _.extend({ expertId: $scope.expert._id }, $scope.data)
        // console.log('saveDeal', isValid, form)
        if (isValid)
          DataService.experts.saveDeal(deal, $scope.success)
      }



      $scope.deselectTag = () => $scope.data.tag = null

      $scope.selectTag = function(tag) {
        if (!$scope.data.tag || $scope.data.tag._id != tag._id)
          $scope.data.tag = tag
        else
          $scope.data.tag = null
      }
      $scope.selectMatch = function (index) {
        var tag = $scope.matches[index]
        if (tag) $scope.selectTag(tag)
        $scope.data.q = ""
        return ''
      };


      $scope.getTags = function(q) {
        q = encodeURIComponent(q)
        return $http.get('/v1/api/tags/search/'+q).then(function(res){
          $scope.matches = []
          angular.forEach(res.data, (item) => { if (item) $scope.matches.push(item) })
          return $scope.matches
        })
      }
      $scope.keypressSelect = function(val) {
        if (!val || $scope.matches.length == 0) return ''
        $scope.selectTag(0)
        return ''
      }
      //-- stupid broken angular ui, this fixes it though
      $scope.templateUrl = "tagMatch.html"
    }
  }
})
