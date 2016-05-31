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

  before -> @optsExpect = {status:418,contentType:/text/}

  IT 'BAIT URLS', ->
    PAGE '/phpMyAdmin', @optsExpect, (txt1) =>
      expect(txt1).to.equal('Relax. Close your eyes.')
      PAGE '/phpmyadmin', @optsExpect, (txt2) =>
        PAGE '/wp-test/phpMyAdmin/gooodey', @optsExpect, (txt3) =>
          PAGE '/readme.txt', @optsExpect, (txt4) =>
            PAGE '/license.txt?tasdfas=234sdfsd', @optsExpect, (txt5) =>
              PAGE '/jobs/05-14/airpair-evangasdfasdft', {status:404}, (txt6) =>
                PAGE '/jobs/07-07/advertising-specialist', {status:500}, (txt7) =>
                  DONE()

  IT 'Asset URLS', ->
    PAGE '/fckeditor//editor/filemanager/browser/default/connectors/asp/connector.asp?Command=GetFolders&Type=File&CurrentFolder=%2F/', @optsExpect, (txt1) =>
      expect(txt1).to.equal('Relax. Close your eyes.')
      DONE()


  IT 'BAIT WILDCARDS', ->
    PAGE '/s3.amazonaws.com/kennyonetime/blob_new.png', @optsExpect, (txt1) =>
      PAGE '/s3.amazonaws.com/kennyonetime/blob_edit.png', @optsExpect, (txt2) =>
        PAGE '/assets/plugins/jquery-file-upload/server/php', @optsExpect, (txt3) =>
          DONE()


  IT 'Root WILDCARDS', ->
    PAGE '/so17/php', @optsExpect, (txt1) =>
      PAGE '/so19/node.js', @optsExpect, (txt2) =>
        PAGE '/bitrix/admin', @optsExpect, (txt3) =>
          PAGE '/administrator', @optsExpect, (txt4) =>
            PAGE '/blog//?q=user', @optsExpect, (txt5) =>
              PAGE '/feeds/posts/default', @optsExpect, (txt6) =>
                DONE()

  IT 'Ext WILDCARDS', ->
    PAGE '/index.xml', @optsExpect, (txt1) =>
      expect(txt1).to.equal('Relax. Close your eyes.')
      PAGE '/index.xml?test=yo', @optsExpect, (txt2) =>
        expect(txt2).to.equal('Relax. Close your eyes.')
        DONE()

ban = ->

  IT 'INSTANT BAN', ->
    SUBMIT '/', {}, {status:500,contentType:/text/}, (txt) ->
      expect(txt).to.equal('')
      PAGE '/', {status:500,contentType:/text/}, (txt) ->
        expect(txt).to.equal('')
        DONE()



DESCRIBE("501", notImp)
DESCRIBE("410", gone)
DESCRIBE("418", bait)
DESCRIBE("500", ban)
