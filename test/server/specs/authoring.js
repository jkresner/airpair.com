module.exports = () => {

  before(function(done) {
    let {tiag,tmot,jkg,stpv} = FIXTURE.users
    DB.ensureDocs('User', [stpv,tiag,tmot,jkg], r =>
      done())
  })

  DESCRIBE("DRAFT",            () => require('./author/draft'))
  DESCRIBE("SUBMIT",           () => require('./author/submit'))
  DESCRIBE("SUBMITTED",        () => require('./author/submitted'))
  DESCRIBE("PUBLISH",          () => require('./author/publish'))
  DESCRIBE("PUBLISHED",        () => require('./author/published'))

}
