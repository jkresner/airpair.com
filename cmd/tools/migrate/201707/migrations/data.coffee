checkName =

module.exports = ->

  specInit(@)

  DESCRIBE 'Templates', ->

    IT "Templates", ->
      Templates.remove {}, (e, r) ->
        bulkOps = []
        for t of FIXTURE.templates
          bulkOps.push({ insertOne: FIXTURE.templates[t] })
        Templates.bulkWrite bulkOps, (e2, r2) ->
          expect(e2).to.be.null
          $log('r', r)
          DONE()


  DESCRIBE 'Redirects', ->

    # before (done) ->

    IT "Remove /author/* => /software-experts route", ->
      Redirects.remove {_id:ObjectId("574d2509c6c20809714a4ebd")}, (e, r) ->
        DONE()


    IT "/img/software/*  [301] =>  static.airpair.com/img/software/*", ->
      expect(false).to.be.true


