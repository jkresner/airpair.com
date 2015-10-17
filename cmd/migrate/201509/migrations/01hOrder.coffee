
fixesUserIds = ->
  query = 'company.contacts.userId':{$exists:1}, lineItems: {$size:1}

  Orders.find(query, {userId:1,company:1,'lineItems.suggestion.expert':1}).toArray (e, all) ->
    ups = []
    for o in all
      expect(o.userId, "no userId #{o._id}").to.exist
      expect(o.lineItems.length, "more than one line #{o._id}").to.equal(1)
      # $log(o.lineItems[0].suggestion)
      expect(o.company.contacts[0].userId, "no contact userId #{o._id}").to.exist
      contactUserId = o.company.contacts[0].userId.toString()
      orderUserId = o.userId.toString()
      if contactUserId != orderUserId && !ORDER.byStaff[orderUserId]?
        expect(o.lineItems[0].suggestion.expert, "no suggested expert #{o._id}").to.exist
        expert = o.lineItems[0].suggestion.expert
        if expert._id? && expert.userId.toString() == orderUserId
          ups.push updateOne: { q: {_id:o._id}, u: { $set: {userId:ObjectId(contactUserId)} }, upsert: false }
        else
          $log('Got an unknown Order.userId blooper'.red, o)

    if ups.length == 0 then return DONE()
    Orders.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.ORDER.expertUserIdBlooper'.yellow, r.modifiedCount)
      DONE()



migratesOlderOrders = ->

  Orders.find({by:{$exists:0}}, {userId:1,company:1}).toArray (e, all) ->
    ups = []
    for o in all
      expect(o.userId, "expecting userId exists for order #{o._id}").to.exist
      expect(o.userId.constructor == ObjectId, "expecting userId is ObjectId for order #{o._id}").to.be.true
      expect(o.company, "expecting order without by had company").to.exist
      expect(o.company.contacts[0], "expecting at least one contact for #{o._id}").to.exist

      contactUserId = o.company.contacts[0].userId
      if contactUserId?
        expect(contactUserId.constructor == String, "Expecting contact.userId to be String").to.be.true

      reqBy =
        _id: ObjectId((contactUserId||o.userId).toString())
        avatar: o.company.contacts[0].pic
        name: o.company.contacts[0].fullName
        email: o.company.contacts[0].email
        org: { name: o.company.name, _id: o.company._id }

      if contactUserId && contactUserId == reqBy._id.toString()
        # $log('settings.by._id to company.contacts[0].userId'.cyan, o.company.contacts[0].userId)
      else if o.userId.toString() == reqBy._id.toString()
        $log("#{idToMoment(o._id,'YY.MM')} [#{o._id}] set by._id to userId [#{o.userId}]".blue, o.company.contacts[0].fullName)
      else
        $log("setting by._id to something else".red, o.company.contacts[0])

      ups.push( updateOne: { q: {_id:o._id}, u: { $set: {by:reqBy} }, upsert: false } )

    if ups.length == 0 then return DONE()
    Orders.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.ORDER.by'.yellow, r.modifiedCount)
      DONE()


removesCreditOrders = ->
  Orders.find({total:0,profit:0,lineItems:{$size:1}}, {userId:1,lineItems:1}).toArray (e, all) ->
    toRemove = []
    for o in all
      if o.lineItems[0].type is 'credit'
        if o.lineItems[0].info.remaining isnt 0
          if idToMoment(o._id).isBefore(moment().add(-3,'month'))
            toRemove.push o._id
            # $log("o[#{o._id}::#{idToMoment(o._id,'YYYY.MM')}]".yellow, o.lineItems[0].info)
        # else
          # $log("o[#{o._id}]".green, o.lineItems[0].balance)
    if toRemove.length is 0 then return DONE()
    Orders.remove inQuery(toRemove), (e, r) ->
      $log('delete.ORDER.expiredCredit'.yellow, r.result)
      DONE()


unsets = ->
  attrs = ['__v','company','marketingTags','utm','utc']
  $unset = {}
  $unset[attr] = 1 for attr in attrs
  $log('unset.ORDER.attrs'.cyan, attrs.join(','))
  Orders.updateMany {}, {$unset}, ->
    DONE()



orderRenameAttrs = ->
  rename = renameModelAttr('Orders')
  rename 'lineItems', 'lines', false, ->
    DONE()



fixesInfoExpertObjectIds = ->
  ups = []
  query = 'lines.info.expert':{$exists:1}
  Orders.find(query, {_id:1,lines:1}).toArray (e, all) ->
    ups = []
    for o in all
      for l in o.lines
        if l.info.expert?
          expect(l.info.expert._id, "info.expert._id does not exist for [#{o._id}]").to.exist
          newExpert = _id: ObjectId(l.info.expert._id.toString()), name: l.info.expert.name, avatar: l.info.expert.avatar
          l.info.expert = newExpert
          ups.push( updateOne: { q: {_id:o._id}, u: { $set: {lines:o.lines} }, upsert: false } )
    if ups.length is 0 then return DONE()
    Orders.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.ORDER.lines.info.expert'.yellow, r.modifiedCount)
      DONE()


module.exports = ->

  specInit(@)

  describe 'Migrating order fields'.white.bold, ->

    IT "No v0 orders with userId of expert", fixesUserIds
    IT "Removes credit orders older than 3 months", removesCreditOrders
    IT "Company replaced with by", migratesOlderOrders
    IT "Can unset undesired attrs", unsets
    # IT "Renames fields", orderRenameAttrs
    # IT "Fixes v1 expert ObjectIds", fixesInfoExpertObjectIds




