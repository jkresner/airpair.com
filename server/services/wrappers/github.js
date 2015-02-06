var GitHubApi = require("github");

var adminAccessToken = config.auth.github.adminAccessToken
var org = config.auth.github.org

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
});

var verboseErrorCB = (cb, err, fn, dataString) => {
  $log('github.error'.red, fn.white, dataString, err)
  cb(err)
}

var _authenticateAdmin = function(){
  api.authenticate({
    type: "oauth",
    token: adminAccessToken
  });
}

var _authenticateUser = function(user){
  api.authenticate({
    type: "oauth",
    token: user.social.gh.token.token
  })
}

var github = {
  isAuthed(user) {
    if (user.social && user.social.gh && user.social.gh.username &&
      user.social.gh.token.token){
      return true
    } else {
      return false
    }
  },

  createRepo(repo, cb) {
    _authenticateAdmin();
    api.repos.createFromOrg({
      private: config.auth.github.privateRepos,
      name: repo,
      org: org,
      description: ""
    }, cb)
  },

  //create a team w/ write access to a repo (name after repo)
  createRepoAuthorTeam(repo, cb){
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: `${repo}-author`,
      repo_names: [`${org}/${repo}`],
      permission: 'push'
    }, cb);
  },

  createRepoReviewTeam(repo, cb){
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: `${repo}-review`,
      repo_names: [`${org}/${repo}`],
      permission: 'pull'
    }, cb);
  },

  listTeams(cb){
    _authenticateAdmin()
    api.orgs.getTeams({
      org: org
    },cb)
  },

  getRepo(repoName, cb){
    _authenticateAdmin()
    api.repos.one({
      org: org,
      id: repoName
    },cb)
  },

  addToTeam(githubUser, teamId, user, cb){
    _authenticateAdmin();
    api.orgs.addTeamMembership({
      id: teamId,
      user: githubUser
    }, function(err,res){
      if (err) return verboseErrorCB(cb, err, 'addTeamMembership', `${githubUser} ${teamId}`)
      _authenticateUser(user)
      api.user.editOrganizationMembership({
        "org": org,
        "state": 'active'
      }, function(err, response){
        if (err) return verboseErrorCB(cb, err, 'editOrganizationMembership', `${githubUser} ${org}`)
        cb(null, response)
      })
    })
  },

  addContributor(user, repo, reviewerTeamId, cb){
    var _this = this;
    $log(`addContributor ${repo} ${reviewerTeamId}`, repo)
    this.addToTeam(user.social.gh.username, reviewerTeamId, user, function(err, result){
      if (err) return verboseErrorCB(cb, err, 'addToTeam', `${user.social.gh.username} ${reviewerTeamId}`)
      _this.fork(repo, user, cb)
    })
  },

  getReviewRepos(user, cb){
    _authenticateUser(user)

    //TODO handle pagination
    //will show all repos which it belongs to
    api.repos.getFromOrg({
      per_page: 100,
      org: org,
      type: "member" // [all,member or public]
    }, function(err, res){
      if (err) return verboseErrorCB(cb, err, 'getFromOrg', `${user.social.gh.username} ${org}`)
      cb(null, _.map(res, function(repo){
        return repo.name
      }))
    })
  },

  deleteTeam(teamId, cb){
     _authenticateAdmin()
     api.orgs.deleteTeam({
       id: teamId
     });
  },

  fork(repo, user, cb){
    _authenticateUser(user)
    api.repos.fork({
      user: org,
      repo: repo
    }, (err,r)=>{
      if (err) return verboseErrorCB(cb, err, 'addToTeam', `${repo} ${user.email} ${user.id}`)
      cb(err, r)
    })
  },

  //return events across all repos
  events(cb){
    _authenticateAdmin()
    api.events.getFromUserOrg({
      user: config.auth.github.username,
      org: org
    }, cb)
  },

  addFile(repo, path, content, msg, user, cb){
    if (user)
      _authenticateUser(user)
    else
      _authenticateAdmin()
    api.repos.createFile({
      user: org,
      repo: repo,
      path: path,
      message: msg,
      content: new Buffer(content).toString('base64')
    }, cb);
  },

  updateFile(repo, path, content, msg, user, cb){
    this.getFile(repo, path, function(err, result){
      if (err) return verboseErrorCB(cb, err, 'updateFile', `${user.social.gh.username} ${repo} ${path}`)
      _authenticateUser(user)
      api.repos.updateFile({
        sha: result.sha,
        user: org,
        repo: repo,
        path: path,
        message: msg,
        content: new Buffer(content).toString('base64')
      }, cb)
    })
  },

  //NOT WORKING, only returns meta info
  getStats(repo, cb){
    _authenticateAdmin()
    api.repos.getStatsCommitActivity({
      user: org,
      repo: repo
    }, function(err, res){
      if (err) return verboseErrorCB(cb, err, 'getStats', `${org} ${repo}`)
      cb(err, res)
    })
  },

  //TODO needs to work with user auth as well as admin
  getFile(repo, path, cb){
    _authenticateAdmin()
    api.repos.getContent({
      user: org,
      repo: repo,
      path: path
    }, function (err, resp){
      if (err) return verboseErrorCB(cb, err, 'getFile', `${repo} ${path}`)
      resp.string = new Buffer(resp.content, 'base64').toString('utf8');
      cb(err, resp)
    })
  },

  getCommits(repo, cb){
    _authenticateAdmin()
    api.repos.getCommits({
      user: org,
      repo: repo
    }, cb)
  },

  setupPostRepo(repo, githubOwner, postMD, readmeMD, user, cb){
    // console.log(`setting up repo ${repo} for ${githubOwner}`)
    var _this = this
    this.createRepo(repo, function(err, result){
      //TODO Better error handling
      //without a timeout repo is often not found immediately after creation
      //should figure out a better way to handle this...
      if (err) return verboseErrorCB(cb, err, 'createRepo', `${repo} ${githubOwner}`)
      var githubUrl = result.url

      setTimeout(function(){
        _this.addFile(repo, "README.md", readmeMD, "Add README.md", null, function(err, result){
          if (err) return verboseErrorCB(cb, err, 'addFile', `${repo} README.md`)
          _this.createRepoReviewTeam(repo, function(err, result){
            if (err) return verboseErrorCB(cb, err, 'createRepoReviewTeam', `${repo} review team`)
            var reviewTeamId = result.id
            _this.createRepoAuthorTeam(repo, function(err, result){
              if (err) return verboseErrorCB(cb, err, 'createRepoAuthorTeam', `${repo} author team`)
              var authorTeamId = result.id
              _this.addToTeam(githubOwner, authorTeamId, user, function(err, result){
                if (err) return verboseErrorCB(cb, err, 'addToTeam', `${repo} author team ${authorTeamId}`)
                _this.addFile(repo, "post.md", postMD, "Initial Commit", user, function(err, result){
                  if (err) return verboseErrorCB(cb, err, 'addFile', `${repo} post.md`)
                  cb(null, {reviewTeamId, authorTeamId, owner:githubOwner, url:githubUrl, author: user.social.gh.username})
                })
              })
            })
          })
        })
      }, 2000)
    })
  }
}

module.exports = github
