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

  addToTeam(githubUser, teamId, user, cb){
    _authenticateAdmin();
    api.orgs.addTeamMembership({
      id: teamId,
      user: githubUser
    }, function(err,res){
      _authenticateUser(user)
      api.user.editOrganizationMembership({
        "org": org,
        "state": 'active'
      }, function(err, response){
        if (err) return cb(err)
        cb(null, response)
      })
    })
  },

  addContributor(user, repo, reviewerTeamId, cb){
    var _this = this;
    this.addToTeam(user.social.gh.username, reviewerTeamId, user, function(err, result){
      if (err) return cb(err)
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
      if (err) return cb(err)
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
    //TODO should be authenticating with user, not our account
    api.repos.fork({
      user: org,
      repo: repo
    }, cb)
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
    //TODO uncomment once invites are properly working
    // if (user)
    //   _authenticateUser(user)
    // else
    //   _authenticateAdmin()
    _authenticateAdmin()
    api.repos.createFile({
      user: org,
      repo: repo,
      path: path,
      message: msg,
      content: new Buffer(content).toString('base64')
    }, cb);
  },

  updateFile(repo, path, content, msg, cb){
    this.getFile(repo, path, function(err, result){
      if (err) return cb(err)
      // console.log("RESULT", result)
      //TODO should use user's account
      _authenticateAdmin()
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
    api.repos.getStatsCommitActivity({
      user: org,
      repo: repo
    }, function(err, res){
      cb(err, res)
    })
  },

  getFile(repo, path, cb){
    api.repos.getContent({
      user: org,
      repo: repo,
      path: path
    }, function (err, resp){
      resp.string = new Buffer(resp.content, 'base64').toString('utf8');
      cb(err, resp)
    })
  },

  //TODO add readme string as parameter
  setupRepo(repo, githubOwner, postContents, user, cb){
    // console.log(`setting up repo ${repo} for ${githubOwner}`)
    var _this = this
    this.createRepo(repo, function(err, result){
      //TODO Better error handling
      //without a timeout repo is often not found immediately after creation
      //should figure out a better way to handle this...
      if (err) return cb(err)
      var githubUrl = result.url

      setTimeout(function(){
        _this.addFile(repo, "README.md", "Please read me", "Add README.md", null, function(err, result){
          if (err) return cb(err)
          _this.createRepoReviewTeam(repo, function(err, result){
            if (err) return cb(err)
            var reviewTeamId = result.id
            _this.createRepoAuthorTeam(repo, function(err, result){
              if (err) return cb(err)
              var authorTeamId = result.id
              _this.addToTeam(githubOwner, authorTeamId, user, function(err, result){
                if (err) return cb(err)
                _this.addFile(repo, "post.md", postContents, "Initial Commit", user, function(err, result){
                  if (err) return cb(err)
                  cb(null, {reviewTeamId, authorTeamId, githubOwner, githubUrl, author: user.social.gh.username})
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
