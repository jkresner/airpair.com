angular.module('APViewData', [])

.constant('API', '/v1/api')

.factory('ViewData', function aViewDataFactory($rootScope) {

  if (window.viewData)
  {
    var vd = window.viewData
    $rootScope.viewData = { canonical: vd.canonical }

    if (vd.tag) $rootScope.tag = vd.tag
    if (vd.post) $rootScope.post = vd.post
    if (vd.workshop) $rootScope.workshop = vd.workshop
    if (vd.expert) $rootScope.expert = vd.expert
    if (vd.hangoutAppId) $rootScope.hangoutAppId = vd.hangoutAppId
    if (vd.book) {
      $rootScope.expert = window.expert
      window.expert = null
    }
    if (window.job) {
      $rootScope.job = window.job
      window.job = null
    }

    if (vd.session) {
      vd.session.unauthenticated = (vd.session.authenticated!=null
        && vd.session.authenticated == false)
      $rootScope.session = vd.session
    }

    delete window.viewData
  }

  return this;
})

.run(function(ViewData) {
  // console.log('APViewData run sets up the factory before anything else')
})
