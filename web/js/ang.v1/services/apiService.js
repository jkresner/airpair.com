angular.module("AirPair.Services.API", [])
.service('API', ($http, $rootScope, ERR) =>

  (url, data, success, error) => {
    var method = 'get'

    if (data.constructor === Function)
    {
      error = success
      success = data
      data = undefined

      if (url.indexOf('delete') !=-1 ) {
        method = 'delete';
        url = url.replace('delete','')
      }
    }
    else {
      if (url.match('/update') || data._id) {
        url = url.replace('update','')
        method = 'put'
      } else {
        method = 'post'
      }
    }

    url.replace(/\/\//g,'/')

    if (false)
      console.log(`API.${method.toUpperCase()}::${url} ${data?JSON.stringify(data):''}`)

    if (!success)
      alert(`Must pass success for ${method.toUpperCase()}:${url}`)

    var httpArgs = [`/api${url}`]
    if (data) httpArgs.push(data)

    $http[method].apply(null, httpArgs)
                 .success(success)
                 .error(error||ERR.addServerError)
  }

)
