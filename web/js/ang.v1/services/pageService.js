angular.module("AirPair.Services.Page", [])


.factory('PAGE', function pageFactory($rootScope, ERR) {
  $rootScope.ui = $rootScope.ui || { main: { loading: true } }

  // takes data embeded on a page and puts it on the angular (root)scope
  if (window.pageData)
  {
    var session = window.pageData.session
    // console.log('window.pageData.session', window.pageData.session)
    // if (d.tag) $rootScop1e.tag = d.tag

    if (session) {
      session.unauthenticated =
        (session.authenticated != null && session.authenticated == false)

      $rootScope.session = session
    }

    delete window.pageData
  }


  function toggleLoading(show) {
    // console.log('toggleLoading', show)
    if (show == null) show = !$rootScope.ui.main.loading
    if (show === false || show === true) $rootScope.ui.main.loading = show
    // console.log('toggleLoading.show', show, $rootScope.ui.main.loading)
  }


  return {
    ERR: ERR,
    main(scope, opts) {
      opts = opts || {}
      if (opts.loading !== false) $rootScope.ui.main.loading = true
      // console.log('main.opts', opts, $rootScope.ui.main)

      if (opts.util) scope.util = scope.util || {}
      Object.keys(opts.util||{}).forEach(n => scope.util[n] = opts.util[n] )
      Object.keys(opts.data||{}).forEach(key => scope[key] = opts.data[key] )

      return {
        setData(data, cb) {
          console.log('PAGE.setData', data)
          Object.keys(data).forEach(key => scope[key] = data[key])
          // var ui = ($rootScope.ui||{}).main
          // if (ui && ui.loading) $rootScope.ui.main.loading = false
          // var uiWrapped = fn => function() {
            // if (ui) $rootScope.ui.main.loading = false
            // console.log('uiWrapped', $rootScope.ui.main)
            // fn.apply(this, arguments)
          // }

          if (cb && typeof cb === "function") cb(data)
          if (opts.loading !== false) toggleLoading(false)
          return { toggleLoading }
        },
        uiSet(state) {
          $rootScope.ui.page = state
          return state
        },
        uiGet() {
          return $rootScope.ui.page
        },
        uiWatch(fn) {
          $rootScope.watch('ui.page', state => fn(state))
        },
        toggleLoading
      }
    }
  }

})




.run(function(PAGE) {
  // console.log('PAGE run sets up the factory before anything else')
})
