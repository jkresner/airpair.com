var views = {
  full:   'authenticated sessionID _id avatar email emailVerified primaryPayMethodId name initials username bio tags cohort.engagement location' +
          'auth.gh.login auth.so.link auth.bb.username auth.in.id auth.tw.screen_name auth.al.angellist_url auth.gp.id auth.gp.link auth.gp.url auth.gp.email auth.sl.usernam',
}


module.exports = new LogicDataHelper(

  views,

  ({chain, select, inflate}) => ({

    full: r =>
      chain(select.full(r), inflate.tags)


  })

)
.addCacheInflate('tags', ['name','slug','short','desc'])
