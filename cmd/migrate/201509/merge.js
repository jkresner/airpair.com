var verbose = false


var either = (prop, a, b) => {
  return _.get(a,prop) || _.get(b,prop)
}
var both = (prop, a, b) => {
  return _.get(a,prop) && _.get(b,prop)
}

var first = (prop, reverse, a, b) => {
  var valA = _.get(a,prop)
  var valB = _.get(b,prop)
  if (!valA) return valB
  if (!valB) return valA

  if (reverse)
    return valA > valB ? valA : valB
  else
    return valA < valB ? valA : valB
}


var _resolve = (A, B) => ({
  cohort(_id) {
    var val
    if (!A.cohort || !B.cohort)
      val = A.cohort || B.cohort
    else
      val = {
        engagement: { visit_signup : idToDate(_id),
          visit_first : first('cohort.engagement.visit_first',false,A,B) },
        aliases: _.union(A.cohort.aliases||[],B.cohort.aliases||[]),
        firstRequest: _.get(A,'cohort.firstRequest') || _.get(B,'cohort.firstRequest')
      }
    if (verbose) $log('user.cohort'.blue, val)
    return val
  },
  bookmarks() {
    return either('legacy.bookmarks',A,B) //-- too lazy to merge
  },
  tags() {
    return either('legacy.tags',A,B) //-- too lazy to merge
  },
  siteNotifications() {
    return either('legacy.siteNotifications',A,B) //-- too lazy to merge
  },
  name(override) {
    var val = override
    if (!A.name && !B.name)
      val = A.auth.gp.name || B.auth.gp.name
    else if (A.name == B.name)
      val = A.name
    else {
      // $log('name'.magenta, override, A.name, B.name)
      if (!val) throw Error(`override.name required when gp different for A[${A.name}] and B[${B.name}]`)
    }

    if (verbose) $log('user.name'.blue, val)
    return val
  },
  emails(auth) {
    var val = { emails: A.emails||[] }

    if (!A.emailVerified && B.emailVerified)
      $log(`WARN: Sure you want ${A.email}(no verified) vs ${B.email}(verified)?`.white)

    val.email = A.email.toLowerCase()
    val.emailVerified = A.emailVerified || false
    if (!val.emailVerified && _.get(auth, 'gp.verified_email') && A.email == auth.gp.email)
      val.emailVerified = true

    if ( !_.find(val.emails, em => em.value.toLowerCase() == A.email ) )
      val.emails.push({value:A.email,primary:true,verified:val.emailVerified})

    if ( !_.find(val.emails, em => em.value.toLowerCase() == B.email ) )
      val.emails.push({value:B.email,verified:B.emailVerified||false})

    if (verbose) $log('user.emails'.blue, val)
    return val
  },
  username(override) {
    var val = override
    if (both('username',A,B)) {
      if (A.username.toLowerCase() == B.username.toLowerCase())
        val = A.username.toLowerCase()
      else if (!val)
        throw Error(`override.username required when username exists for A[${A.username}] and B[${B.username}]`)
    }
    else if (A.username || B.username)
      val = A.username || B.username
    if (verbose) $log('user.username'.blue, val)
    return val.toLowerCase()
  },
  initials(override) {
    var val = override
    if (A.initials && B.initials) {
      if (A.initials.toLowerCase() ==  B.initials.toLowerCase())
        val = A.initials
      else if (!override)
        throw Error(`override.initials required when initials different for A[${A.initials}] and B[${B.initials}]`)
    }
    else
      val = A.initials || B.initials
    if (verbose) $log('user.initials'.blue, val)
    return val.toLowerCase()
  },
  bio() {
    if (verbose) $log('user.bio'.blue, A.bio || B.bio)
    return A.bio || B.bio //-- too lazy to merge
  },
  location() {
    return { location: A.location||B.location, raw: A.raw||B.raw }
  },
  auth(override) {
    if (!A.auth || !B.auth) return A.auth || B.auth

    var val = {}

    if (either('auth.password',A,B))
      val.password = either('auth.password',A,B)

    if (either('auth.bb',A,B))
      val.bb = !both('auth.bb',A,B) ? either('auth.bb',A,B) :
        (_.get(B.auth,'bb.token.attributes.refreshToken') ? B.auth.bb : A.auth.bb)

    if (either('auth.in',A,B))
      val.in = !both('auth.in',A,B) ? either('auth.in',A,B) :
        (_.get(B,'auth.in.token.attributes.tokenSecret') ? B.auth.in : A.auth.in)

    if (either('auth.so',A,B))
      val.so = !both('auth.so',A,B) ? either('auth.so',A,B) :
        (B.auth.so.reputation > A.auth.so.reputation ? A.auth.so : B.auth.so)

    if (either('auth.tw',A,B))
      val.tw = !both('auth.tw',A,B) ? either('auth.tw',A,B) :
        (B.auth.tw.followers_count > A.auth.tw.followers_count ? B.auth.tw : A.auth.tw)

    if (either('auth.sl',A,B))
      val.sl = !both('auth.sl',A,B) ? either('auth.sl',A,B) : A.auth.sl

    if (either('auth.gh',A,B))
      val.gh = !both('auth.gh',A,B) ? either('auth.gh',A,B) :
        (B.auth.gh.updated_at > A.auth.gh.updated_at ? B.auth.gh : A.auth.gh)

    if (either('auth.al',A,B))
      val.al = !both('auth.al',A,B) ? either('auth.al',A,B) :
        (B.auth.al.followers_count > A.auth.al.followers_count ? B.auth.al : A.auth.al)

    if (either('auth.gp',A,B) && !both('auth.gp',A,B)) val.gp = either('auth.gp',A,B)
    else if (both('auth.gp',A,B)) {
      if (!_.has(override||{},'gp.email'))
        throw Error(`override.gp.email required when gp different for A[${A.auth.gp.email}] and B[${B.auth.gp.email}]`)
      val.gp = B.auth.gp.email == override.gp.email ? B.auth.gp : A.auth.gp
    }

    return val
  },
  primaryPayMethodId() {
    var val
    if (both('primaryPayMethodId',A,B))
      val = first('primaryPayMethodId',true,A,B)
    else
      val = either('primaryPayMethodId',A,B)

   if (verbose) $log('user.primaryPayMethodId'.blue, val)
    return val
  }
})


