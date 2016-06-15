
module.exports = ->

  before (done) ->
    done()


  IT "Remove", ->
    @timeout(10000)
    ids = [
      "575efde09a15a31100e0608e",
# "575ef19f9a15a31100e05be5",
    # "",
    ].map((id)=>ObjectId(id))

    q = meta: {$exists:0}
    # q['_id'] = $in: ids
    q['data.msg'] = new RegExp('Could not find request\[561d6335990a161100671956\]')

    # DB.Collections.issues.find(q).toArray (e, r) =>
      # $log 'find'.white, JSON.stringify(q).gray, if e then e else r

    DB.Collections.issues.remove q, (e, r) =>
      $log('del'.red, JSON.stringify(q).gray, if e then e else r.result)
      DONE()




  SKIP "Archive", ->
    @timeout(10000)
    ids = [
      "575f0dcd9a15a31100e0670c",
    # "575f04499a15a31100e0636b",
    # "575eeab29a15a31100e0592e",
    # "575eee129a15a31100e05a87",
    # "575ef5d49a15a31100e05d7f",
    # "575ef8919a15a31100e05eac",
    # ""
    ].map((id)=>ObjectId(id))

    # q = ip: "60.234.84.192",
    q = meta: {$exists:0}
    q._id = $in: ids


    meta = lastTouch = action:   'archive',  _id: ObjectId()
    DB.Collections.issues.update q, $set:{meta}, {multi:true}, (e, r) =>
      $log('up'.white, JSON.stringify(q).gray, if e then e else r.result) # update.modified)
      # for i in issues
        # $log("#{i._id} #{idToDate(i._id)}".yellow, i.meta) # , i)
      DONE()




