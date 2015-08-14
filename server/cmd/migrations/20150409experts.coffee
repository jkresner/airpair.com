{getCohortProperties} = require('../../../server/services/users.cohort')
{ObjectId2Date} = util

healExpertCohort = (user, expert) ->
  # $log(user._id, expert._id)
  cohort=null
  if !user.cohort
    cohort = getCohortProperties(user,{firstRequest:{url:'/heal'},maillists:['AirPair Experts']})
  else
    cohort = user.cohort
    if (!cohort.engagement)
      cohort.engagement = {
        visits: [ ObjectId2Date(expert._id) ],
        visit_last: ObjectId2Date(expert._id),
        visit_signup: ObjectId2Date(user._id),
        visit_first: ObjectId2Date(user._id),
      }
    else
      if (!cohort.engagement.visit_first) then cohort.engagement.visit_first = ObjectId2Date(user._id)
      if (!cohort.engagement.visit_last) then cohort.engagement.visit_first = ObjectId2Date(user._id)
      if (!cohort.engagement.visit_signup) then cohort.engagement.visit_first = ObjectId2Date(user._id)
      if (!cohort.engagement.visits || cohort.engagement.visits.length == 0)
        cohort.engagement.visits = [ ObjectId2Date(expert._id) ]

    if (!cohort.maillist || cohort.maillist.length == 0)
      cohort.maillists = ["AirPair Newsletter","AirPair Experts"]

  if (!cohort.expert)
    cohort.expert =
      _id: expert._id
      applied: ObjectId2Date(expert._id)
  else
    if (!cohort.expert._id) then cohort.expert._id = expert._id
    if (!cohort.expert.applied) then cohort.expert.applied = ObjectId2Date(expert._id)

  return cohort

updated = 0

logUpdate = (user, cb) ->
  (e,r) ->
    updated++
    $log("Updated[#{updated}]: #{user._id}".green,e,r.result.n)
    if updated > 3956
      cb()

## Segments (1) Not logged in since Oct 31, 2014

# ===================== 2015.04.09
# Experts: 3955
# No name: 2367
# With name: 1046 (old), 542 (new)

expertUsers = {}
getExperts = (cb) ->
  Experts.find({rate:{$gt:0}},{_id:1,userId:1,rate:1}).toArray (e2, experts) ->
    for expert in experts
      expertUsers[expert.userId] = expert
    console.log('experts.length', experts.length)
    cb()

getUsers = (cb) ->
  Users.find({},{_id:1,cohort:1,name:1}).toArray (e1, users) ->
    # console.log('users.length', users.length)

    expCount = 0
    noname = 0
    withnameOld = 0
    withnameNew = 0
    nocohort = 0
    nocohortExp = 0
    cohortUpgrades = 0
    for u in users
      expert = expertUsers[u._id]
      if expert
        expCount++
        if !u.name
          noname++
          # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.google.displayName}")
        else
          if (!u.cohort)
            # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.name}".red)
            nocohort++
          else if (!u.cohort.expert)
            nocohortExp++

          if moment(ObjectId2Date(u._id)).isBefore(moment('Nov 01 2014'))
            # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.name}".blue)
            withnameOld++
          else
            # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.name}".gray)
            withnameNew++

        cohort = healExpertCohort(u, expert)
        expect(cohort).to.exist
        expect(cohort.engagement).to.exist
        expect(cohort.engagement.visit_first).to.exist
        expect(cohort.maillists.length > 1).to.be.true
        expect(_.contains(cohort.maillists,"AirPair Newsletter")).to.be.true
        expect(_.contains(cohort.maillists,"AirPair Experts")).to.be.true
        expect(cohort.expert).to.exist
        cohortUpgrades++
        Users.update({_id:u._id},{ $set: { cohort } }, logUpdate(u, cb))

    $log 'Experts:'.cyan, expCount, (withnameOld+withnameNew)
    $log 'nocohort'.white, nocohort
    $log 'noexpertcohort'.white, nocohortExp
    $log 'UPGRADES'.white, cohortUpgrades

    # noname = 0
    # gotcohort = 0
    # withnameOld = 0
    # withnameNew = 0
    # withnameEmailVerified = 0
    # withnameNotVerified = 0
    # # case 1 no cohort
    # for u in users
    #   if !u.cohort
    #     gotcohort++
    #     # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.google.displayName}")
    #   if !u.name
    #     noname++
    #     # $log("#{u._id} #{ObjectId2Date(u._id)} #{u.google.displayName}")
    #   else
    #     if (moment(ObjectId2Date(u._id)).isBefore(moment('Nov 01 2014')))
    #       $log("#{u._id} #{ObjectId2Date(u._id)} #{u.name}".blue)
    #       withnameOld++
    #     else
    #       $log("#{u._id} #{ObjectId2Date(u._id)} #{u.name}".gray)
    #       withnameNew++

    #     if (u.emailVerified)
    #       withnameEmailVerified++
    #     else
    #       withnameNotVerified++

    # $log('Got Cohort:'.cyan, gotcohort)
    $log('No name:'.cyan, noname)
    $log('With name old:'.cyan, withnameOld)
    $log('With name new:'.cyan, withnameNew)
    # $log('With name email verified:'.cyan, withnameEmailVerified)
    # $log('With name not verified:'.cyan, withnameNotVerified)



module.exports = (done) ->

  $log('migrating'.cyan, '20150409experts'.white)

  getExperts ->
    getUsers ->
      done()
