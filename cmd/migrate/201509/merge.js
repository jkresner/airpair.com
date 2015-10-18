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
    return A.bookmarks || B.bookmarks //-- too lazy to merge
  },
  tags() {
    return A.tags || B.tags //-- too lazy to merge
  },
  name(override) {
    var val = override
    if (!A.name && !B.name)
      val = A.linked.gp.name || B.linked.gp.name
    else if (A.name == B.name)
      val = A.name
    else {
      // $log('name'.magenta, override, A.name, B.name)
      if (!val) throw Error(`override.name required when gp different for A[${A.name}] and B[${B.name}]`)
    }

    if (verbose) $log('user.name'.blue, val)
    return val
  },
  emails(linked) {
    var val = { emails: A.emails||[] }

    if (!A.emailVerified && B.emailVerified)
      $log(`WARN: Sure you want ${A.email}(no verified) vs ${B.email}(verified)?`.white)

    val.email = A.email.toLowerCase()
    val.emailVerified = A.emailVerified || false
    if (!val.emailVerified && _.get(linked, 'gp.verified_email') && A.email == linked.gp.email)
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
  siteNotifications() {
    return A.siteNotifications || B.siteNotifications //-- too lazy to merge
  },
  bio() {
    if (verbose) $log('user.bio'.blue, A.bio || B.bio)
    return A.bio || B.bio //-- too lazy to merge
  },
  location() {
    return { location: A.location||B.location, localization: A.localization||B.localization }
  },
  linked(override) {
    if (!A.linked || !B.linked) return A.linked || B.linked

    var val = {}

    if (either('linked.password',A,B))
      val.password = either('linked.password',A,B)

    if (either('linked.bb',A,B))
      val.bb = !both('linked.bb',A,B) ? either('linked.bb',A,B) :
        (_.get(B.linked,'bb.token.attributes.refreshToken') ? B.linked.bb : A.linked.bb)

    if (either('linked.in',A,B))
      val.in = !both('linked.in',A,B) ? either('linked.in',A,B) :
        (_.get(B,'linked.in.token.attributes.tokenSecret') ? B.linked.in : A.linked.in)

    if (either('linked.so',A,B))
      val.so = !both('linked.so',A,B) ? either('linked.so',A,B) :
        (B.linked.so.reputation > A.linked.so.reputation ? A.linked.so : B.linked.so)

    if (either('linked.tw',A,B))
      val.tw = !both('linked.tw',A,B) ? either('linked.tw',A,B) :
        (B.linked.tw.followers_count > A.linked.tw.followers_count ? B.linked.tw : A.linked.tw)

    if (either('linked.sl',A,B))
      val.sl = !both('linked.sl',A,B) ? either('linked.sl',A,B) : A.linked.sl

    if (either('linked.gh',A,B))
      val.gh = !both('linked.gh',A,B) ? either('linked.gh',A,B) :
        (B.linked.gh.updated_at > A.linked.gh.updated_at ? B.linked.gh : A.linked.gh)

    if (either('linked.al',A,B))
      val.al = !both('linked.al',A,B) ? either('linked.al',A,B) :
        (B.linked.al.followers_count > A.linked.al.followers_count ? B.linked.al : A.linked.al)

    if (either('linked.gp',A,B) && !both('linked.gp',A,B)) val.gp = either('linked.gp',A,B)
    else if (both('linked.gp',A,B)) {
      if (!_.has(override||{},'gp.email'))
        throw Error(`override.gp.email required when gp different for A[${A.linked.gp.email}] and B[${B.linked.gp.email}]`)
      val.gp = B.linked.gp.email == override.gp.email ? B.linked.gp : A.linked.gp
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

  if (either('cohort',A,B))              M.cohort = resolve.cohort(M._id)
  if (either('bookmarks',A,B))           M.bookmarks = resolve.bookmarks()
  if (either('tags',A,B))                M.tags = resolve.tags()
  if (either('username',A,B))            M.username = resolve.username(Overrides.username)
  if (either('siteNotifications',A,B))   M.siteNotifications = resolve.siteNotifications()
  if (either('initials',A,B))            M.initials = resolve.initials(Overrides.initials)
  if (either('bio',A,B))                 M.bio = resolve.bio()
  if (either('location',A,B))            Object.assign(M, resolve.location())
  if (either('linked',A,B))              M.linked = resolve.linked(Overrides.linked)
  if (either('primaryPayMethodId',A,B))  M.primaryPayMethodId = resolve.primaryPayMethodId()
  Object.assign(M, resolve.emails(M.linked))
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
    ops.push(Payouts.updateMany({'lines.info.expert._id': removed.expert._id }, { $set: {'lines.$.info.expert._id': merged.expert._id}} ))
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
  if (A.linked.gh && B.linked.gh)
    expect(A.linked.gh.id).to.equal(B.linked.gh.id)

  for (var attr in A)
    expect(['emails','meta'].concat(fields.user.known).indexOf(attr), `A.unknown user field ${attr}`).not.equal(-1)
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
