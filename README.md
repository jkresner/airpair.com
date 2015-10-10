airpair.com
===========

auth
- login
-- google
-- email / password
-- send password reset
- signup
-- google

user
- set password
- account
-- user info
-- send email verification
-- verify email
- settings
-- maillists
-- send password reset
-- logout

adm 
- pipeline
- bookings
- experts
- orders
- users
- redirects

billing
- book
- deal
- ? experts
- top-up
- welcome (history)

bookings
- item
- history (un-finished)

dashboard
-- recent bookings
-- recent requests
-- rebook experts

expert
- office
- bookings
- payouts
- be-an-expert

matchmaking
- item
- list

posts
- list (all)
- list (in-review)
- list (tag)
- create (info)
- edit (editor)
- submit (create repo)
- fork
- publish
- contributors
- review (widget)

post
- item
- review (widget)

requests
- list (history)
- new 
- edit
- review

tags
- /angular


v2.0.0 ux
---------

Header
/hire-developers      => landing page about airpair
/softwhare-expert     => banner or info up to the top about airpair
/consult              => goes to consult.airpair.com homepage

Home
- Add more technologies

Software Experts
- Improve page

Dashboard
- Make it easier to make a request

Login (+ signup)
- Email for team setup


Hangout Info
============

1. Be prepared for serious frustration. The Google Hangout API is powerful, but painfully awkward.

2. Create an app within the Google API console. Currently, this is only supported in the old version.
  * Find the old version by first going to https://code.google.com/apis/console. You will immediately be redirected to *the new Google Developers Console*. Click on the "Prefer the old console Go back" link at the top.
  * Follow the instructions at https://developers.google.com/+/hangouts/getting-started until you get to step 6. Copy `public/hangout/hangoutApp.xml` to a public facing URL and enter it instead.
3. Enter your new app id as an environment variable `AIRPAIR_HANGOUT_APP_ID`. Without this, you will be using the production hangout app.

The 'Enter a hangout' link at the bottom of the screen never worked for me. I was able to load a private app sometimes using the instructions at https://developers.google.com/+/hangouts/running#running-private but for a long time the Developer tab was missing. I ended up just marking the app as public; this requires you to be Chrome Web Store verified. I think this costs $10 or something along those lines.

Google caches the results of your hangoutapp.xml file making iterative development of it painful. It's also a nuisance to copy your XML file whenever you make a change. For this reason, most of the hangout app lives in `index.html`, `index.css`, and `index.js` in `public/hangout`. Most changes shouldn't require modification of `hangoutApp.xml`. Modify the iFrame URL to point to localhost:9001 so the iFrame loads from your localhost. This must be served over https or it will be denied because some cross-domain security issues. I ran a simple node.js proxy server https://github.com/cameronhunter/local-ssl-proxy to deal with this.

## Hangout Development Tips

* Rather than start a new hangout every time, reload the hangout frame w/ right-click, reload frame
* You can debug the javascript code from the XML file by entering the __gadget_1 frame in the Developer console (initially says "\<Top Frame\>")
* You can debug the javascript code in the iFrame by entering the iFrame (index.html) frame.
