import PostsAPI from '../api/posts'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'


var getPostBySlug = (slug) =>
  (req, res, next) => {
    PostsAPI.svc.getBySlug(slug, (ee,post) => {
      if (!post) {
        if (winston) winston.error(`Did not find migrated post ${canonical} for ${slug}`)
        return next("Post not found")
      }
      req.post = post
      next()
    })
  }


function routeCanonicalPost(router, app, canonical, slug) {
  router.get(canonical, noTrailingSlash(), getPostBySlug(slug), trackView('post'),
    app.renderHbsViewData('post', null,
      function(req, cb) {
        req.post.primarytag = req.post.tags[0]
        PostsAPI.svc.getSimilarPublished(req.post.primarytag.slug, (e,r) => {
          req.post.similar = r
          cb(null,req.post)
        })
      })
    )
}

var postCanonicals = [
  {o:'/actionscript-expert-jason-sturges', c:'actionscript-expert-jason-sturges-1'},
  {o:'/agile-software/coach-and-trainer-ron-lichty/', c:'coach-and-trainer-ron-lichty-1'},
  {o:'/algolia/algolia-search-expert-sylvain-utard', c:'algolia-search-expert-sylvain-utard-1'},
  {o:'/analytics/analytics-integration-expert-jordan-feldstein', c:'analytics-integration-expert-jordan-feldstein-1'},
  {o:'/analytics/consultant-keen-io-api-integration-seb-insua', c:'consultant-keen-io-api-integration-seb-insua-1'},
  {o:'/analytics/mixpanel-problem-solving-justin-sherratt', c:'mixpanel-problem-solving-justin-sherratt-1'},
  {o:'/android-wear/posts/android-wear-tutorial-comprehensive-introduction', c:'android-wear-tutorial-comprehensive-introduction'},
  {o:'/android/android-camera-development', c:'the-ultimate-android-camera-development-guide'},
  {o:'/android/android-camera-surface-view-fragment', c:'using-androids-camera-surfaceview-in-a-fragment'},
  {o:'/android/android-code-review', c:'android-code-review-1'},
  {o:'/android/android-expert-rex-st-john', c:'android-expert-rex-st-john-1'},
  {o:'/android/android-studio-vs-eclipse', c:'android-studio-vs-eclipse-what-you-need-to-know'},
  {o:'/android/android-tools-every-android-developer-should-know-about', c:'6-android-tools-every-android-developer-should-know-about'},
  {o:'/android/bugs-annoying-android-developers', c:'4-bugs-currently-annoying-android-developers-and-their-solutions'},
  {o:'/android/developer-ran-nachmany', c:'developer-ran-nachmany-1'},
  {o:'/android/fragments-android-studio', c:'fragments-in-android-studio'},
  {o:'/android/horizontal-image-galleries-android-studio', c:'horizontal-scrolling-image-galleries-in-android-studio'},
  {o:'/android/list-fragment-android-studio', c:'tutorial-list-fragments-in-android-studio'},
  {o:'/android/photo-gallery-android-studio-list-fragments', c:'creating-a-photo-gallery-in-android-studio-with-list-fragments'},
  {o:'/android/posts/adding-tampering-detection-to-your-android-app', c:'adding-tampering-detection-to-your-android-app'},
  {o:'/android/taking-pictures-android-fragment-intents', c:'taking-pictures-android-fragment-intents'},
  {o:'/android/unit-testing-with-android-studio', c:'screencast-unit-testing-in-android-studio'},
  {o:'/angularjs/angularjs-pair-programming-julia-jacobs', c:'angularjs-pair-programming-julia-jacobs-1'},
  {o:'/angularjs/angularjs-problem-solving-dana-de-alasei', c:'angularjs-problem-solving-dana-de-alasei-1'},
  {o:'/angularjs/angularjs-teacher-justin-obney', c:'angularjs-teacher-justin-obney-1'},
  {o:'/angularjs/building-angularjs-app-tutorial', c:'angularjs-tutorial-building-a-web-app-in-5-minutes'},
  {o:'/angularjs/developer-tobias-talltorp', c:'developer-tobias-talltorp-1'},
  {o:'/angularjs/developer-ye-liu', c:'developer-ye-liu-1'},
  {o:'/angularjs/expert-matias-niemela', c:'expert-matias-niemela-1'},
  {o:'/angularjs/expert-training-author-ari-lerner', c:'expert-training-author-ari-lerner-1'},
  {o:'/angularjs/web-scraping-phantomjs-session', c:'web-scraping-phantomjs-session-1'},
  {o:'/api-integration/api-ification-of-the-web-2014-q1', c:'api-ification-of-the-web-2014-q1-1'},
  {o:'/backbone.js/backbone.js-code-review', c:'backbone.js-code-review-1'},
  {o:'/backbone.js/code-mentor-edward-anderson', c:'code-mentor-edward-anderson-1'},
  {o:'/backbone.js/expert-training-jonathon-kresner', c:'expert-training-jonathon-kresner-1'},
  {o:'/c-plus-plus/c-plus-plus-consultant-glen-de-cauwsemaecker', c:'c-plus-plus-consultant-glen-de-cauwsemaecker-1'},
  {o:'/c-plus-plus/matlab-expert-steve-purves', c:'matlab-expert-steve-purves-1'},
  {o:'/code-mentoring/airpairs-been-turing-into-my-iphone', c:'airpairs-been-turning-into-my-iphone-1'},
  {o:'/conversion-rate-optimization/arun', c:'conversion-rate-optimization-expert-arun-sivashankaran-1'},
  {o:'/cort-tafoya-SEO-hacks', c:'5-seo-hacks-ive-learnt-while-consulting-in-san-francisco'},
  {o:'/d3.js/getting-started-tutorial', c:'data-visualization-tutorial'},
  {o:'/data-science/data-science-expert-thomson-nguyen', c:'data-science-expert-thomson-nguyen-1'},
  {o:'/devops/devops-consultant-evgeny-zislis', c:'devops-consultant-evgeny-zislis-1'},
  {o:'/devops/devops-tools', c:'devops-tools-automating-your-infrastructure-with-chef-1'},
  {o:'/django/server-side-templates-part-1', c:'under-the-hood-of-django-templates-part-1-introduction'},
  {o:'/django/server-side-templates-part-2', c:'under-the-hood-of-django-server-side-templates-part-2-lexing-and-parsing'},
  {o:'/email-ab-testing/consultant-greg-schier', c:'consultant-greg-schier-1'},
  {o:'/email-ab-testing/expert-nicholas-rempel', c:'expert-nicholas-rempel-1'},
  {o:'/email-optimization/email-optimization-consultant-damien-brzoska', c:'email-optimization-consultant-damien-brzoska-1'},
  {o:'/email-optimization/email-optimization-expert-james-lamont', c:'email-optimization-expert-james-lamont-1'},
  {o:'/ember.js/code-mentor-martin-feckie', c:'code-mentor-martin-feckie-1'},
  {o:'/ember.js/expert-stefan-penner', c:'expert-stefan-penner-1'},
  {o:'/ember.js/teacher-michael-grassoti', c:'teacher-michael-grassoti-1'},
  {o:'/ember.js/training-on-demand', c:'training-on-demand-1'},
  {o:'/evernote/evernote-api-integration-expert-phil-seeman', c:'evernote-api-integration-expert-phil-seeman-1'},
  {o:'/evernote/evernote-api-support-expert-heitor-sergent', c:'evernote-api-support-expert-heitor-sergent-1'},
  {o:'/excel/expert-training-professor-felienne-hermans', c:'expert-training-professor-felienne-hermans-1'},
  {o:'/firebase/expert-abe-haskins', c:'expert-abe-haskins-1'},
  {o:'/git/jenkins-gerrit-build-setup', c:'jenkins-gerrit-build-setup-1'},
  {o:'/git/learn-git-basics', c:'learn-git-basics-1'},
  {o:'/go/go-training-erik-st-martin/', c:'go-training-erik-st-martin-1'},
  {o:'/google-app-engine/cloud-scalability-homejoy', c:'cloud-scalability-homejoy-1'},
  {o:'/graph-database/graph-database-expert-wes-freeman', c:'graph-database-expert-wes-freeman-1'},
  {o:'/hadoop/hadoop-expert-patrick-lie', c:'hadoop-expert-patrick-lie-1'},
  {o:'/heroku/expert-jed-schneider', c:'expert-jed-schneider-1'},
  {o:'/hipaa/hipaa-consultant-trey-swann', c:'hipaa-consultant-trey-swann-1'},
  {o:'/hipaa/hipaa-expert-jason-wang', c:'hipaa-expert-jason-wang-1'},
  {o:'/html5/developer-kyle-sowards', c:'developer-kyle-sowards-1'},
  {o:'/html5/html5-expert-todd-motto', c:'html5-expert-todd-motto-1'},
  {o:'/ios/developer-ashish-awaghad', c:'developer-ashish-awaghad-1'},
  {o:'/ios/expert-help-training-jason-adam', c:'get-mobile-with-ios-expert-jason-adams-1'},
  {o:'/ios/ios-code-mentor-jonathon-dalrymple', c:'ios-code-mentor-jonathon-dalrymple-1'},
  {o:'/ios/ios-code-review', c:'ios-code-review-1'},
  {o:'/ios/ios-consultant-wain-glaister', c:'ios-consultant-wain-glaister-1'},
  {o:'/ios/ios-teacher-nevan-king', c:'ios-teacher-nevan-king-1'},
  {o:'/ios/ios-trainer-reynaldo-gonzales', c:'ios-trainer-reynaldo-gonzales-1'},
  {o:'/ios/ios-training-for-couch', c:'ios-training-for-couch-1'},
  {o:'/javascript/async-javascript-libraries', c:'which-async-javascript-libraries-should-i-use'},
  {o:'/javascript/code-mentor-morgan-allen', c:'code-mentor-morgan-allen-1'},
  {o:'/javascript/developer-jeff-escalante', c:'developer-jeff-escalante-1'},
  {o:'/javascript/emberjs-using-ember-cli', c:'ember.js-tutorial-using-ember-cli'},
  {o:'/javascript/emberjs-vs-angularjs-opinions-contributors-video-chat', c:'emberjs-vs-angularjs-opinions-contributors-video-chat-1'},
  {o:'/javascript/expert-lars-kotthoff', c:'expert-lars-kotthoff-1'},
  {o:'/javascript/expert-trainer-tim-caswell', c:'expert-trainer-tim-caswell-1'},
  {o:'/javascript/integrating-stripe-into-angular-app', c:'angularjs-app-with-stripe-payments-integration'},
  {o:'/javascript/javascript-array-reduce', c:'understand-javascript-array-reduce-in-1-minute'},
  {o:'/javascript/javascript-callbacks', c:'javascript-callbacks-1'},
  {o:'/javascript/javascript-code-mentoring', c:'javascript-code-mentoring-1'},
  {o:'/javascript/javascript-consultant-marek-publicewicz', c:'javascript-consultant-marek-publicewicz-1'},
  {o:'/javascript/learn-javascript', c:'learn-javascript-in-1-week'},
  {o:'/javascript/node-js-tutorial', c:'node-js-tutorial-step-by-step-guide-for-getting-started'},
  {o:'/javascript/teacher-aldo-bucchi', c:'javascript-teacher-aldo-bucchi-1'},
  {o:'/jquery/jquery-code-mentoring', c:'jquery-code-mentoring-1'},
  {o:'/js/javascript-framework-comparison', c:'angularjs-vs-backbonejs-vs-emberjs'},
  {o:'/js/jquery-ajax-post-tutorial', c:'jquery-ajax-post-tutorial'},
  {o:'/js/using-angularjs-yeoman', c:'using-yeoman-with-angularjs'},
  {o:'/lob/expert-harry-zhang', c:'expert-harry-zhang-1'},
  {o:'/lob/expert-leore-avidar', c:'expert-leore-avidar-1'},
  {o:'/lob/expert-peter-nagel', c:'expert-peter-nagel-1'},
  {o:'/mailjet/expert-orlando-kalossakas', c:'expert-orlando-kalossakas-1'},
  {o:'/mailjet/SMTP-expert-florian-le-goff', c:'SMTP-expert-florian-le-goff-1'},
  {o:'/microsoft.net/expert-help-peder-rice', c:'expert-help-peder-rice-1'},
  {o:'/mobile-checkout/mobile-checkout-expert-radu-spineanu', c:'mobile-checkout-expert-radu-spineanu-1'},
  {o:'/neo4j/introduction-graph-databases', c:'neo4j-graph-database-vs.-sql-what-you-need-to-know'},
  {o:'/nexmo-expert-asim-imtiaz', c:'nexmo-expert-asim-imtiaz-1'},
  {o:'/nginx/extending-nginx-tutorial', c:'nginx-tutorial-developing-modules'},
  {o:'/nlp/keyword-extraction-tutorial', c:'nlp-keyword-extraction-tutorial-with-rake-and-maui'},
  {o:'/node-js/expert-help-peter-lyons/', c:'expert-help-peter-lyons-1'},
  {o:'/node.js/expert-ryan-schmukler', c:'expert-ryan-schmukler-1'},
  {o:'/node.js/expert-training-domenic-denicola', c:'expert-training-domenic-denicola-1'},
  {o:'/node.js/learn-node.js', c:'learn-nodejs-basics-in-just-5-minutes'},
  {o:'/node.js/node-js-code-review', c:'node-js-code-review-1'},
  {o:'/node.js/node-js-problem-solving', c:'node-js-problem-solving-1'},
  {o:'/node.js/training-support-alexandru-vladutu', c:'training-support-alexandru-vladutu-1'},
  {o:'/pair-programming-tips/google-hangouts-screenshare', c:'google-hangouts-screenshare-1'},
  {o:'/pair-programming/our-future/', c:'our-future-1'},
  {o:'/pair-programming/pair-programming-tools-survey-jan-2014', c:'pair-programming-tools-2014-q1-survey'},
  {o:'/payment-processing/payments-integration-expert-justin-keller', c:'payments-integration-expert-justin-keller-1'},
  {o:'/performance-testing/load-testing-tools-tim-koopmans', c:'load-testing-tools-tim-koopmans-1'},
  {o:'/php/developer-marton-kodok', c:'developer-marton-kodok-1'},
  {o:'/php/fatal-error-allowed-memory-size', c:'fixing-php-fatal-error-allowed-memory-size-exhausted'},
  {o:'/php/php-code-mentor-philip-thomas', c:'php-code-mentor-philip-thomas-1'},
  {o:'/php/php-code-mentoring', c:'php-code-mentoring-1'},
  {o:'/php/php-code-review', c:'php-code-review-1'},
  {o:'/php/php-expert-jorge-colon', c:'php-expert-jorge-colon-1'},
  {o:'/php/php-freelancer-teacher', c:'php-freelancer-and-teacher-paul-sobocinski-1'},
  {o:'/php/setting-up-mamp-local-development-environment', c:'setting-up-mamp-local-development-environment-1'},
  {o:'/project-ramon-code-mentoring', c:'project-ramon-code-mentoring-1'},
  {o:'/pubnub/developer-dave-nugent', c:'developer-dave-nugent-1'},
  {o:'/pubnub/expert-ian-jennings', c:'expert-ian-jennings-1'},
  {o:'/python/code-mentor-semion-sidorenko', c:'code-mentor-semion-sidorenko-1'},
  {o:'/python/django-expert-daniel-roseman', c:'django-expert-daniel-roseman-1'},
  {o:'/python/machine-learning-expert-alexandre-gravier', c:'machine-learning-expert-alexandre-gravier-1'},
  {o:'/python/python-code-mentoring-web-scraping', c:'python-code-mentoring-web-scraping-1'},
  {o:'/python/python-expert-josh-kuhn', c:'python-expert-josh-kuhn-1'},
  {o:'/ruby-on-rails/agile-development-fernando-villalobos', c:'agile-development-fernando-villalobos-1'},
  {o:'/ruby-on-rails/basics-shayon-mukherjee', c:'basics-shayon-mukherjee-1'},
  {o:'/ruby-on-rails/buliding-faster-with-rails-code-mentors', c:'building-faster-with-rails-code-mentors-1'},
  {o:'/ruby-on-rails/code-mentor-edward-anderson', c:'code-mentor-edward-anderson-2'},
  {o:'/ruby-on-rails/continuous-deployment', c:'continuous-deployment-1'},
  {o:'/ruby-on-rails/learning-rails-with-experts', c:'learning-rails-with-experts-1'},
  {o:'/ruby-on-rails/performance', c:'rails-performance-what-you-need-to-know'},
  {o:'/ruby-on-rails/rails-code-mentoring', c:'rails-code-mentoring-1'},
  {o:'/ruby-on-rails/rails-code-review', c:'rails-code-review-1'},
  {o:'/ruby-on-rails/rails-consultant-kyle-decot', c:'rails-consultant-kyle-decot-1'},
  {o:'/ruby-on-rails/rails-expert-multi-tenancy-author-ryan-bigg', c:'rails-expert-multi-tenancy-author-ryan-bigg-1'},
  {o:'/ruby-on-rails/rails-ninja-adam-cuppy', c:'rails-ninja-adam-cuppy-1'},
  {o:'/ruby-on-rails/rails-problem-solving', c:'rails-problem-solving-1'},
  {o:'/ruby-on-rails/rails-teacher-backnol-yogendran', c:'rails-teacher-backnol-yogendran-1'},
  {o:'/ruby-on-rails/rails-testing-ramon-porter', c:'rails-testing-ramon-porter-1'},
  {o:'/ruby-on-rails/rails-tutor-aaron-dufall', c:'rails-tutor-aaron-dufall-1'},
  {o:'/ruby-on-rails/remote-pair-programming', c:'remote-pair-programming-1'},
  {o:'/ruby-on-rails/ruby-experts-pedro-nascimento', c:'ruby-experts-pedro-nascimento-1'},
  {o:'/ruby-on-rails/tmux-vim-rails-pair-programming-mark-simoneau', c:'tmux-vim-rails-pair-programming-mark-simoneau-1'},
  {o:'/ruby-on-rails/trainer-erik-trautman', c:'trainer-erik-trautman-1'},
  {o:'/ruby-on-rails/training-alok-tandon', c:'training-alok-tandon-1'},
  {o:'/ruby-on-rails/training-obie-fernandez', c:'training-obie-fernandez-1'},
  {o:'/ruby/ruby-problem-solving-for-sendwithus', c:'ruby-problem-solving-for-sendwithus-1'},
  {o:'/ruby/tutor-naomi-freeman', c:'tutor-naomi-freeman-1'},
  {o:'/rubymotion/code-mentor-mark-rickert', c:'code-mentor-mark-rickert-1'},
  {o:'/rubymotion/rubymotion-consultant-jack-watsonhamblin', c:'rubymotion-consultant-jack-watsonhamblin-1'},
  {o:'/rubymotion/rubymotion-trainer-amir-rajan', c:'rubymotion-trainer-amir-rajan-1'},
  {o:'/salesforce/expert-daniel-ballinger', c:'expert-daniel-ballinger-1'},
  {o:'/search-engine/search-engine-expert-julien-lemoine', c:'search-engine-expert-julien-lemoine-1'},
  {o:'/selenium/selenium-expert-daniel-davison', c:'selenium-expert-daniel-davison-1'},
  {o:'/sendgrid/sendgrid-salesforce-apex-library', c:'sendgrid-salesforce-apex-library-1'},
  {o:'/seo/help-steen-andersson', c:'help-steen-andersson-1'},
  {o:'/seo/posts/5-seo-hacks-ive-learnt-while-consulting-in-san-francisco', c:'5-seo-hacks-ive-learnt-while-consulting-in-san-francisco'},
  {o:'/seo/posts/if-you-are-blogging-for-seo-you-are-doing-it-wrong', c:'if-you-are-blogging-for-seo-you-are-doing-it-wrong'},
  {o:'/seo/seo-best-practices', c:'seo-best-practices-1'},
  {o:'/seo/seo-consultant-ehren-reilly', c:'seo-consultant-ehren-reilly-1'},
  {o:'/seo/seo-expert-igor-lebovic', c:'seo-expert-igor-lebovic-1'},
  {o:'/seo/seo-focused-wordpress-infrastructure', c:'if-you-are-blogging-for-seo-you-are-doing-it-wrong'},
  {o:'/seo/trainer-cort-tafoya', c:'trainer-cort-tafoya-1'},
  {o:'/sinch/evangelist-christian-jensen', c:'evangelist-christian-jensen-1'},
  {o:'/smtp/sendgrid-smtp-expert-nick-woodhams', c:'sendgrid-smtp-expert-nick-woodhams-1'},
  {o:'/swift/building-swift-app-tutorial', c:'swift-tutorial-building-an-ios-application-part-1'},
  {o:'/swift/building-swift-app-tutorial-2', c:'swift-tutorial-building-an-ios-application–part-2'},
  {o:'/swift/building-swift-app-tutorial-3', c:'swift-tutorial-building-an-ios-application-part-3'},
  {o:'/swift/complete-guide-to-swift', c:'ultimate-guide-to-learning-swift-in-one-day'},
  {o:'/swift/learning-swift-tutorial', c:'swift-a-quick-reference-guide'},
  {o:'/testing/learn-ruby-test-driven-development', c:'learn-ruby-test-driven-development-1'},
  {o:'/translation/crowd-translation-code-mentor-vasco-pedro', c:'crowd-translation-code-mentor-vasco-pedro-1'},
  {o:'/translation/crowd-translation-expert-joao-graca', c:'crowd-translation-expert-joao-graca-1'},
  {o:'/twilio/twilio-code-mentor-jeff-linwood', c:'twilio-code-mentor-jeff-linwood-1'},
  {o:'/twilio/twilio-expert-roger-stringer', c:'twilio-expert-roger-stringer-1'},
  {o:'/typescript/expert-basarat', c:'expert-basarat-1'},
  {o:'/user-experience/ux-expert-alyssa-reese', c:'ux-expert-alyssa-reese-1'},
  {o:'/wordpress/expert-help-eric-mann', c:'expert-help-eric-mann-1'},
  {o:'/angularjs/code-mentor-tony-childs', c:'angularjs-code-mentor-tony-childs-1'}

];


export default function(app) {

  var router = require('express').Router()

  for (var p of postCanonicals) {
    var slug = p.c
    routeCanonicalPost(router, app, p.o, slug)
  }

  return router

}

