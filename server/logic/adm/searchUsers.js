module.exports = (DAL, {Opts,Project}, DRY) => ({
  
  
  exec(searchTerm, done) {
    User.searchByRegex(searchTerm, Opts.userSearch.search, 
      Opts.userSearch, done)
  },


  project: Project.session


})

