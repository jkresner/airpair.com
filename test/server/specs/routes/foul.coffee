optsBait = status:418,contentType:/text/,ua:FIXTURE.http.UA.phone.SafariIPhone


DESCRIBE "[418] Bait", ->


  before (done) ->
    DB.removeDocs 'session', {}, ->
      done()

  afterEach (done) ->
    DB.docsByQuery 'session', {}, (ss) ->
      expect(ss.length).to.equal(0)
      done()


  IT 'Junk', ->
    PAGE '/fckeditor//editor/filemanager/browser/default/connectors/asp/connector.asp?Command=GetFolders&Type=File&CurrentFolder=%2F/', optsBait, (txt1) =>
      expect(txt1).to.equal('Relax. Close your eyes.')
      DONE()


  IT 'Asset URLS', ->
    PAGE '/s3.amazonaws.com/kennyonetime/blob_new.png', optsBait, (txt) =>
      PAGE '/s3.amazonaws.com/kennyonetime/blob_edit.png', optsBait, (txt) =>
        PAGE '/assets/plugins/jquery-file-upload/server/php', optsBait, (txt) =>
          DONE()


  it 'WILDCARDS', ->

  IT 'Root WILDCARDS', ->
        PAGE '/blog//?q=user', optsBait, (txt) =>
          PAGE '/feeds/posts/default', optsBait, (txt) =>
            DONE()


  IT 'Old campaigns', ->
    PAGE '/l/python/python-expert-daniel-roseman?utm_source=stackoverflow&utm_medium=banner&utm_term=python&utm_content=daniel-roseman-top&utm_campaign=so09', optsBait, (txt) =>
      PAGE '/so17/php', optsBait, (txt) =>
        PAGE '/so19/node.js', optsBait, (txt) =>
          DONE()


  IT 'Bad guesses', ->
    PAGE '/readme.txt', optsBait, (txt) =>
      PAGE '/search', optsBait, (txt) =>
        PAGE '/search?site=&ie=UTF-8&q=Yuri+Kochiyama&oi=ddle&ct=yuri-kochiyamas-95th-birthday-5723472594468864-hp&hl=en&sa=X&ved=0ahUKEwil6qbk4ebMAhUBVj4KHX2qCVIQPQgD', optsBait, (txt) =>
          DONE()



DESCRIBE "[500] Ban", ->

  beforeEach ->
    @optsExpect = status:500,contentType:/text/,ua:FIXTURE.http.UA.desktop.ChromeMac
    STUB.wrapper('Cloudflare').api('get').success('cloudflare_block_ip_ok')


  IT '/900x90.q2-1.ruby.png', -> BAN @
  IT '/index.xml', -> BAN @
  IT '/index.xml?test=yo', -> BAN @
  IT '/core/CHANGELOG.txt', -> BAN @
  IT '/.git', -> BAN @
  IT '/.editorconfig', -> BAN @
  IT '/example.gitignore', -> BAN @
  IT '/.gitattributes', -> BAN @
  IT '/phpMyAdmin', -> BAN @
  IT '/phpmyadmin', -> BAN @
  IT '/wp-test/phpMyAdmin/gooodey', -> BAN @
  IT '/license.txt?tasdfas=234sdfsd', -> BAN @
  IT '/_vti_bin/owssvr.dll?UL=1&ACT=4&BUILD=6606&STRMVER=4&CAPREQ=0', -> BAN @
  IT '/admin', -> BAN @
  IT '//admin/Cms_Wysiwyg', -> BAN @
  IT '//admin/Cms_Wysiwyg/directive/index', -> BAN @
  IT '/bitrix/admin', -> BAN @
  IT '/administrator', -> BAN @

  IT '+7 requests in 1 min', ->
    optsOK = {status:200,contentType:/html/}
    PAGE '/', optsOK, (html1) =>
      PAGE '/', optsOK, (html2) =>
        PAGE '/', optsOK, (html3) =>
          PAGE '/', optsOK, (html4) =>
            PAGE '/', optsOK, (html5) =>
              PAGE '/', optsOK, (html6) =>
                PAGE '/', optsOK, (html7) =>
                  PAGE '/', @optsExpect, (txt8) =>
                    DONE()

  IT 'http.POST BAN', ->
    SUBMIT '/', {}, @optsExpect, (txt1) =>
      expect(txt1).to.equal('')
      PAGE '/', @optsExpect, (txt2) =>
        expect(txt2).to.equal('')
        DONE()
