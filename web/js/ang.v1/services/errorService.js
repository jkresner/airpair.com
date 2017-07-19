angular.module("AirPair.Services.Error", [])


.service('ERR', ($rootScope, $location) => ({

  checkQuerystring() {
    if ($location.search().err)
      $rootScope.Errs.push(decodeURIComponent($location.search().err))
  },

  addServerError(e) {
    $rootScope.Errs.push(e)
  },

  addClientErrorMsg(message) {
    $rootScope.Errs.push({message})
  },

  clear() {
    $rootScope.Errs = []
  }

}))
