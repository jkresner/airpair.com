module.exports = function($scope, $routeParams, $location, API, PAGE) {

  var _id = $routeParams.id

  if (_id) {
    $scope.data = {_id}

    API(`/author/info/${_id}`, r => PAGE.main($scope).setData({
      _id:      r._id,
      by:       r.by,
      tags:     r.tags,
      title:    r.title,
      type:     r.type || 'comparison',
      assetUrl: r.assetUrl || '',
      imgur:    r.imgur
    }, data => {
      $scope.data = data
      $scope.preview = data
      // console.log('um.cb.setPreview', $scope.preview)
    }))

    $scope.$watch('preview.assetUrl', v => {
      if (!$scope.preview) return
      if (v == '' || !v)
        $scope.preview.assetPlaceholder = true
      else
        $scope.preview.assetUrl = v
    })
    $scope.exampleImage = v => {
      $scope.preview.imgur = 'XImqjO7'
      $scope.preview.assetUrl = 'https://imgur.com/XImqjO7.png'
      $scope.preview.assetPlaceholder = false
    }
  }
  else
    PAGE.main($scope,{loading:false})
        .setData({ title: '', tags: [], type: 'tutorial', imgur: '' })
        .toggleLoading(false)


  $scope.lightup = function(elem) {
    if (elem == false)
      $(`.navtip, .overlay`).removeClass('lit on')
    else if (elem == 'footer')
      $(`.edit footer, .overlay`).addClass('lit on')
    else
      $(`#author${elem}, .overlay`).addClass('lit')
  }


  $scope.save = data => API(`/author${_id?'/info/'+_id:'/post'}`, data,
    r => {
      window.location = `/author/editor/${r._id}`
      // console.log('success', `/editor/${r._id}`)
    })

  $scope.savable = d =>
    d.title != '' && (d._id ? ((d.tags||[]).length > 0 && d.assetUrl!='') : true)

}

// if ($scope.session._id == r.by._id) { // don't wipe author with editor session
  // var bio = r.by.bio
  // r.by = _.extend(r.by, $scope.session)  // show latest social links
  // r.by.bio = bio // in case this post has it's own specific bio, don't wipe it!
// }
// })
