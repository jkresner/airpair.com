var logging = true
var maxRetries = 4


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
  gh.api.authenticate({ type: "oauth", token })
}

var getGithubUser = function(user) {
  if (user.social && user.social.gh && user.social.gh.username && user.social.gh.token.token)
    return { username: user.social.gh.username, token: user.social.gh.token.token }
}

var wrap = (fn, fnName) => {

  var fnWithAuth = function () {
    var user = arguments[0]
    var cb = arguments[arguments.length-1]
    cb.retries = maxRetries
    arguments[arguments.length-1] = (e,r) => {
      cb.retries = cb.retries - 1
      if (cb.retries > 0 && e &&
        (e.message.toLowerCase().indexOf("not found") != -1 ||
         e.message.toLowerCase().indexOf("repository is empty") != -1
        )) {
        $log(`gh.${fnName} retry not found`, cb.retries, e)
        return _.delay(fnWrapped, 1000)
      }
      if (cb.retries < 3)
        $log(`gh.${fnName}.cb.retries`, cb.retries)
      cb(e,r)
    }

    var fnWrapped = () => {
      setToken(user)
      arguments[arguments.length-1].retries = cb.retries
      fn.apply(this, arguments)
    }
    fnWrapped()
  }

  return fnWithAuth
}



function getTeamId(org, teamName, cb)
{
  //-- TODO, this doesn't page and it NEEDS to
  gh.api.orgs.getTeams({ org, per_page: 100}, (e,resp) => {
    if (e) return verboseErrorCB(cb, e, 'getTeamId.getTeams', `${org} ${user.social.gh.username}`)
    var team = _.find(resp, (team) => team.name == teamName)
    if (team)
      cb(null,team.id);
    else
      cb("failed to find team", teamName)
  })
}

function addAndConfirmTeamMember(user, org, teamId, githubUser, cb) {
  setToken('admin')
  //first invite the user
  gh.api.orgs.addTeamMembership({id: teamId, user: githubUser.username}, function(e,r) {
    if (e) return cb(e)
    setToken(user)
    //then accept the invite
    gh.api.user.editOrganizationMembership({ org, state: 'active' }, cb)
    //make the org public on their profile
    _.delay(() => {
      gh.api.orgs.publicizeMembership({ org, user: githubUser.username }, () => {
        $log(`${githubUser.username} membership publicized`)}, 1500)
    })
  })
}

function init() {
  var GitHubApi = global.API_GITHUB || require("github")
  gh.api = new GitHubApi({
    version: "3.0.0",
    protocol: "https",
    timeout: 5000,
    headers: { "user-agent": "AirPair" }
    // debug: true,
  })
}

