notImp = ->

  IT '/rules.abe', ->
    PAGE @test.title, {status:501}, (txt) ->
      expect(txt).to.equal('')
      DONE()

  IT '/browserconfig.xml', ->
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

  IT 'OLD WORDPRESS', ->
    optsExpect = {status:410,contentType:/text/}
    PAGE '/backbone-js/backbone-js-experts/page/3', optsExpect, (txt1) ->
      expect(txt1).to.equal('')
      DONE()

bait = ->

  before (done) ->
    @optsExpect = {status:418,contentType:/text/}
    DB.removeDocs 'session', {}, ->
      done()

  # afterEach (done) ->
  #   DB.docsByQuery 'session', {}, (ss) ->
  #     expect(ss.length).to.equal(0)
  #     done()


  SKIP 'BAIT URLS', ->
    # PAGE '/jobs/05-14/airpair-evangasdfasdft', {status:404}, (txt6) =>
      # DONE()


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
        PAGE '/blog//?q=user', @optsExpect, (txt5) =>
          PAGE '/feeds/posts/default', @optsExpect, (txt6) =>
            DONE()


  IT 'Old campaign links', ->
    PAGE '/l/python/python-expert-daniel-roseman?utm_source=stackoverflow&utm_medium=banner&utm_term=python&utm_content=daniel-roseman-top&utm_campaign=so09',  @optsExpect, (txt7) =>
      DONE()


  IT 'Bad guesses', ->
    PAGE '/search', @optsExpect, (txt1) =>
      PAGE '/search?site=&ie=UTF-8&q=Yuri+Kochiyama&oi=ddle&ct=yuri-kochiyamas-95th-birthday-5723472594468864-hp&hl=en&sa=X&ved=0ahUKEwil6qbk4ebMAhUBVj4KHX2qCVIQPQgD', @optsExpect, (txt2) =>
          DONE()

  SKIP 'Clashing with static dirs', ->
    # PAGE '/static/frontend/Magento/luma/en_US/Magento_Customer/css/source/_module.less', @optsExpect, (txt3) =>


optsBan = status:500, contentType:/text/
testBan = ({test}) =>
  PAGE test.title, optsBan, (txt1) =>
    PAGE '/', optsBan, (txt2) =>
      expect(txt1+txt2).to.equal('')
      DONE()

ban = ->

  beforeEach ->
    STUB.wrapper('Cloudflare').api('get').success('cloudflare_block_ip_ok')


  SKIP "GoooleWebsnippet https://developers.google.com/+/web/snippet/)", ->


  IT '+7 requests in 1 min', ->
    optsOK = {status:200,contentType:/html/}
    PAGE '/', optsOK, (html1) =>
      PAGE '/', optsOK, (html2) =>
        PAGE '/', optsOK, (html3) =>
          PAGE '/', optsOK, (html4) =>
            PAGE '/', optsOK, (html5) =>
              PAGE '/', optsOK, (html6) =>
                PAGE '/', optsOK, (html7) =>
                  # PAGE '/', optsBan, (txt8) =>
                  DONE()

  IT 'INSTANT http.POST BAN', ->
    SUBMIT '/', {}, optsBan, (txt1) =>
      expect(txt1).to.equal('')
      PAGE '/', optsBan, (txt2) =>
        expect(txt2).to.equal('')
        DONE()


  IT '/900x90.q2-1.ruby.png', -> testBan @
  IT '/index.xml', -> testBan @
  IT '/index.xml?test=yo', -> testBan @
  IT '/core/CHANGELOG.txt', -> testBan @
  IT '/.git', -> testBan @
  IT '/.editorconfig', -> testBan @
  IT '/example.gitignore', -> testBan @
  IT '/.gitattributes', -> testBan @
  IT '/phpMyAdmin', -> testBan @
  IT '/phpmyadmin', -> testBan @
  IT '/wp-test/phpMyAdmin/gooodey', -> testBan @
  IT '/license.txt?tasdfas=234sdfsd', -> testBan @
  IT '/_vti_bin/owssvr.dll?UL=1&ACT=4&BUILD=6606&STRMVER=4&CAPREQ=0', -> testBan @
  IT '/admin', -> testBan @
  IT '//admin/Cms_Wysiwyg', -> testBan @
  IT '//admin/Cms_Wysiwyg/directive/index', -> testBan @
  IT '/bitrix/admin', -> testBan @
  IT '/administrator', -> testBan @

  SKIP '/readme.txt', -> testBan @


DESCRIBE("501", notImp)
DESCRIBE("410", gone)
DESCRIBE("418", bait)
DESCRIBE("500", ban)
