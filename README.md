airpair.com Deploy checklist
===========

TRACKED
[ ] landing      /   
[ ] view:post    /reactjs/posts/reactjs-a-guide-for-rails-developers 
    2ximpressions 
[ ] landing      /software-experts
[ ] issue        /asdfasdfd
[ ] landing      /javascript
[ ] view:post    /js/javascript-framework-comparison
    2ximpressions 
[ ] view:ad      click()
[-] issue [Crawl:badBot]
[ ] event        login
    aliases impressions
    aliases views
    aliases events


EMAIL NOTIFICATIONS
[ ]-- [Errors]
[-]-- [Crawl:non-badBot]


DEPLOY PRIMARY - STEPS
[ ]- run [analytics] field name migrate scripts
[ ]- Deploy static
[ ]- Deploy airpair.com
[ ]-- update live config
[ ]-- deploy
[ ]-- remove unused config
[ ]-- do smoke tests


CRITICAL ADSERVE FEATURES
[ ]-- Run through pages
[ ]- Deploy author


- AUTHD NEW
[ ]- /software-experts 
[ ]- /account
[ ]- /home
[ ]- /find-an-expert
[ ]- /billing
[ ]- /billing/book/55007705d8457a0c007dfdbe
- AUTHD WHALE
[ ]- /home
[ ]- /find-an-expert
[ ]- /billing
[ ]- /billing/book/55007705d8457a0c007dfdbe
[ ]- /job/:id
[ ]- /billing/book/:expert/:request
[ ]- /bookings/:id
- ADM
[ ]- pipeline
[ ]- request
[ ]- match
[ ]- bookings
[ ]- booking
[ ]- order
[ ]- orders
[ ]- user
[ ]- experts
[ ]- expert
[ ]- redirects

- - - - - - - - - - - -


DEPLOY SECONDARY - STEPS
[ ]- Fix reviews data
[ ]- consult


DOUBLE TEST
[ ]- Impressions
[ ]-- Clicks tracking properly
[ ]- HIGH
[ ]-- Important pages social share well
[ ]--- head:titles
[ ]--- head:keywords
[ ]--- head:canonical
[ ]--- head:ogImage
[ ]--- head:ogDescription

CRITICAL AUTHOR FEATURES
[ ]-- Compiling
[?]-- Pass existing tests

BROWSE BOT
[ ]- mw.trace stops at noBot
[ ]- track.issue crawl


OTHER APCOM FEATURES TO TEST
[ ]- Redirects
[ ]-- 301           /me => /account
[ ]-- 301           /setting => /account
[ ]-- 301           /hire-developers => landing page about airpair
[ ]-- Canon         /js/javascript-framework-comparison
[ ]-- Rewrite       /js/javascript-framework-comparison%E2%80%A6
[ ]--- Posts index
[ ]--- Post
[ ]--- Similar post
[ ]--- Login
[ ]----- POSTReview
[ ]----- POSTReview update
[ ]----- [BUGHUNT] Review
[ ]- custom formatter 
[-]-- EVENT 
[-]--- [paymethod-remove]
[-]--- [login]
[-]--- [login-fail]
[-]--- [logout]
[-]-- EVENT + EMAIL
[-]--- [paymethod-create]
[-]--- [order]
[-]--- [booking]



===========================================================

NON-CRITICAL FEATURES
[ ]----- POSTReview delete
[ ]----- POSTReview upvote/downvote
[ ]-- mw.reqDirty based on cloudflare spoofing detection
[ ]-- VIEW
[ ]---- Workshop
[ ]---- Job
[-]-- /book/toddmotto
[-] book from request
[ ]-- /adm/posts
[ ]-- Server rendered post comments
[ ]-- View POST Blank as landing (/code-review + /code-mentoring + /scream.js)
[ ]- Redirects
[-]-- 301           /angular/posts => /learn-angularjs
[-]-- 301           /posts/tag/nginx => /learn-nginx
[-]-- ???           /pair-programming
[-]-- ???           /find-an-expert
[-]-- ???           /be-an-expert
[ ]-- SPIN flow
[ ]-- cmd/build/sitemap
[ ]-- cmd/build/robot.txt
===
::requests
- new 
- review (as customer)
-- add timezone
- edit
- list (history)
-- delete (incomplete)
::billing
-- add card
- top-up
- item
-- suggest time
- history (un-finished)
- list (in-review)
- fork
- contributors
- review (widget)
====


AIRPAIRCOM CODE
[✓]- Review wishlist
[ ]--- remove global.util in app.js + _.wrapFnList
[-]--- clean out /shared/validations /shared/mail /shared/util

MEANAIR CODE
[✓]- Review wishlist
[ ]-- shared
[ ]--- browser proof / no ES6

DEPOY
[✓]- Stop [adserve] [author] [consult] apps
[✓]- Disable reviews / comments temporarily
[✓] - Modules tests run, code committed + published
[✓]   shared       .6.3   
[✓]   scream       .6.4
[✓]   middleware   .6.4
[✓]   server       .6.4
[✓]   model        .6.4-rc
[✓]   auth         .6.4
[ ]   apcom        .6.4
[✓]- Backup most recent [domain] + [analytics]

