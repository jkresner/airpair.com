airpair.com checklist
===========

[ ]- Fix posts
     - stats
     - author images to be fully qualified
[ ]- Reviews!
     - load in disqus data
[ ]- Deploy author


https://medium.com/women-who-code-community/first-steps-getting-started-as-a-freelancer-8556ad4fb987


Content take over
- https://www.airpair.com/node.js/learn-node.js

TRACKED
[ ] issue        /asdfasdfd
[-] issue [Crawl:badBot]
[ ] event        login
    aliases impressions
    aliases views
    aliases events


EMAIL NOTIFICATIONS
[ ]-- [Errors]
[-]-- [Crawl:non-badBot]


DEPLOY PRIMARY - STEPS
[ ]-- remove unused config


- AUTHD NEW
[ ]- /account
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

- - - - - - - - - - - -


DEPLOY SECONDARY - STEPS
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
[ ]-- 301           /settings => /account
[ ]-- 301           /hire-developers => landing page about airpair
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
[ ]---- Job
[-]-- /book/toddmotto
[-] book from request
[ ]-- View POST Blank as landing (/code-review + /code-mentoring + /scream.js)
[ ]- Redirects
[-]-- 301           /angular/posts => /learn-angularjs
[-]-- 301           /posts/tag/nginx => /learn-nginx
[-]-- ???           /pair-programming
[-]-- ???           /find-an-expert
[-]-- ???           /be-an-expert
[ ]-- SPIN flow
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
[ ]--- remove global.util in app.js
[-]--- clean out /shared/validations /shared/mail /shared/util

MEANAIR CODE
[✓]- Review wishlist
[ ]-- shared
[ ]--- browser proof / no ES6
