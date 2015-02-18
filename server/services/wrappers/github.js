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
  createRepoAuthorTeam(repo, id, cb){
    var _this = this;
    var teamName = `${repo}-${id.toString().slice(-8)}-author`
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: teamName,
      repo_names: [`${org}/${repo}`],
      permission: 'push'
    }, function(err, resp){
      if (!err) return cb(err,resp);
      var parsedError = JSON.parse(err.message)
      var errors = parsedError.errors
      if (errors && errors.length == 1 && errors[0].code === "already_exists"){
        //team is already created, list teams and send that back
        _this.getTeamId(repo, teamName, function(err, result){
          if (err) return cb(err)
          cb(null, {id: result})
        })
      } else {
        return cb(err,resp);
      }
    });
  },

  createRepoReviewTeam(repo, id, cb){
    var _this = this;
    var teamName = `${repo}-${id.toString().slice(-8)}-review`

    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: teamName,
      repo_names: [`${org}/${repo}`],
      description: `Review team for ${repo} (read-only)`,
      permission: 'pull'
    }, function(err, resp){
      if (!err) return cb(err,resp);
      var parsedError = JSON.parse(err.message)
      var errors = parsedError.errors
      if (errors && errors.length == 1 && errors[0].code === "already_exists"){
        //team is already created, list teams and send that back
        _this.getTeamId(repo, teamName, function(err, result){
          if (err) return cb(err)
          cb(null, {id: result})
        })
      } else {
        return cb(err,resp);
      }
    });
  },

  listTeams(cb){
    _authenticateAdmin()
    api.orgs.getTeams({
      org: org
    },cb)
  },

  getTeamId(repo, teamName, cb){
    _authenticateAdmin()
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

  getRepo(owner, repo, cb){
    _authenticateAdmin()
    api.repos.get({
      user: owner,
      repo: repo
    }, function(err, response){
      if (err) return verboseErrorCB(cb, err, 'getRepo')
      cb(err, response)
    })
  },

  addToTeam(githubUser, teamId, user, cb){
    _authenticateAdmin();
    //first invite the user
    api.orgs.addTeamMembership({
      id: teamId,
      user: githubUser
    }, function(err,res){
      if (err) return verboseErrorCB(cb, err, 'addTeamMembership', `${githubUser} ${teamId}`)
      _authenticateUser(user)
      //then accept the invite
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
    // $log(`addContributor ${repo} ${reviewerTeamId}`, repo)
    this.addToTeam(user.social.gh.username, reviewerTeamId, user, function(err, result){
      if (err) return verboseErrorCB(cb, err, 'addToTeam', `${user.social.gh.username} ${reviewerTeamId}`)
      _this.fork(repo, user, cb)
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

  getScopes(user, cb){
    _authenticateUser(user)
    api.user.get({}, function(err, result){
      if (err) return verboseErrorCB(cb, err, 'checkScopes', `${user.social.gh.username}`)
      cb(null, result.meta['x-oauth-scopes'].split(/,\W*/))
    })
  },

  addFile(owner, repo, path, content, msg, user, cb){
    if (user)
      _authenticateUser(user)
    else
      _authenticateAdmin()

    api.repos.createFile({
      user: owner,
      repo: repo,
      path: path,
      message: msg,
      content: new Buffer(content).toString('base64')
    }, function(err, result){
      if (!err) return cb(err,result)
      var parsedError = JSON.parse(err.message);
      if (/Missing required keys.*sha/.test(parsedError.message)){
        return cb("file already exists", null)
      }
      cb(err,result)
    });
  },

  updateFile(owner, repo, path, content, msg, user, cb){
    this.getFile(owner, repo, path, user, function(err, result){
      if (err) return verboseErrorCB(cb, err, 'updateFile/getFile', `${user.social.gh.username} ${repo} ${path}`)
      _authenticateUser(user)
      api.repos.updateFile({
        sha: result.sha,
        user: owner,
        repo: repo,
        path: path,
        message: msg,
        content: new Buffer(content).toString('base64')
      }, cb)
    })
  },

  getStats(owner, repo, user, retryCount, cb){
    var retries = 5
    if (!retryCount)
      retryCount = 0
    _authenticateAdmin()
    api.repos.getStatsContributors({
      user: owner,
      repo: repo
    }, (err, res)=>{
      if (err) return verboseErrorCB(cb, err, 'getStats', `${org} ${repo}`)
      if (res.meta.status === "202 Accepted" && retryCount < retries){
        setTimeout(()=>{
          this.getStats(owner, repo, user, ++retryCount, cb)
        }, 2000)
      } else if (res.meta.status === "202 Accepted" && retryCount >= retries) {
        cb(Error(`Stil no stats after ${retries} tries`))
      } else{
        var trimmedResults = _.map(res, function(contributor){
          return {
            author: contributor.author.login,
            total: contributor.total,
            weeks: contributor.weeks
          }
        })
        cb(err, trimmedResults)
      }
    })
  },

  getFile(owner, repo, path, user, cb){
    if (!user){
      _authenticateAdmin()
    }
    else {
      _authenticateUser(user)
    }
    api.repos.getContent({
      user: owner,
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

  setupPostRepo(repo, githubOwner, post, readmeMD, user, cb){
    // console.log(`setting up repo ${repo} for ${githubOwner}`)
    var _this = this

    this.createRepo(repo, function(err, result){
      if (err){
        var parsedError = JSON.parse(err.message);
        var errors = parsedError.errors
        if (errors && errors.length == 1 && errors[0].message === "name already exists on this account")
          $log("repo already created");
        else
          return verboseErrorCB(cb, err, 'createRepo', `${repo} ${githubOwner}`)
      }
      var githubUrl = `https://github.com/${config.auth.github.org}/${repo}`

      setTimeout(function(){
        _this.addFile(org, repo, "README.md", readmeMD, "Add README.md", null, function(err, result){
          if (err && err === "file already exists")
            console.warn("README.md already exists on this repo")
          else if (err) return verboseErrorCB(cb, err, 'addFile', `${repo} README.md`)
          _this.createRepoReviewTeam(repo, post._id, function(err, result){
            if (err) return verboseErrorCB(cb, err, 'createRepoReviewTeam', `${repo} review team`)
            var reviewTeamId = result.id
            _this.createRepoAuthorTeam(repo, post._id, function(err, result){
              if (err) return verboseErrorCB(cb, err, 'createRepoAuthorTeam', `${repo} author team`)
              var authorTeamId = result.id
              _this.addToTeam(githubOwner, authorTeamId, user, function(err, result){
                if (err) return verboseErrorCB(cb, err, 'addToTeam', `${repo} author team ${authorTeamId}`)
                _this.addFile(org, repo, "post.md", post.md, "Initial Commit", user, function(err, result){
                  if (err && err === "file already exists"){
                    _this.updateFile(org, repo, "post.md", post.md, "Reinitialize", user, function(err,result){
                      if (err) return verboseErrorCB(cb, err, 'updateFile [reinitialize]', `${repo} post.md`)
                      cb(null, {reviewTeamId, authorTeamId, owner:githubOwner, url:githubUrl, author: user.social.gh.username})
                    })
                  } else {
                    if (err) return verboseErrorCB(cb, err, 'addFile', `${repo} post.md`)
                    cb(null, {reviewTeamId, authorTeamId, owner:githubOwner, url:githubUrl, author: user.social.gh.username})
                  }
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
