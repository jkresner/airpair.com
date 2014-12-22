var util = require('../../../shared/util.js');


angular.module("ADMPipeline", ["APRequestDirectives"])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/adm/pipeline', {
      template: require('./list.html'),
      controller: 'PipelineCtrl'
    });

    $routeProvider.when('/adm/pipeline/:id', {
      template: require('./item.html'),
      controller: 'RequestCtrl'
    });

  })

  .controller('RequestCtrl', function($scope, $routeParams, $location, AdmDataService, ServerErrors) {

    $scope.request = {}

    AdmDataService.pipeline.getRequest($routeParams.id, function (r) {
      $scope.request = r;
      $scope.meta = {
        shortBrief: r.brief.length < 250,
        okToDelete: r.suggested.length == 0
      }
      AdmDataService.billing.getUserPaymethods(r.userId, function (pms) {
        $scope.paymethods = (pms.btoken) ? [] : pms;
        $scope.meta.noPaymethod = $scope.paymethods.length < 1
      })
      AdmDataService.getUsersViews({_id:r.userId}, function (views) {
        $scope.views = views.reverse()
      })
      AdmDataService.pipeline.getRequestMatches(r._id, function (experts) {
        $scope.matches = experts;
      })
    },
      () => $location.path('/adm/pipeline')
    )

    $scope.delete = () =>
      AdmDataService.pipeline.deleteRequest($routeParams.id, function (r) {
        $location.path('/adm/pipeline')
      }, ServerErrors.add)


    $scope.addSuggestion = (expertId) => {
      var expert = _.find($scope.matches, (e) => e._id == expertId)
      AdmDataService.pipeline.addSuggestion({_id:$scope.request._id, expertId}, function (r) {
        $scope.request = r
        $scope.meta.okToDelete = r.suggested.length == 0
        $scope.matches = _.without($scope.matches, expert)
      }, ServerErrors.add)
    }

    $scope.removeSuggestion = (expertId) =>
      AdmDataService.pipeline.removeSuggestion({_id:$scope.request._id, expertId}, function (r) {
        $scope.request = r
        $scope.meta.okToDelete = r.suggested.length == 0
      }, ServerErrors.add)


  })


  .controller('PipelineCtrl', function($scope, AdmDataService) {
    $scope.today = moment().startOf('day')
    $scope.tomorrow = moment().startOf('day').add(1,'days')

    var start = moment()
    AdmDataService.pipeline.getActive((requests) => {
      var todays = [], incomplete = [], complete = [];
      _.each(requests, (r) => {
        r.created = moment(util.ObjectId2Date(r._id))
        // console.log('r.created', r.created.format(), util.dateInRange(r.created, $scope.today, $scope.tomorrow))
        if (util.dateInRange(r.created, $scope.today, $scope.tomorrow)) todays.push(r)
        if (r.budget) complete.push(r)
        else incomplete.push(r)
      })

      var budgetCount=0, briefCount=0, tagsCount=0, typeCount=0;
      for (var i=0;i<todays.length;i++)
      {
        budgetCount += todays[i].budget ? 1 : 0
        briefCount += todays[i].brief ? 1 : 0
        tagsCount += (todays[i].tags.length > 0) ? 1 : 0
        typeCount += todays[i].type ? 1 : 0
      }

      $scope.todays = { budgetCount, briefCount, tagsCount, typeCount }
      $scope.requests = { todays, incomplete, complete }

      console.log('setScope', moment().diff(start,'milliseconds'))
    })
  })
