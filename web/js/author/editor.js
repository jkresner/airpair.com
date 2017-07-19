module.exports = function($scope, $routeParams, $timeout, $window, API, PAGE, UTIL, StaticData) {
  var MAIN = PAGE.main($scope)
  var timer, throttlePreviewMS, unsavedMsg;
  var _id = $routeParams.id
  $scope.data = { _id }
  var ui = null
  var uiSet = state => $scope.ui = MAIN.uiSet(state)


  var setScope = function(resp) {
    var r = resp.post

    MAIN.toggleLoading(false)
    if (r.published && !r.submitted)
      window.location = `/submit/${_id}`

    $scope.post = r

    $scope.data.commitMessage = ''
    $scope.data.md = resp.md.live == "new"
      ? StaticData.defaultPostMarkdown.toString()
      : resp.md.head || resp.md.live

    $scope.todo = resp.todo

    ui = {
      md: {
        saved: resp.md.head || resp.md.live,
        isNew: resp.md.live == "new",
        synced: resp.md.head === resp.md.live,
        // merged: r.md.head === r.md.live,
        repo: r.repo
      },
      wordcount: r.stats.words,
      underWordcount: r.stats.words < 400,
      saved: true,
      status: {
        submitted: r.submitted,
        published: r.published
      },
      preview: (ui||{}).preview || {
        mode: 'tablet-portrait',
        w: StaticData.viewMode['tablet-portrait'],
        toggle: mode => {
          ui.preview.mode = mode
          ui.preview.w = StaticData.viewMode[mode]
          uiSet(ui)
        }
      }
    }

    if (r.repo && r.repo.fork) {
      //-- This isn't right, we need to check merged PRs properly
      ui.md.merged = r.md.head === r.md.live
      ui.PRUrl = UTIL.post.pullRequestUrl(r, r.repo.owner)
    }

    uiSet(ui)

    if (screen.width > 640) $timeout(refreshPreview, 1200)

    // $scope.previewable = UTIL.post.previewable(r)
  }

  var editorMD = x => window.ace.edit($('#aceeditor')[0]).getSession().getValue()
  var isDefaultMD = md => ui.md.isNew && StaticData.defaultPostMarkdown == md

  var refreshStatusBar = () => {
    // var editSession = window.ace.edit($('#aceeditor')[0]).getSession()
    // var cols = editSession.getScreenWidth()
    var md = editorMD()
    $scope.data.md = md // UTIL.post.splitLines(editSession.doc.$lines.slice(0), cols, editSession.doc).join('\n')

    var saved = ui.md.saved == md || isDefaultMD(md)

    //-- Refresh the throttle
    if (!saved) throttlePreviewMS = ((md.length%200)+10) * 4

    //-- Only set these once on the first unsaved change
    if (!saved && !unsavedMsg) {
      unsavedMsg = `Looks like you have unsaved changes...`
      $window.onbeforeunload = () => refreshStatusBar() ? null : unsavedMsg
      $scope.$on("$locationChangeStart", function(event) {
        if (!refreshStatusBar()) {
          alert(unsavedMsg)
          event.preventDefault()
        }
      })
    }

    ui.saved = saved
    uiSet(ui)
    return saved
  }

  $scope.editorCss = mode =>
    (ui.preview.mode == 'off' ? 'solo' : 's'+ui.preview.w) +
    (ui.saved ? ' wk_saved': ' wk_unsaved')

  var refreshPreview = function() {
    if (timer) {
      $timeout.cancel(timer)
      timer = null
    }
    refreshStatusBar()

    var preview = UTIL.post.extractReferences($scope.data.md)
    preview.title = $scope.post.title
    preview.tags = $scope.post.tags
    preview.assetUrl = $scope.post.assetUrl
    preview.body = UTIL.post.marked($scope.data.md)
    if (preview.references)
      preview.markedUpReferences = UTIL.post.markupReferences(preview.references, UTIL.post.marked)
    $scope.preview = preview
    // if ($scope.saved && $scope.preview.body) return
  }

  $scope.aceLoaded = _editor => _editor.$blockScrolling = Infinity
  $scope.aceChanged = function(e) {
    if (ui.saved && isDefaultMD(editorMD())) return
    if (!throttlePreviewMS) return refreshPreview()
    if (timer == null) timer = $timeout(refreshPreview, throttlePreviewMS)
  }


  $scope.save = () => {
    refreshStatusBar()
    if ($scope.post.submitted && $scope.data.commitMessage == "")
      return alert('Commit message required')
    API(`/author/markdown/${_id}`, $scope.data, setScope)
  }


  $scope.sync = () => $scope.post.published
    ? alert("Ask an editor to sync your post")
    : API(`/author/sync/${_id}`, {_id}, setScope)


  API(`/author/markdown/${_id}`, setScope)

  $scope.hidefooter = () => {
    $('.edit footer').hide()
    $('div.editor-wrap').addClass('extend')
  }
}
