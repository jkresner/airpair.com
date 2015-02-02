var GitHubApi = require("github");

//this token must belong to an owner of the organization
var adminAccessToken = config.auth.github.adminAccessToken
//var org = "airpair"
var org = config.auth.github.org

var api = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: true,
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
  createRepoWriteTeam(repo, cb){
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: repo,
      repo_names: [`${org}/${repo}-author`],
      permission: 'push'
    }, cb);
  },

  createRepoReviewTeam(repo, cb){
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: repo,
      repo_names: [`${org}/${repo}-review`],
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
      user: "rissem",
      org: org
    }, cb)
  },

  addCustomREADME(cb){

  },

  setupRepo(repo, githubOwner, cb){
    console.log(`creating repo ${repo} for ${githubOwner}`)
    this.createRepo(repo, function(err, result){
      cb(err, result)
    })
  }
}

module.exports = github
