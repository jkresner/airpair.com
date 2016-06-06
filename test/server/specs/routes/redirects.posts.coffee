rules   = []
ok      = 0

testRedirect = (status, from, to) =>
  PAGE from, {status}, (res) =>
    txt = "#{if status is 301 then 'Moved Permanently' else 'Found'}. Redirecting to #{to}"
    expect(res).to.equal(txt)
    DONE() if rules.length is ++ok

perm_to = (map) =>
  rules = map
  testRedirect(301, rule[0], rule[1]) for rule in rules
temp_to = (map) =>
  rules = map
  testRedirect(302, rule[0], rule[1]) for rule in rules


beforeEach ->
  ok = 0


IT 'API Pages', -> perm_to [
  ['/bit.ly', '/software-experts']
  ['/blossom', '/software-experts']
  ['/spotify', '/software-experts']
  ['/echo-nest', '/software-experts']
  ['/tokbox', '/software-experts']
  ['/hellosign', '/software-experts']
  ['/vero/posts/vero-support-and-api-integration-help', '/software-experts']
  ['/vero', '/software-experts']
  ['/flydata', '/software-experts']
  ['/twotap', '/software-experts']
  ['/sinch', '/software-experts']
  ['/human-api', '/software-experts']
  ['/human-api/posts/human-api-support-integration-help', '/software-experts']
  ['/heroku/posts/heroku-support-integration-help', '/heroku']
  ['/mailjet', '/software-experts']
  ['/mailjet/SMTP-expert-florian-le-goff', '/software-experts']
  ['/paypal/posts/paypal-support-and-api-integration-help', '/salesforce/expert-daniel-ballinger']
]


IT 'Search leniences', -> perm_to [
  ['/javascript/integrating-stripe-into', '/javascript/integrating-stripe-into-angular-app']
]



IT 'Published post', -> perm_to [
  ['/posts/review/545ac3ec2826860b007801c4', 'http://www.airpair.com/js/javascript-framework-comparison']
]



SKIP '/posts/edit/54afe4c7a9dc630b00b8685d', ->
 # perm_to [
  # ['/posts/edit/54afe4c7a9dc630b00b8685d
  # ['/posts/contributors/55e3705b0fa2cd11000e0cc5, 'stay on airpair.com?'
  # ['/posts/preview/5514559c5955b711004d652e', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']
  # ['/posts/me?submitted=55386de99778e11100f6d9e0', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']
# ]

SKIP '/posts/contributors/55e3705b0fa2cd11000e0cc5', -> # perm_to [

SKIP '/postspreview/5514559c5955b711004d652e', ->

SKIP '/posts/me?submitted=55386de99778e11100f6d9e0', ->
