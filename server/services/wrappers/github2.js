var logging = true
var GitHubApi = require("github")

var api = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  // debug: true,
  protocol: "https",
  timeout: 5000,
  headers: {
    "user-agent": "AirPair"
  }
})

var verboseErrorCB = (cb, err, fn, dataString) => {
  $log('github.error'.red, fn.white, dataString, err)
  cb(err)
}

var setToken = function(user) {
  var token = null
  if (user == 'admin') token = config.auth.github.adminAccessToken
  else if (!user.social || !user.social.gh || !user.social.gh.token)
    throw Error(`github.setToken social.gh on user [${user.email}][${user._id}] not present`)
  else
    token = user.social.gh.token.token
  api.authenticate({ type: "oauth", token })
}

var getGithubUser = function(user) {
  if (user.social && user.social.gh && user.social.gh.username && user.social.gh.token.token)
    return { username: user.social.gh.username, token: user.social.gh.token.token }
}

// var setEventData = function(post, cb){
//   github.repoEvents(org, post.slug, (err,resp)=>{
//     if (err) return cb(err)
//     var existingEvents = post.github.events || []
//     post.github.events = _.union(existingEvents, resp)
//     cb(err,resp)
//   })
// }


var gh = {



  // createRepoReviewTeam(repo, id, cb){
  //   var _this = this;
  //   var teamName = `${repo}-${id.toString().slice(-8)}-review`

  //   _authenticateAdmin()
  //   api.orgs.createTeam({
  //     org: org,
  //     name: teamName,
  //     repo_names: [`${org}/${repo}`],
  //     description: `Review team for ${repo} (read-only)`,
  //     permission: 'pull'
  //   }, function(err, resp){
  //     if (!err) return cb(err,resp);
  //     var parsedError = JSON.parse(err.message)
  //     var errors = parsedError.errors
  //     if (errors && errors.length == 1 && errors[0].code === "already_exists"){
  //       //team is already created, list teams and send that back
  //       _this.getTeamId(repo, teamName, function(err, result){
  //         if (err) return cb(err)
  //         cb(null, {id: result})
  //       })
  //     } else {
  //       return cb(err,resp);
  //     }
  //   });
  // },

  // listTeams(cb){
  //   _authenticateAdmin()
  //   api.orgs.getTeams({
  //     org: org
  //   },cb)
  // },

  getTeamId(repo, teamName, cb){
    api.repos.getTeams({
      user: org,
      repo: repo
    }, function(err,resp){
      if (err) return cb(err);
      var team = _.find(resp, function(team){
        if (team.name === teamName)
          return true
      });
      if (team)
        cb(null,team.id);
      else
        cb("failed to find team", teamName)
    })
  },

  getRepo(user, owner, repo, cb){
    setToken(user)
    api.repos.get({
      user: owner,
      repo: repo
    }, cb)
  },


  // deleteTeam(teamId, cb){
  //    _authenticateAdmin()
  //    api.orgs.deleteTeam({
  //      id: teamId
  //    });
  // },

  getScopes(user, cb){
    setToken(user)
    api.user.get({}, (e, r) => {
      if (e) return verboseErrorCB(cb, e, 'checkScopes', `${user.social.gh.username}`)
      cb(null, { github: r.meta['x-oauth-scopes'].split(/,\W*/) })
    })
  },


  // getStats(owner, repo, user, retryCount, cb){
  //   var retries = 5
  //   if (!retryCount)
  //     retryCount = 0
  //   _authenticateAdmin()
  //   api.repos.getStatsContributors({
  //     user: owner,
  //     repo: repo
  //   }, (err, res)=>{
  //     if (err) return verboseErrorCB(cb, err, 'getStats', `${org} ${repo}`)
  //     if (res.meta.status === "202 Accepted" && retryCount < retries){
  //       setTimeout(()=>{
  //         this.getStats(owner, repo, user, ++retryCount, cb)
  //       }, 2000)
  //     } else if (res.meta.status === "202 Accepted" && retryCount >= retries) {
  //       cb(Error(`Stil no stats after ${retries} tries`))
  //     } else{
  //       var trimmedResults = _.map(res, function(contributor){
  //         return {
  //           author: contributor.author.login,
  //           total: contributor.total,
  //           weeks: contributor.weeks
  //         }
  //       })
  //       cb(err, trimmedResults)
  //     }
  //   })
  // },

  //only 90 days of data supported or 300 events
  //see GitHub Docs https://developer.github.com/v3/activity/events/

  // repoEvents(owner, repo, cb){
  //   _authenticateAdmin()
  //   var allEvents = []

  //   api.events.getFromRepo({
  //     user: owner,
  //     repo: repo,
  //   }, function(err,resp){
  //     if (err) return cb(err)
  //     fetchRemainingPages(resp, function(err,resp){
  //       if (err) return cb(err)
  //       cb(null, allEvents)
  //     })
  //   })

  //   function fetchRemainingPages(resp, cb){
  //     allEvents = allEvents.concat(resp)
  //     if (api.hasNextPage(resp)){
  //       api.getNextPage(resp, function(err, resp){
  //         if (err) return cb(err)
  //         fetchRemainingPages(resp, cb)
  //       })
  //     } else {
  //       cb(null, null)
  //     }
  //   }
  // },

  // getCommits(repo, cb){
  //   _authenticateAdmin()
  //   api.repos.getCommits({
  //     user: org,
  //     repo: repo
  //   }, cb)
  // },

  addContributor(user, org, repo, cb) {
    setToken(user)

    // $log(`addContributor ${repo} ${reviewerTeamId}`, repo)
    // this.addToTeam(user.social.gh.username, reviewerTeamId, user, function(err, result){
      // if (err) return verboseErrorCB(cb, err, 'addToTeam', `${user.social.gh.username} ${reviewerTeamId}`)
  // fork(repo, user, cb){
  //   _authenticateUser(user)
    api.repos.fork({ user: org, repo}, (e,r) => {
      if (e) return verboseErrorCB(cb, e, 'addContributor', `${repo} ${user.email} ${user.id}`)
      if (logging) $log(`Forked     ${org}${repo} to ${user.social.gh.username}`.yellow)
      cb(e, r)
    })
  // },
    // })
  },


  getFile(user, repoOwner, repo, path, branch, cb) {
    setToken(user)
    // $log('getFile', user.social.gh, repoOwner, repo, path, branch)
    api.repos.getContent({ user: repoOwner, repo, path, ref: branch }, (e, r) => {
      if (e) $log('getFile.getContent.e'.red, e)

      //-- check the case where repos have been deleted manually
      if (e!=null && e.code == 404)
      {
        api.repos.get({ user: repoOwner, repo }, function(err,response) {
          if (err && err.code === 404)
            return cb(Error(`No repo found at ${repoOwner}/${repo}?`)) // <a href='/posts/fork/${post._id}'>Create new fork?</a>
          else if (!err)
            return cb(Error(`${path} of repo ${repoOwner}/${repo} missing or corrupted`))
          else
            return cb(err)
        })
      }
      else {
        if (r) {
          r.string = new Buffer(r.content, 'base64').toString('utf8')
          cb(e, r)
        } else
          verboseErrorCB(cb, e, 'getFile', `${repoOwner}/${repo} ${path}:${branch}`)
      }
    })
  },


  updateFile(user, repoOwner, repo, path, branch, content, message, cb) {
    setToken(user)
    branch = branch || 'master'
    var fileData = { user: repoOwner, repo, path, branch, ref: branch }

    api.repos.getContent(fileData, (e, file) => {
      if (e) return cb(e)
      api.repos.updateFile(_.extend(fileData, { message,
        sha: file.sha,
        content: new Buffer(content).toString('base64')
      }), cb)
    })
  },


  addFile(user, repoOwner, repo, path, branch, content, message, cb) {
    setToken(user)
    branch = branch || 'master'
    api.repos.createFile({
      user: repoOwner, repo, path, message, branch,
      content: new Buffer(content).toString('base64')
    }, function(e, result) {
      if (!e) return cb(null,result)
      var parsedError = JSON.parse(e.message);
      if (/Missing required keys.*sha/.test(parsedError.message)){
        return cb("file already exists", null)
      }
      cb(e,result)
    });
  },


  //create a team w/ write access to a repo (name after repo)
  createRepoTeam(user, org, repo, name, permission, cb) {
    setToken(user)
    api.orgs.createTeam({ org, name, permission, repo_names: [`${org}/${repo}`]}, (e, r) => {
      if (!e) return cb(null, r.id)
      var parsedError = JSON.parse(e.message)
      var errors = parsedError.errors
      if (errors && errors.length == 1 && errors[0].code === "already_exists"){
        //team is already created, list teams and send that back
        gh.getTeamId(repo, name, function(err, result) {
          if (err) return cb(err)
          cb(null, result)
        })
      } else
        return cb(e, r)
    })
  },


  addAndConfirmTeamMember(user, org, teamId, githubUser, cb) {
    setToken('admin')
    //first invite the user
    api.orgs.addTeamMembership({id: teamId, user: githubUser.username}, function(e,r) {
      if (e) return cb(e)
      setToken(user)
      //then accept the invite
      api.user.editOrganizationMembership({ org, state: 'active' }, cb)
    })
  },


  createOrgRepo(user, org, name, description, isPrivate, cb) {
    setToken(user)
    api.repos.createFromOrg({ org, name, description, private: isPrivate }, cb)
  },


  createBranch(user, org, repo, branchName, offCommit, cb) {
    setToken(user)
    var {sha} = offCommit
    api.gitdata.createReference({ user: org, repo, sha, ref: `refs/heads/${branchName}` }, cb)
  },


  setupPostRepo(user, repoName, org, postId, postMD, readmeMD, cb) {
    var url = `https://github.com/${org}/${repoName}`
    var fullRepoName = `${org}/${repoName}`
    var authorTeamName = `${repoName}-${postId.toString().slice(-8)}-author`
    var authorGH = getGithubUser(user)
    if (!authorGH) return verboseErrorCB(cb, Error('User not github authenticated'), 'setupPostRepo', user._id)

    if (logging) $log(`Setting   repo ${fullRepoName} for ${authorGH.username}`.yellow)
    gh.createOrgRepo('admin', org, repoName, "", false, (e1, repo) => {
      if (e1) return verboseErrorCB(cb, e1, 'setupPostRepo.createRepo', fullRepoName)
      if (logging) $log(`Created   ${fullRepoName} for ${authorGH.username}`.yellow)
        gh.addFile('admin', org, repoName, "README.md", "master", readmeMD, "Add README.md", (e2, readme) => {
          if (e2 && e2 === "file already exists")
            $log(`README.md already exists on repo ${fullRepoName}`.magenta)
          else if (e2) return verboseErrorCB(cb, e2, 'setupPostRepo.addFile', `${repoName} README.md`)

          if (logging) $log(`Added     README.md ${fullRepoName}`.yellow)
          gh.createBranch('admin', org, repoName, 'edit', readme.commit, (e9, branchRef) => {})

          gh.createRepoTeam('admin', org, repoName, authorTeamName, 'push', (e3, authorTeamId) => {
            if (e3) return verboseErrorCB(cb, e3, 'setupPostRepo.createRepoTeam', `${repoName}:${authorTeamName} author team`)
            if (logging) $log(`Created   team ${authorTeamName} ${authorTeamId}`.yellow)
            gh.addAndConfirmTeamMember(user, org, authorTeamId, authorGH, (e4, result) => {
              if (e4) return verboseErrorCB(cb, e4, 'addAndConfirmTeamMember', `${fullRepoName} author team ${authorTeamId} ${authorGH.username}`)
              if (logging) $log(`Confirmed  ${authorGH.username} as team member of ${authorTeamName}`.yellow)
              gh.addFile(user, org, repoName, "post.md", "edit", postMD, "Initial Commit", (e5, post) => {
                var repoInfo = { url, authorTeamId, authorTeamName, author: authorGH.username }
                if (e5) {
                  if (e5 === "file already exists")
                    return gh.updateFile(user, org, repoName, "post.md", post.md, "Reinitialize", (e6, post) => {
                      if (e6) return verboseErrorCB(cb, e6, 'updateFile [reinitialize]', `${repoName} post.md`)
                      cb(null, { authorTeamId, owner:githubOwner, url, author: authorGH.username })
                    })
                  else
                    return verboseErrorCB(cb, e5, 'setupPostRepo.addFile', `${repoName} post.md`)
                }
                if (logging) $log(`Added     post.md to ${fullRepoName}`.yellow)
                cb(null, repoInfo)
              })
            })
          })
        })
    })
  }
}

module.exports = gh