var mergeUserDocs = (e, MERGE, A, B, Overrides, done) => {
  var resolve = _resolve(A,B)
  if (e) return done(e)

  var M = {} // Merged
  var R = {} // Removed

  if (verbose) $log('\n\nMERGE.users'.blue, A._id, B._id, Overrides)

  //-- Choose the older _id
  M._id = A._id < B._id ? A._id : B._id
  R._id = A._id > B._id ? A._id : B._id
  $log('user._id'.blue, M._id, 'created', idToMoment(M._id,'YYMMDD'))

  if (either('legacy',A,B))                     M.legacy = {}
  if (either('legacy.bookmarks',A,B))           M.legacy.bookmarks = resolve.bookmarks()
  if (either('legacy.tags',A,B))                M.legacy.tags = resolve.tags()
  if (either('legacy.siteNotifications',A,B))   M.legacy.siteNotifications = resolve.siteNotifications()

  if (either('cohort',A,B))              M.cohort = resolve.cohort(M._id)
  if (either('username',A,B))            M.username = resolve.username(Overrides.username)
  if (either('initials',A,B))            M.initials = resolve.initials(Overrides.initials)
  if (either('bio',A,B))                 M.bio = resolve.bio()
  if (either('location',A,B))            Object.assign(M, resolve.location())
  if (either('auth',A,B))              M.auth = resolve.auth(Overrides.auth)
  if (either('primaryPayMethodId',A,B))  M.primaryPayMethodId = resolve.primaryPayMethodId()
  Object.assign(M, resolve.emails(M.auth))
  M.name = resolve.name(Overrides.name)
  M.meta = { activity: [{_id: new ObjectId(), by: {name:'jk'}, action: `merged:[${R._id}]`}] }

  Object.assign(MERGE.merged, { user: M })
  Object.assign(MERGE.removed, { user: R })

  done(e, MERGE)
}


var mergeExpertDocs = (A, B) =>
  (e, MERGE, AE, BE, Overrides, done) => {
    if (e) return done(e)

    var M = {} // Merged
    var R = {} // Removed
    //-- Choose the older _id
    M._id = AE._id < BE._id ? AE._id : BE._id
    R._id = AE._id > BE._id ? AE._id : BE._id

    //-- More recent
    var ARecent = _.max(AE.activity||[],a=>a._id)
    var BRecent = _.max(BE.activity||[],a=>a._id)
    var moreRecent = ARecent && BRecent
      ? (ARecent._id > BRecent ? AE : BE)
      : (ARecent ? AE : BE)

    if (verbose) $log('expert._id'.blue, M._id, 'created', idToMoment(M._id,'YYMMDD'))
    if (verbose) $log('moreRecent._id'.blue, moreRecent._id)

    if (either('availability', AE, BE))
      M.availability = moreRecent.availability || either('availability', AE, BE)
    if (either('brief', AE, BE))
      M.brief = moreRecent.brief || either('brief', AE, BE)
    if (either('rate', AE, BE))
      M.rate = moreRecent.rate || either('rate', AE, BE)
    if (either('tags', AE, BE))
      M.tags = moreRecent.tags || either('tags', AE, BE)
    if (either('gmail', AE, BE))
      M.gmail = moreRecent.gmail || either('gmail', AE, BE)
    if (either('activity', AE, BE))
      M.activity = _.union(AE.activity||[],BE.activity||[])

    Object.assign(MERGE.merged, { expert: M })
    Object.assign(MERGE.removed, { expert: R })
    if (verbose) $log('Merge::EXPERT::'.cyan, e, MERGE, '\n\n')
    mergeUserDocs(e, MERGE, A, B, Overrides, done)
  }


