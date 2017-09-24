module.exports = ->


  DESCRIBE '.meta => .log', ->

    IT "rename {model}.meta => {model}.log", ->
      @timeout(40000)
      asyncs = ["Users","Posts","Experts"].map (n) =>
        (cb) ->
          r = {}
          r[n] = {}
          col = global[n]
          $rename = {"meta.activity":"meta.history","meta.lastTouch":"meta.last"}
          q = {"meta.activity":{$exists:true},"meta.lastTouch":{$exists:true}}
          col.updateMany q, {$rename}, (e, r0) =>
            if e then cb(e)
            else
              r[n][JSON.stringify($rename)] = {modified:r0.modifiedCount}
              $rename = {"meta":"log"}
              q = {"meta":{$exists:true}}
              col.updateMany q, {$rename}, (e, r1) =>
                if e then cb(e)
                else
                  r[n][JSON.stringify($rename)] = {modified:r1.modifiedCount}
                  cb(null, r)

      WHEN asyncs, (r) ->
        for set in r
          for mod of set
            for op of set[mod]
              {modified} = set[mod][op]
              console.log("[#{modified}]".green+"#{mod}\t", op)
        DONE()



  DESCRIBE 'Templates', ->

    IT "Remove old => add new", ->
      Templates.remove {}, (e, r) ->
        bulkOps = []
        for key of FIXTURE.templates
          if key.indexOf('dep_') != 0
            bulkOps.push({ insertOne: FIXTURE.templates[key] })
        Templates.bulkWrite bulkOps, (e2, r2) ->
          expect(e2).to.be.null
          expect(r2.insertedCount).to.equal(bulkOps.length)
          DONE()



  DESCRIBE 'Redirects', ->

    IT "Remove /author/* => /software-experts route", ->
      Redirects.remove {_id:ObjectId("574d2509c6c20809714a4ebd")}, (e, r) ->
        DONE()

    IT "/img/software/*  [301] =>  static.airpair.com/img/software/*", ->
      to = "https://static.airpair.com/img/software/"
      Redirects.insert {type:'rewrite',url:"/img/software/*",to}, {}, (e, r1) ->
        expect(r1.insertedCount).to.equal(1)
        Redirects.update {_id:ObjectId("574d2649c6c20809714a4ec3")},{$set:{to}}, {}, (e, r2) ->
          expect(r2.result.nModified).to.equal(1)
          DONE()




