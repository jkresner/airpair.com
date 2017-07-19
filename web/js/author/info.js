module.exports = function($scope, $routeParams, $location, API, PAGE, StaticData) {

  var id = $routeParams.id

  if (id) {
    $scope.preview = {id}

    API(`/author/info/${id}`, r => PAGE.main($scope).setData({
      _id: r._id,
     by:    r.by,
     tags:  r.tags,
     title: r.title,
     type:  r.type || 'comparison',
     assetUrl: r.assetUrl || '',
     imgur: r.imgur,
    }, data => {
      console.log('um.cb.setPreview', data)
      $scope.preview = data
    }))

    $scope.$watch('data.assetUrl', v => {
      $scope.preview.assetUrl = v
      $scope.preview.assetPlaceholder = v == ''
    })
    $scope.exampleImage = v => {
      $scope.data.imgur = 'XImqjO7'
      $scope.data.assetUrl = 'https://imgur.com/XImqjO7.png'
      // $scope.data.thumbUrl = 'https://imgur.com/XImqjO7m.png'
    }
  }
  else {
    PAGE.main($scope,{loading:false})
        .setData({ title: '', tags: [], type: 'tutorial', imgur: '' })
        .toggleLoading(false)
  }



  $scope.lightup = function(elem) {
    if (elem == false)
      $(`.navtip, .overlay`).removeClass('lit on')
    else if (elem == 'footer')
      $(`.edit footer, .overlay`).addClass('lit on')
    else
      $(`#author${elem}, .overlay`).addClass('lit')
  }


  $scope.save = data => API(`/author${id?'/info/'+id:'/post'}`, data,
    r => {
      window.location = `/editor/${r._id}`
      console.log('success', `/editor/${r._id}`)
    })

  $scope.savable = ({tags,assetUrl,title}) =>
    title != '' && (id ? (tags.length > 0 && assetUrl!='') : true)

}

// if ($scope.session._id == r.by._id) { // don't wipe author with editor session
  // var bio = r.by.bio
  // r.by = _.extend(r.by, $scope.session)  // show latest social links
  // r.by.bio = bio // in case this post has it's own specific bio, don't wipe it!
// }
// })
