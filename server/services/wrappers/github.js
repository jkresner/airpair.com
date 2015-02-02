var GitHubApi = require("github");

//this token must belong to an owner of the organization
var adminAccessToken = config.auth.github.adminAccessToken
//var org = "airpair"
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
      name: repo,
      org: org,
      description: "Mike's Test Repo"
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

  //grant user write access
  addToTeam(githubUser, teamId, cb){
    _authenticateAdmin();
    api.orgs.addTeamMembership({
      id: teamId,
      user: githubUser
    }, cb)
  },

  deleteTeam(teamId, cb){
     _authenticateAdmin()
     api.orgs.deleteTeam({
       id: teamId
     });
  },

  fork(repo, cb){
    _authenticateAdmin()
    //TODO should be authenticating with user, not our acocunt
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

  addFile(repo, path, content, msg, cb){
    _authenticateAdmin()
    api.repos.createFile({
      user: org,
      repo: repo,
      path: path,
      message: msg,
      content: new Buffer(content).toString('base64')
    }, cb);
  },

  setupRepo(repo, githubOwner, cb){
    // console.log(`setting up repo ${repo} for ${githubOwner}`)
    var _this = this
    this.createRepo(repo, function(err, result){
      //TODO Better error handling

      if (err){console.error("ERR", err); return}
      _this.addFile(repo, "README.md", "Please read me", "Add README.md", function(err, result){
        if (err){console.error("ERR", err); return}
        _this.addFile(repo, "post.md", "Your Post Here", "Initial Post", function(err, result){
          if (err){console.error("ERR", err); return}
          _this.createRepoReviewTeam(repo, function(err, result){
            if (err){console.error("ERR", err); return}
            var reviewTeamId = result.id
            _this.createRepoAuthorTeam(repo, function(err, result){
              if (err){
                console.error("ERR", err); return
              } else  {
                var authorTeamId = result.id
                _this.addToTeam(githubOwner, authorTeamId, function(err, result){
                  cb(null, {reviewTeamId})
                })
              }
            })
          })
        })
      })
    })
  }
}

module.exports = github
