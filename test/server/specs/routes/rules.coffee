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
        PAGE '/core/CHANGELOG.txt', @optsExpect, (txt3) =>
          DONE()

  IT 'Source files', ->
    PAGE '/.editorconfig', @optsExpect, (txt1) =>
      PAGE '/example.gitignore', @optsExpect, (txt2) =>
        PAGE '/.gitattributes', @optsExpect, (txt3) =>
          DONE()

  IT 'Bad guesses', ->
    PAGE '/search', @optsExpect, (txt1) =>
      PAGE '/search?site=&ie=UTF-8&q=Yuri+Kochiyama&oi=ddle&ct=yuri-kochiyamas-95th-birthday-5723472594468864-hp&hl=en&sa=X&ved=0ahUKEwil6qbk4ebMAhUBVj4KHX2qCVIQPQgD', @optsExpect, (txt2) =>
        DONE()



ban = ->

  IT 'INSTANT BAN', ->
    SUBMIT '/', {}, {status:500,contentType:/text/}, (txt) ->
      expect(txt).to.equal('')
      PAGE '/', {status:500,contentType:/text/}, (txt) ->
        expect(txt).to.equal('')
        DONE()

  SKIP 'NO SESSION GENERATED FOR ABUSE REQUEST', ->
# 2016-05-31T20:18:31.562886+00:00 app[web.1]: GET 134.249.131.0    5ynsvb17lMGb abuse < other         /administrator  <<< https://www.airpair.com/administrator Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36


DESCRIBE("501", notImp)
DESCRIBE("410", gone)
DESCRIBE("418", bait)
DESCRIBE("500", ban)