//-- Contains only functions we want to wrap and expose to module exports
var gh = {

  getScopes(user, cb){
    gh.api.user.get({}, (e, r) => {
      if (e && e.message.indexOf('Bad credentials') != -1)
        e = Error("GitHub token auth failed")
      if (e) return verboseErrorCB(cb, e, 'checkScopes', `${user.social.gh.username}`)
      cb(null, { github: r.meta['x-oauth-scopes'].split(/,\W*/) })
    })
  },

  checkRepo(user, owner, repo, cb){
    gh.api.repos.get({
      user: owner,
      repo: repo
    }, (e,r) => {
      if (r) cb(null, { unavailable: `Try another name. A repo at {owner}/${repo} already exists.` })
      else if (e.code == 404) cb(null, { available: `The repo name ${repo} is available.` })
      else cb(e)
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

  getPullRequests(user, owner, repo, cb) {
    gh.api.pullRequests.getAll({ user: owner, repo, state: 'all', per_page: 100 }, (e,r) => {
      if (e) return verboseErrorCB(cb, e, 'getPullRequests', `${owner}/${repo} ${user.email} ${user.id}`)
      if (r && r.meta) delete r.meta
      cb(e, r)
    })
  },

  addContributor(user, org, repo, cb) {
    gh.api.repos.fork({ user: org, repo }, (e,r) => {
      if (e) return verboseErrorCB(cb, e, 'fork', `${repo} ${user.email} ${user.id}`)
      if (logging) $log(`Forked     ${org}${repo} to ${user.social.gh.username}`.yellow)
      cb(e, r)
    })
  },

  getFile(user, repoOwner, repo, path, branch, cb) {
    gh.api.repos.getContent({ user: repoOwner, repo, path, ref: branch }, (e, file) => {
      if (e && cb.retries > 0) return verboseErrorCB(cb, e, 'getFile', `${repoOwner}/${repo} ${path}:${branch}`)

      //-- check the case where repos have been deleted manually (repo doesn't exist)
      else if (e && e.code == 404)
      {
        if (logging) $log(`getFile.getContent.404`.red, `${repoOwner}/${repo}/${path}:${branch}`, e)
        gh.api.repos.get({ user: repoOwner, repo }, function(err,response) {
          if (logging) $log('getFile.getRepo'.red, err, response)
          if (err && err.code === 404)
            return cb(Error(`No repo at ${repoOwner}/${repo}?`)) // <a href='/posts/fork/${post._id}'>Create new fork?</a>
          else if (err)
            return cb(err)
          else
            return cb(Error(`${path} on "edit" branch of repo ${repoOwner}/${repo} missing or corrupted.`))
        })
      }
      else if (e) {
        verboseErrorCB(cb, e, 'getFile', `${repoOwner}/${repo} ${path}:${branch}`)
      } else {
        file.string = new Buffer(file.content, 'base64').toString('utf8')
        cb(null, file)
      }
    })
  },


  updateFile(user, repoOwner, repo, path, branch, content, message, cb) {
    branch = branch || 'master'
    var fileData = { user: repoOwner, repo, path, branch, ref: branch }

    gh.api.repos.getContent(fileData, (e, file) => {
      if (e) return cb(e)
      gh.api.repos.updateFile(_.extend(fileData, { message,
        sha: file.sha,
        content: new Buffer(content).toString('base64')
      }), cb)
    })
  },


  addFile(user, repoOwner, repo, path, branch, content, message, cb) {
    branch = branch || 'master'
    gh.api.repos.createFile({
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
    gh.api.orgs.createTeam({ org, name, permission, repo_names: [`${org}/${repo}`]}, (e, r) => {
      if (!e) return cb(null, r.id)
      var parsedError = JSON.parse(e.message)
      var errors = parsedError.errors
      if (errors && errors.length == 1 && errors[0].code === "already_exists"){
        //team is already created, list teams and send that back
        gh.api.getTeamId(org, name, function(err, result) {
          if (err) return cb(err)
          cb(null, result)
        })
      } else
        return cb(e, r)
    })
  },


  createOrgRepo(user, org, name, description, isPrivate, cb) {
    gh.api.repos.createFromOrg({ org, name, description, private: isPrivate }, cb)
  },


  createBranch(user, org, repo, branchName, offCommit, cb) {
    var {sha} = offCommit
    gh.api.gitdata.createReference({ user: org, repo, sha, ref: `refs/heads/${branchName}` }, cb)
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
          gh.createBranch('admin', org, repoName, 'edit', readme.commit, (e9, branchRef) => {
            if (logging) $log(`branched   edit  ${org}/${repoName}`.yellow)

            gh.createRepoTeam('admin', org, repoName, authorTeamName, 'push', (e3, authorTeamId) => {
              if (e3) return verboseErrorCB(cb, e3, 'setupPostRepo.createRepoTeam', `${repoName}:${authorTeamName} author team`)
              if (logging) $log(`Created   team ${authorTeamName} ${authorTeamId}`.yellow)
              addAndConfirmTeamMember(user, org, authorTeamId, authorGH, (e4, result) => {
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

    })
  }
}

var wrapper = _.wrapFnList(gh, wrap)
wrapper.init = init
module.exports = wrapper

// Migrating old private posts
// git checkout -b edit
// git push origin edit
// git checkout master
// rm post.md
// git add .
// git commit -m 'Migrating post to open source repo'
// git push origin master


