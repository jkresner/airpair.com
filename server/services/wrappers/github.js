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
      // private: true,
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

  conributedRepos(user){

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

  setupRepo(repo, githubOwner, postContents, cb){
    // console.log(`setting up repo ${repo} for ${githubOwner}`)
    var _this = this
    this.createRepo(repo, function(err, result){
      //TODO Better error handling
      //without a timeout repo is often not found immediately after creation
      //should figure out a better way to handle this...
      setTimeout(function(){
        if (err){console.error("ERR", err); return}
        _this.addFile(repo, "README.md", "Please read me", "Add README.md", function(err, result){
          if (err) return cb(e)
          _this.addFile(repo, "post.md", "Your Post Here", postContents, function(err, result){
            if (err) return cb(e)
            _this.createRepoReviewTeam(repo, function(err, result){
              if (err) return cb(e)
              var reviewTeamId = result.id
              _this.createRepoAuthorTeam(repo, function(err, result){
                if (err) return cb(e)
                var authorTeamId = result.id
                _this.addToTeam(githubOwner, authorTeamId, function(err, result){
                  if (err) return cb(e)
                  cb(null, {reviewTeamId})
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
