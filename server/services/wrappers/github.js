var GitHubApi = require("github");

var accessToken = '91889a94f9898088ccf4b762fb31eb2a070151a2';
var reviewerTeamId = '1263797';
//var org = "airpair"
var org = "JustASimpleTestOrg";

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
    token: accessToken
  });
}

var github = {
  createRepo(repo, cb) {
    _authenticateAdmin();
    api.repos.createFromOrg({
      name: repo,
      org: org,
      description: "Mike's Test Repo"
    }, cb)
  },

  //create a team w/ write access to a repo (name after repo)
  createRepoTeam(repo, cb){
    _authenticateAdmin()
    api.orgs.createTeam({
      org: org,
      name: repo,
      repo_names: [`${org}/${repo}`],
      permission: 'push'
    }, cb);
  },

  listTeams(cb){
    _authenticateAdmin()
    api.orgs.getTeams({
      org: org
    },cb)
  },

  //grant user write access
  addToRepoTeam(user, teamId, cb){
    //TODO get github username from user object
    var githubUser = "rissem"
    _authenticateAdmin();
    api.orgs.addTeamMembership({
      id: teamId,
      user: githubUser
    }, cb)
  },

  addReviewerTeamToRepo(repo, cb){
    _authenticateAdmin()
    api.orgs.addTeamRepo({
      id: reviewerTeamId,
      user: org,
      repo: repo
    }, cb)
  },

  addUserToReviewerTeam(username, cb){
    _authenticateAdmin()
    api.orgs.addTeamMembership({
      id: reviewerTeamId,
      user: username
    })
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

  }
}

module.exports = github
