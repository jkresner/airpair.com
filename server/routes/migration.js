import PostsAPI from '../api/posts'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'

function routeCanonicalPost(router, app, canonical, slug) {
  router.get(canonical, noTrailingSlash(), app.renderHbsViewData('post', function (req, cb) {
      // $log('slug', slug)
      PostsAPI.svc.getBySlug(slug, (ee,post) => {
        // $log('p', post)
        if (!post) return cb({title:"Post not found",md:"."})
        req.post = post
        req.post.primarytag = post.tags[0]
        PostsAPI.svc.getSimilarPublished(req.post.primarytag, (e,r) => {
          req.post.similar = r
          cb(null,req.post)
        })
      })
    }), trackView('post'))
}

var postCanonicals = [
  {o:'/actionscript-expert-jason-sturges', c:'/actionscript/posts/actionscript-expert-jason-sturges-1'},
  {o:'/agile-software/coach-and-trainer-ron-lichty/', c:'/agile/posts/coach-and-trainer-ron-lichty-1'},
  {o:'/algolia/algolia-search-expert-sylvain-utard', c:'/algolia/posts/algolia-search-expert-sylvain-utard-1'},
  {o:'/analytics/analytics-integration-expert-jordan-feldstein', c:'/analytics/posts/analytics-integration-expert-jordan-feldstein-1'},
  {o:'/analytics/consultant-keen-io-api-integration-seb-insua', c:'/analytics/posts/consultant-keen-io-api-integration-seb-insua-1'},
  {o:'/analytics/mixpanel-problem-solving-justin-sherratt', c:'/analytics/posts/mixpanel-problem-solving-justin-sherratt-1'},
  {o:'/android-wear/posts/android-wear-tutorial-comprehensive-introduction', c:'/android-wear/posts/android-wear-tutorial-comprehensive-introduction'},
  {o:'/android/android-camera-development', c:'/web-scraping-phantomjs-sessionandroid-camera/posts/the-ultimate-android-camera-development-guide'},
  {o:'/android/android-camera-surface-view-fragment', c:'/android-camera/posts/using-androids-camera-surfaceview-in-a-fragment'},
  {o:'/android/android-code-review', c:'/android/posts/android-code-review-1'},
  {o:'/android/android-expert-rex-st-john', c:'/android/posts/android-expert-rex-st-john-1'},
  {o:'/android/android-studio-vs-eclipse', c:'/android-studio/posts/android-studio-vs-eclipse-what-you-need-to-know'},
  {o:'/android/android-tools-every-android-developer-should-know-about', c:'/android-asynctask/posts/6-android-tools-every-android-developer-should-know-about'},
  {o:'/android/bugs-annoying-android-developers', c:'/v1/posts/4-bugs-currently-annoying-android-developers-and-their-solutions'},
  {o:'/android/developer-ran-nachmany', c:'/android/posts/developer-ran-nachmany-1'},
  {o:'/android/fragments-android-studio', c:'/android-studio/posts/fragments-in-android-studio'},
  {o:'/android/horizontal-image-galleries-android-studio', c:'/android-studio/posts/horizontal-scrolling-image-galleries-in-android-studio'},
  {o:'/android/list-fragment-android-studio', c:'/android-studio/posts/tutorial-list-fragments-in-android-studio'},
  {o:'/android/photo-gallery-android-studio-list-fragments', c:'/android-studio/posts/creating-a-photo-gallery-in-android-studio-with-list-fragments'},
  {o:'/android/posts/adding-tampering-detection-to-your-android-app', c:'/android/posts/adding-tampering-detection-to-your-android-app'},
  {o:'/android/taking-pictures-android-fragment-intents', c:'/android/taking-pictures-android-fragment-intents'},
  {o:'/android/unit-testing-with-android-studio', c:'/android-studio/posts/screencast-unit-testing-in-android-studio'},
  {o:'/angularjs/angularjs-pair-programming-julia-jacobs', c:'/angularjs/posts/angularjs-pair-programming-julia-jacobs-1'},
  {o:'/angularjs/angularjs-problem-solving-dana-de-alasei', c:'/angularjs/posts/angularjs-problem-solving-dana-de-alasei-1'},
  {o:'/angularjs/angularjs-teacher-justin-obney', c:'/angularjs/posts/angularjs-teacher-justin-obney-1'},
  {o:'/angularjs/building-angularjs-app-tutorial', c:'/angularjs/posts/angularjs-tutorial-building-a-web-app-in-5-minutes'},
  {o:'/angularjs/developer-tobias-talltorp', c:'/angularjs/posts/developer-tobias-talltorp-1'},
  {o:'/angularjs/developer-ye-liu', c:'/angularjs/posts/developer-ye-liu-1'},
  {o:'/angularjs/expert-matias-niemela', c:'/angularjs/posts/expert-matias-niemela-1'},
  {o:'/angularjs/expert-training-author-ari-lerner', c:'/angularjs/posts/expert-training-author-ari-lerner-1'},
  {o:'/angularjs/web-scraping-phantomjs-session', c:'/angularjs/posts/web-scraping-phantomjs-session-1'},
  {o:'/api-integration/api-ification-of-the-web-2014-q1', c:'/api-survey/posts/api-ification-of-the-web-2014-q1-1'},
  // {o:'/backbone-js/backbone-js-experts  '},/
  {o:'/backbone.js/backbone.js-code-review', c:'/backbone.js/posts/backbone.js-code-review-1'},
  {o:'/backbone.js/code-mentor-edward-anderson', c:'/backbone.js/posts/code-mentor-edward-anderson-1'},
  {o:'/backbone.js/expert-training-jonathon-kresner', c:'/backbone.js/posts/expert-training-jonathon-kresner-1'},
  {o:'/c-plus-plus/c-plus-plus-consultant-glen-de-cauwsemaecker', c:'/c++/posts/c-plus-plus-consultant-glen-de-cauwsemaecker-1'},
  {o:'/c-plus-plus/matlab-expert-steve-purves', c:'/matlab/posts/matlab-expert-steve-purves-1'},
  {o:'/code-mentoring/airpairs-been-turing-into-my-iphone', c:'/code-mentoring/posts/airpairs-been-turning-into-my-iphone-1'},
  {o:'/conversion-rate-optimization/arun', c:'/v1/posts/conversion-rate-optimization-expert-arun-sivashankaran-1'},
  {o:'/cort-tafoya-SEO-hacks', c:'/seo/posts/5-seo-hacks-ive-learnt-while-consulting-in-san-francisco'},
  {o:'/d3.js/getting-started-tutorial', c:'/d3.js/posts/data-visualization-tutorial'},
  {o:'/data-science/data-science-expert-thomson-nguyen', c:'/data-science/posts/data-science-expert-thomson-nguyen-1'},
  {o:'/devops/devops-consultant-evgeny-zislis', c:'/devops/posts/devops-consultant-evgeny-zislis-1'},
  {o:'/devops/devops-tools', c:'/chef/posts/devops-tools-automating-your-infrastructure-with-chef-1'},
  {o:'/django/server-side-templates-part-1', c:'/django/posts/under-the-hood-of-django-templates-part-1-introduction'},
  {o:'/django/server-side-templates-part-2', c:'/django/posts/under-the-hood-of-django-server-side-templates-part-2-lexing-and-parsing'},
  {o:'/email-ab-testing/consultant-greg-schier', c:'/email-ab-testing/posts/consultant-greg-schier-1'},
  {o:'/email-ab-testing/expert-nicholas-rempel', c:'/email-ab-testing/posts/expert-nicholas-rempel-1'},
  {o:'/email-optimization/email-optimization-consultant-damien-brzoska', c:'/email-optimization/posts/email-optimization-consultant-damien-brzoska-1'},
  {o:'/email-optimization/email-optimization-expert-james-lamont', c:'/email-optimization/posts/email-optimization-expert-james-lamont-1'},
  {o:'/ember.js/code-mentor-martin-feckie', c:'/ember.js/posts/code-mentor-martin-feckie-1'},
  {o:'/ember.js/expert-stefan-penner', c:'/ember.js/posts/expert-stefan-penner-1'},
  {o:'/ember.js/teacher-michael-grassoti', c:'/ember.js/posts/teacher-michael-grassoti-1'},
  {o:'/ember.js/training-on-demand', c:'/ember.js/posts/training-on-demand-1'},
  {o:'/evernote/evernote-api-integration-expert-phil-seeman', c:'/evernote/posts/evernote-api-integration-expert-phil-seeman-1'},
  {o:'/evernote/evernote-api-support-expert-heitor-sergent', c:'/evernote/posts/evernote-api-support-expert-heitor-sergent-1'},
  {o:'/excel/expert-training-professor-felienne-hermans', c:'/excel/posts/expert-training-professor-felienne-hermans-1'},
  {o:'/firebase/expert-abe-haskins', c:'/firebase/posts/expert-abe-haskins-1'},
  {o:'/git/jenkins-gerrit-build-setup', c:'/git/posts/jenkins-gerrit-build-setup-1'},
  {o:'/git/learn-git-basics', c:'/git/posts/learn-git-basics-1'},
  {o:'/go/go-training-erik-st-martin/', c:'/v1/posts/go-training-erik-st-martin-1'},
  {o:'/google-app-engine/cloud-scalability-homejoy', c:'/google-app-engine/posts/cloud-scalability-homejoy-1'},
  {o:'/graph-database/graph-database-expert-wes-freeman', c:'/graph-database/posts/graph-database-expert-wes-freeman-1'},
  {o:'/hadoop/hadoop-expert-patrick-lie', c:'/hadoop/posts/hadoop-expert-patrick-lie-1'},
  {o:'/heroku/expert-jed-schneider', c:'/heroku/posts/expert-jed-schneider-1'},
  {o:'/hipaa/hipaa-consultant-trey-swann', c:'/hipaa/posts/hipaa-consultant-trey-swann-1'},
  {o:'/hipaa/hipaa-expert-jason-wang', c:'/hipaa/posts/hipaa-expert-jason-wang-1'},
  {o:'/html5/developer-kyle-sowards', c:'/html5/posts/developer-kyle-sowards-1'},
  {o:'/html5/html5-expert-todd-motto', c:'/html5/posts/html5-expert-todd-motto-1'},
  {o:'/ios/developer-ashish-awaghad', c:'/swift/posts/developer-ashish-awaghad-1'},
  {o:'/ios/expert-help-training-jason-adam', c:'/ios/posts/get-mobile-with-ios-expert-jason-adams-1'},
  {o:'/ios/ios-code-mentor-jonathon-dalrymple', c:'/ios/posts/ios-code-mentor-jonathon-dalrymple-1'},
  {o:'/ios/ios-code-review', c:'/ios/posts/ios-code-review-1'},
  {o:'/ios/ios-consultant-wain-glaister', c:'/ios/posts/ios-consultant-wain-glaister-1'},
  {o:'/ios/ios-teacher-nevan-king', c:'/ios/posts/ios-teacher-nevan-king-1'},
  {o:'/ios/ios-trainer-reynaldo-gonzales', c:'/ios/posts/ios-trainer-reynaldo-gonzales-1'},
  {o:'/ios/ios-training-for-couch', c:'/ios/posts/ios-training-for-couch-1'},
  {o:'/javascript/async-javascript-libraries', c:'/javascript/posts/which-async-javascript-libraries-should-i-use'},
  {o:'/javascript/code-mentor-morgan-allen', c:'/javascript/posts/code-mentor-morgan-allen-1'},
  {o:'/javascript/developer-jeff-escalante', c:'/javascript/posts/developer-jeff-escalante-1'},
  {o:'/javascript/emberjs-using-ember-cli', c:'/ember.js/posts/ember.js-tutorial-using-ember-cli'},
  {o:'/javascript/emberjs-vs-angularjs-opinions-contributors-video-chat', c:'/javascript/posts/emberjs-vs-angularjs-opinions-contributors-video-chat-1'},
  {o:'/javascript/expert-lars-kotthoff', c:'/javascript/posts/expert-lars-kotthoff-1'},
  {o:'/javascript/expert-trainer-tim-caswell', c:'/javascript/posts/expert-trainer-tim-caswell-1'},
  {o:'/javascript/integrating-stripe-into-angular-app', c:'/stripe-payments/posts/angularjs-app-with-stripe-payments-integration'},
  {o:'/javascript/javascript-array-reduce', c:'/javascript/posts/understand-javascript-array-reduce-in-1-minute'},
  {o:'/javascript/javascript-callbacks', c:'/javascript/posts/javascript-callbacks-1'},
  {o:'/javascript/javascript-code-mentoring', c:'/javascript/posts/javascript-code-mentoring-1'},
  {o:'/javascript/javascript-consultant-marek-publicewicz', c:'/javascript/posts/javascript-consultant-marek-publicewicz-1'},
  {o:'/javascript/learn-javascript', c:'/javascript/posts/learn-javascript-in-1-week'},
  {o:'/javascript/node-js-tutorial', c:'/node.js/posts/node-js-tutorial-step-by-step-guide-for-getting-started'},
  {o:'/javascript/teacher-aldo-bucchi', c:'/javascript/posts/javascript-teacher-aldo-bucchi-1'},
  {o:'/jquery/jquery-code-mentoring', c:'/jquery/posts/jquery-code-mentoring-1'},
  {o:'/js/javascript-framework-comparison', c:'/javascript/posts/angularjs-vs-backbonejs-vs-emberjs'},
  {o:'/js/jquery-ajax-post-tutorial', c:'/jquery/posts/jquery-ajax-post-tutorial'},
  {o:'/js/using-angularjs-yeoman', c:'/angularjs/posts/using-yeoman-with-angularjs'},
  {o:'/lob/expert-harry-zhang', c:'/lob/posts/expert-harry-zhang-1'},
  {o:'/lob/expert-leore-avidar', c:'/lob/posts/expert-leore-avidar-1'},
  {o:'/lob/expert-peter-nagel', c:'/lob/posts/expert-peter-nagel-1'},
  {o:'/mailjet/expert-orlando-kalossakas', c:'/mailjet/posts/expert-orlando-kalossakas-1'},
  {o:'/mailjet/SMTP-expert-florian-le-goff', c:'/smtp/posts/SMTP-expert-florian-le-goff-1'},
  {o:'/microsoft.net/expert-help-peder-rice', c:'/.net-4.0/posts/expert-help-peder-rice-1'},
  {o:'/mobile-checkout/mobile-checkout-expert-radu-spineanu', c:'/mobile-checkout/posts/mobile-checkout-expert-radu-spineanu-1'},
  {o:'/neo4j/introduction-graph-databases', c:'neo4j-graph-database-vs.-sql-what-you-need-to-know'},
  {o:'/nexmo-expert-asim-imtiaz', c:'/nexmo/posts/nexmo-expert-asim-imtiaz-1'},
  {o:'/nginx/extending-nginx-tutorial', c:'/nginx/posts/nginx-tutorial-developing-modules'},
  {o:'/nlp/keyword-extraction-tutorial', c:'/nlp/posts/nlp-keyword-extraction-tutorial-with-rake-and-maui'},
  {o:'/node-js/expert-help-peter-lyons/', c:'/node.js/posts/expert-help-peter-lyons-1'},
  {o:'/node.js/expert-ryan-schmukler', c:'/node.js/posts/expert-ryan-schmukler-1'},
  {o:'/node.js/expert-training-domenic-denicola', c:'/node.js/posts/expert-training-domenic-denicola-1'},
  {o:'/node.js/learn-node.js', c:'/node.js/posts/learn-nodejs-basics-in-just-5-minutes'},
  {o:'/node.js/node-js-code-review', c:'/node.js/posts/node-js-code-review-1'},
  {o:'/node.js/node-js-problem-solving', c:'/node.js/posts/node-js-problem-solving-1'},
  {o:'/node.js/training-support-alexandru-vladutu', c:'/node.js/posts/training-support-alexandru-vladutu-1'},
  {o:'/pair-programming-tips/google-hangouts-screenshare', c:'/pair-programming-tips/posts/google-hangouts-screenshare-1'},
  {o:'/pair-programming/our-future/', c:'/pair-programming/posts/our-future-1'},
  {o:'/pair-programming/pair-programming-tools-survey-jan-2014', c:'pair-programming-tools-2014-q1-survey'},
  {o:'/payment-processing/payments-integration-expert-justin-keller', c:'/payment-processing/posts/payments-integration-expert-justin-keller-1'},
  {o:'/performance-testing/load-testing-tools-tim-koopmans', c:'/load-testing/posts/load-testing-tools-tim-koopmans-1'},
  {o:'/php/developer-marton-kodok', c:'/php/posts/developer-marton-kodok-1'},
  {o:'/php/fatal-error-allowed-memory-size', c:'/php/posts/fixing-php-fatal-error-allowed-memory-size-exhausted'},
  {o:'/php/php-code-mentor-philip-thomas', c:'/php/posts/php-code-mentor-philip-thomas-1'},
  {o:'/php/php-code-mentoring', c:'/php/posts/php-code-mentoring-1'},
  {o:'/php/php-code-review', c:'/php/posts/php-code-review-1'},
  {o:'/php/php-expert-jorge-colon', c:'php/posts/php-expert-jorge-colon-1'},
  {o:'/php/php-freelancer-teacher', c:'/php/posts/php-freelancer-and-teacher-paul-sobocinski-1'},
  {o:'/php/setting-up-mamp-local-development-environment', c:'/php/posts/setting-up-mamp-local-development-environment-1'},
  {o:'/project-ramon-code-mentoring', c:'/ruby-on-rails/posts/project-ramon-code-mentoring-1'},
  {o:'/pubnub/developer-dave-nugent', c:'/pubnub/posts/developer-dave-nugent-1'},
  {o:'/pubnub/expert-ian-jennings', c:'/pubnub/posts/expert-ian-jennings-1'},
  {o:'/python/code-mentor-semion-sidorenko', c:'/python/posts/code-mentor-semion-sidorenko-1'},
  {o:'/python/django-expert-daniel-roseman', c:'/django/posts/django-expert-daniel-roseman-1'},
  {o:'/python/machine-learning-expert-alexandre-gravier', c:'/machine-learning/posts/machine-learning-expert-alexandre-gravier-1'},
  {o:'/python/python-code-mentoring-web-scraping', c:'/python/posts/python-code-mentoring-web-scraping-1'},
  {o:'/python/python-expert-josh-kuhn', c:'python/posts/python-expert-josh-kuhn-1'},
  {o:'/ruby-on-rails/agile-development-fernando-villalobos', c:'/ruby-on-rails/posts/agile-development-fernando-villalobos-1'},
  {o:'/ruby-on-rails/basics-shayon-mukherjee', c:'/ruby-on-rails/posts/basics-shayon-mukherjee-1'},
  {o:'/ruby-on-rails/buliding-faster-with-rails-code-mentors', c:'/ruby-on-rails-4/posts/building-faster-with-rails-code-mentors-1'},
  {o:'/ruby-on-rails/code-mentor-edward-anderson', c:'/ruby-on-rails/posts/code-mentor-edward-anderson-2'},
  {o:'/ruby-on-rails/continuous-deployment', c:'/ruby-on-rails/posts/continuous-deployment-1'},
  {o:'/ruby-on-rails/learning-rails-with-experts', c:'/ruby-on-rails/posts/learning-rails-with-experts-1'},
  {o:'/ruby-on-rails/performance', c:'ruby-on-rails-4/posts/rails-performance-what-you-need-to-know'},
  {o:'/ruby-on-rails/rails-code-mentoring', c:'/ruby-on-rails/posts/rails-code-mentoring-1'},
  {o:'/ruby-on-rails/rails-code-review', c:'/ruby-on-rails/posts/rails-code-review-1'},
  {o:'/ruby-on-rails/rails-consultant-kyle-decot', c:'/ruby-on-rails/posts/rails-consultant-kyle-decot-1'},
  {o:'/ruby-on-rails/rails-expert-multi-tenancy-author-ryan-bigg', c:'/ruby-on-rails/posts/rails-expert-multi-tenancy-author-ryan-bigg-1'},
  {o:'/ruby-on-rails/rails-ninja-adam-cuppy', c:'/ruby-on-rails-4/posts/rails-ninja-adam-cuppy-1'},
  {o:'/ruby-on-rails/rails-problem-solving', c:'/ruby-on-rails/posts/rails-problem-solving-1'},
  {o:'/ruby-on-rails/rails-teacher-backnol-yogendran', c:'ruby-on-rails/posts/rails-teacher-backnol-yogendran-1'},
  {o:'/ruby-on-rails/rails-testing-ramon-porter', c:'/ruby-on-rails/posts/rails-testing-ramon-porter-1'},
  {o:'/ruby-on-rails/rails-tutor-aaron-dufall', c:'/ruby-on-rails/posts/rails-tutor-aaron-dufall-1'},
  {o:'/ruby-on-rails/remote-pair-programming', c:'/ruby-on-rails/posts/remote-pair-programming-1'},
  {o:'/ruby-on-rails/ruby-experts-pedro-nascimento', c:'/ruby-on-rails/posts/ruby-experts-pedro-nascimento-1'},
  {o:'/ruby-on-rails/tmux-vim-rails-pair-programming-mark-simoneau', c:'/ruby-on-rails/posts/tmux-vim-rails-pair-programming-mark-simoneau-1'},
  {o:'/ruby-on-rails/trainer-erik-trautman', c:'/ruby-on-rails/posts/trainer-erik-trautman-1'},
  {o:'/ruby-on-rails/training-alok-tandon', c:'/ruby-on-rails/posts/training-alok-tandon-1'},
  {o:'/ruby-on-rails/training-obie-fernandez', c:'/ruby-on-rails/posts/training-obie-fernandez-1'},
  {o:'/ruby/ruby-problem-solving-for-sendwithus', c:'/ruby-on-rails/posts/ruby-problem-solving-for-sendwithus-1'},
  {o:'/ruby/tutor-naomi-freeman', c:'/ruby-on-rails/posts/tutor-naomi-freeman-1'},
  {o:'/rubymotion/code-mentor-mark-rickert', c:'/rubymotion/posts/code-mentor-mark-rickert-1'},
  {o:'/rubymotion/rubymotion-consultant-jack-watsonhamblin', c:'/rubymotion/posts/rubymotion-consultant-jack-watsonhamblin-1'},
  {o:'/rubymotion/rubymotion-trainer-amir-rajan', c:'/rubymotion/posts/rubymotion-trainer-amir-rajan-1'},
  {o:'/salesforce/expert-daniel-ballinger', c:'/salesforce/posts/expert-daniel-ballinger-1'},
  {o:'/search-engine/search-engine-expert-julien-lemoine', c:'/search-engine/posts/search-engine-expert-julien-lemoine-1'},
  {o:'/selenium/selenium-expert-daniel-davison', c:'/selenium/posts/selenium-expert-daniel-davison-1'},
  {o:'/sendgrid/sendgrid-salesforce-apex-library', c:'/sendgrid/posts/sendgrid-salesforce-apex-library-1'},
  {o:'/seo/help-steen-andersson', c:'/seo/posts/help-steen-andersson-1'},
  {o:'/seo/posts/5-seo-hacks-ive-learnt-while-consulting-in-san-francisco', c:'/seo/posts/5-seo-hacks-ive-learnt-while-consulting-in-san-francisco'},
  {o:'/seo/posts/if-you-are-blogging-for-seo-you-are-doing-it-wrong', c:'/seo/posts/if-you-are-blogging-for-seo-you-are-doing-it-wrong'},
  {o:'/seo/seo-best-practices', c:'/seo/posts/seo-best-practices-1'},
  {o:'/seo/seo-consultant-ehren-reilly', c:'/seo/posts/seo-consultant-ehren-reilly-1'},
  {o:'/seo/seo-expert-igor-lebovic', c:'/seo/posts/seo-expert-igor-lebovic-1'},
  // {o:'/seo/seo-focused-wordpress-infrastructure
  {o:'/seo/trainer-cort-tafoya', c:'/seo/posts/trainer-cort-tafoya-1'},
  {o:'/sinch/evangelist-christian-jensen', c:'/sinch/posts/evangelist-christian-jensen-1'},
  {o:'/smtp/sendgrid-smtp-expert-nick-woodhams', c:'/smtp/posts/sendgrid-smtp-expert-nick-woodhams-1'},
  {o:'/swift/building-swift-app-tutorial', c:'/swift/posts/swift-tutorial-building-an-ios-application-part-1'},
  {o:'/swift/building-swift-app-tutorial-2', c:'/swift/posts/swift-tutorial-building-an-ios-application–part-2'},
  {o:'/swift/building-swift-app-tutorial-3', c:'/swift/posts/swift-tutorial-building-an-ios-application-part-3'},
  {o:'/swift/complete-guide-to-swift', c:'/swift/posts/ultimate-guide-to-learning-swift-in-one-day'},
  {o:'/swift/learning-swift-tutorial', c:'/swift/posts/swift-a-quick-reference-guide'},
  {o:'/testing/learn-ruby-test-driven-development', c:'/testing/posts/learn-ruby-test-driven-development-1'},
  {o:'/translation/crowd-translation-code-mentor-vasco-pedro', c:'/translation/posts/crowd-translation-code-mentor-vasco-pedro-1'},
  {o:'/translation/crowd-translation-expert-joao-graca', c:'/translation/posts/crowd-translation-expert-joao-graca-1'},
  {o:'/twilio/twilio-code-mentor-jeff-linwood', c:'/twilio/posts/twilio-code-mentor-jeff-linwood-1'},
  {o:'/twilio/twilio-expert-roger-stringer', c:'/twilio/posts/twilio-expert-roger-stringer-1'},
  {o:'/typescript/expert-basarat', c:'/typescript/posts/expert-basarat-1'},
  {o:'/user-experience/ux-expert-alyssa-reese', c:'/user-interface/posts/ux-expert-alyssa-reese-1'},
  {o:'/wordpress/expert-help-eric-mann', c:'/wordpress/posts/expert-help-eric-mann-1'},
  {o:'/angularjs/code-mentor-tony-childs', c:'/angularjs/posts/angularjs-code-mentor-tony-childs-1'}

];


export default function(app) {

  var router = require('express').Router()

  for (var p of postCanonicals) {
    var slug = p.c.split('/')[3]
    routeCanonicalPost(router, app, p.o, slug)
  }

  return router

}

