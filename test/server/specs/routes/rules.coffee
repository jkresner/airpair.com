notImp = ->

  IT '/rules.abe', ->
    PAGE @test.title, {status:501}, (txt) ->
      expect(txt).to.equal('')
      DONE()

gone = ->

  IT 'GONE URLS', ->
    optsExpect = {status:410,contentType:/text/}
    PAGE '/agile-software', optsExpect, (txt1) ->
      expect(txt1).to.equal('')
      PAGE '/conversion-rate-optimization', optsExpect, (txt2) ->
        PAGE '/graph-database', optsExpect, (txt3) ->
          PAGE '/jobs/05-14/airpair-evangelist', optsExpect, (txt4) ->
            PAGE '/jobs/07-07/advertising-specialist', optsExpect, (txt5) ->
              PAGE '/news/06-14/why-a-fresh-start-on-product', optsExpect, (txt6) ->
                PAGE '/news/airpairme-direct-access', { status:500 }, (txt7) ->
                  expect(txt7).to.equal('')
                  PAGE '/anythings', { status:500 }, (txt8) ->
                    DONE()

bait = ->

  IT 'BAIT URLS', ->
    optsExpect = {status:418,contentType:/text/}
    PAGE '/phpMyAdmin', optsExpect, (txt1) ->
      expect(txt1).to.equal('Relax. Close your eyes.')
      PAGE '/phpmyadmin', optsExpect, (txt2) ->
        PAGE '/wp-test/phpMyAdmin/gooodey', optsExpect, (txt3) ->
          PAGE '/readme.txt', optsExpect, (txt4) ->
            PAGE '/license.txt?tasdfas=234sdfsd', optsExpect, (txt5) ->
              PAGE '/jobs/05-14/airpair-evangasdfasdft', {status:404}, (txt6) ->
                PAGE '/jobs/07-07/advertising-specialist', {status:500}, (txt7) ->
                  DONE()



DESCRIBE("501", notImp)
DESCRIBE("410", gone)
DESCRIBE("418", bait)
