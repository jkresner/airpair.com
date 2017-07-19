const Views = {
  anon:       'authenticated sessionID',
  session:     config.middleware.session.authdData,
  full:        '_id name avatar username ' +
               'photos emails ' +
               'location initials bio cohort.engagement ' +
               'auth.gh.login auth.so.link auth.bb.username auth.in.id auth.tw.screen_name auth.al.angellist_url auth.gp.id auth.gp.link auth.gp.url auth.gp.email auth.sl.username' +
               'tags primaryPayMethodId emailVerified '
}

const Opts = {
  existing:    { select: `_id auth name email emails photos ` },
  full:        { select: Views.full }
}

module.exports = { Views, Opts,

  Projections: ({gravatar}, {view}) => ({

    session: view.session,

    full: r => {
      if (!r._id && r.sessionID) return r
      r.email = (_.find(r.emails, em => em.primary)||{}).value
      if (!r.email) r.email = r.emails[0].value
      r.avatar = (r.photos ? r.photos[0].value : gravatar(r.email)).split('?')[0]
      return view.full(r)
    }

  })

}