var save = (e, MERGE, done) => {
  if (verbose) $log('MERGE:::'.cyan, e, MERGE, '\n\n')
  if (e) return done(e)

  var {merged,removed} = MERGE
  var ops = []

  //-- todo, search for other userId nested with expert copies
  if (removed.expert) {
    ops.push(Experts.remove({_id: removed.expert._id }))
    ops.push(Requests.updateMany({'suggested.expert._id': removed.expert._id }, { $set: {'suggested.$.expert._id': merged.expert._id}} ))
    ops.push(Bookings.updateMany({'expertId': removed.expert._id }, { $set: {'expertId': merged.expert._id}} ))
    ops.push(Payouts.updateMany({'lines.info.expert._id': removed.expert._id }, { $set: {'lines.$.info.expert._id': merged.expert._id}} ))
    ops.push(Orders.updateMany({'lines.info.expert._id': removed.expert._id }, { $set: {'lines.$.info.expert._id': merged.expert._id}} ))
    ops.push(Experts.update({ _id: merged.expert._id }, _.extend(merged.expert,{userId:merged.user._id}) ))
  }

  if (merged.expert)
    ops.push(Experts.updateMany({ userId: removed.user._id }, { $set: { userId: merged.user._id }}))

  ops.push(Bookings.updateMany({customerId: removed.user._id }, { $set: { customerId: merged.user._id }}))
  ops.push(Bookings.updateMany({'participants.info._id': removed.user._id }, { $set: {'participants.$.info._id': merged.user._id}} ))
  ops.push(Orders.updateMany({userId: removed.user._id }, { $set: { userId: merged.user._id }}))
  ops.push(Requests.updateMany({userId: removed.user._id }, { $set: { userId: merged.user._id }}))
  ops.push(Paymethods.updateMany({userId: removed.user._id }, { $set: { userId: merged.user._id }}))
  ops.push(Payouts.updateMany({userId: removed.user._id }, { $set: { userId: merged.user._id }}))
  ops.push(Posts.updateMany({'by._id': removed.user._id }, { $set: { 'by._id': merged.user._id }}))
  ops.push(Users.remove({ _id: removed.user._id }))
  ops.push(Users.update({ _id: merged.user._id }, merged.user ))

  Promise.all(ops)
    .then((vals) => {
      MERGE.ops = vals.map( v => ({result:v.result}) )
      if (verbose) $log('MERGED\n'.green, MERGE.merged, '\nremoved'.magenta, MERGE.removed, '\n', 'ops'.yellow, MERGE.ops, '\n\n\n') // MERGED.ops)
      try {
        done(null, MERGE)
      } catch (e) {
        DONE(e)
      }

    }, DONE)
}


module.exports = function(userA, userB, overrides, done) {

  var A = userA
  var B = userB
  var MERGE = { merged: {}, removed: {} }

  if (!A || !B) return done(null, { merged: {}, replay: A || B })

  var cb = (e, MERGE) => save(e, MERGE, done)

  expect(A.email, JSON.stringify(A) + ` != `.grey + JSON.stringify(B) ).not.equal(B.email)
  expect(A._id).not.equal(B._id)
  if (A.auth.gh && B.auth.gh)
    expect(A.auth.gh.id).to.equal(B.auth.gh.id)

  for (var attr in A)
    expect(['emails','meta'].concat(fields.user.known).indexOf(attr), `A[${A._id}].unknown user field ${attr}`).not.equal(-1)
  for (var attr in B)
    expect(fields.user.known.indexOf(attr), `B.unknown user field ${attr}`).not.equal(-1)

  Experts.find(inQuery([A._id,B._id],'userId')).toArray((e, r) => {
    if (e) return done(e)
    expect(r.length < 3, `${r.length}] expert profiles is invalid`).to.be.true
    if (verbose) console.log("experts.length".blue, r.length)
    if (r.length == 0) mergeUserDocs(null, MERGE, A, B, overrides, cb)
    if (r.length == 2) mergeExpertDocs(A, B)(null, MERGE, r[0], r[1], overrides, cb)
    if (r.length == 1) {
      Object.assign(MERGE.merged, { expert: r[0] })
      mergeUserDocs(null, MERGE, A, B, overrides, cb)
    }
  })

}
