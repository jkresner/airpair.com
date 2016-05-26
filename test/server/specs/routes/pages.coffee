js =
  index: /javascript" src="https:\/\/static\.airpair\.com\/js\/index/


DESCRIBE 'Anonymous', ->

  DESCRIBE 'noindex', ->

    IT '/tos', -> HTML @, [/Terms of Service/,/class="blogpost faq">/]
    IT '/privacy', -> HTML @, [/Privacy Policy/,/class="blogpost faq">/]
    IT '/refund-policy', -> HTML @, [/Refund Policy/,/class="blogpost faq">/]
    IT '/login', -> HTML @, [js.index]

  DESCRIBE 'index', ->

    IT '/', -> HTML @, [/<title>airpair | Coding help/], no: [js.index]

    # IT 'index meta /software-experts software experts', ->
    # IT 'index meta /workshops software experts', ->
    # IT 'index meta /hire-developers through airpair (partial)', ->
    # IT 'index meta /ios tag ios', ->
    # IT 'index meta /angularjs canonical angularjs post', ->
    # it 'index meta /posts/tag/angularjs tag angularjs', ->
    # IT 'index meta /100-writing-competition', ->
    # IT '/rss', ->


  # DESCRIBE '302', ->

    # IT '/me', ->
    # IT '/dashboard', ->
    # IT '/matching', ->
    # IT '/authoring', ->
    # IT '/requests', ->

