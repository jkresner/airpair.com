module.exports = () => {

  before(function(done) {
    let {jhoo,ahoo} = FIXTURE.users
    let remove = [ahoo,jhoo].map(u=>u.auth.gh.login)
    DB.removeDocs('View', {}, () => {})
    DB.removeDocs('User', {'auth.gh.login':{'$in':remove}}, (r) => {
      done()
    })
  })

  beforeEach(function(){
    UTIL.clearIP()
  })


  DESCRIBE("Google Analytics", ()=> require("./analytics/ga"))
  //DESCRIBE "Impressions",        -> require("./analytics/impressions")
  DESCRIBE("Views",            ()=> require("./analytics/views"))
  DESCRIBE("Aliases",          ()=>require("./analytics/aliases"))


}



