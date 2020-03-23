# rules   = []
# ok      = 0

# testGone = (status, from, to) =>
#   PAGE from, {status}, (res) =>
#     txt = "#{if status is 301 then 'Moved Permanently' else 'Found'}. Redirecting to #{to}"
#     expect(res).to.equal(txt)
#     DONE() if rules.length is ++ok

# perm_to = (map) =>
#   rules = map
#   testRedirect(301, rule[0], rule[1]) for rule in rules
# temp_to = (map) =>
#   rules = map
#   testRedirect(302, rule[0], rule[1]) for rule in rules


optsGone = {status:410,contentType:/text/}
optsBanned = {status:500,contentType:/text/}


IT 'IP Ban 6+ GONE requests', ->
  STUB.wrapper('Cloudflare').api('get').success('cloudflare_block_ip_ok')
  PAGE '/agile-software', optsGone, (txt1) =>
    expect(txt1).to.equal('')
    PAGE '/conversion-rate-optimization', optsGone, (txt2) =>
      PAGE '/graph-database', optsGone, (txt3) =>
        PAGE '/jobs/05-14/airpair-evangelist', optsGone, (txt4) =>
          PAGE '/jobs/07-07/advertising-specialist', optsGone, (txt5) =>
            PAGE '/news/06-14/why-a-fresh-start-on-product', optsGone, (txt6) =>
              PAGE '/news/airpairme-direct-access', optsBanned, (txt7) =>
                expect(txt7).to.equal('')
                PAGE '/anythings', optsBanned, (txt8) =>
                  DONE()


IT 'OLD WORDPRESS', ->
  PAGE '/backbone-js/backbone-js-experts/page/3', optsGone, (txt) =>
    expect(txt).to.equal('')
    DONE()



IT 'Meta files', ->
  PAGE '/index_sitemap.xml', optsGone, (txt1) =>
    PAGE '/image_sitemap.xml', optsGone, (txt2) =>
      expect(txt1+txt2).to.equal('')
      DONE()

