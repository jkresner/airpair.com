airpair.com
===========


Developing
==========

Whitespace
----------
Let's keep whitespace out of the repo. To help with this:

 - Make sure your IDE/editor is setup to use the .editorConfig file (http://editorconfig.org/)
 - Enable git the pre-commit hooks to stop whitespace going in. In your local repo renaming
   - /.git/hooks/pre-commit.sample
   - to
   - /.git/hooks/pre-commit


Running Tests
=============

##### 1. /test/server

Runs in node with mocha

    mocha test/server/bootstrap.js

For git pre-push hook to ensure tests pass before pushing, do this:

    cd .git/hooks
    ln -nsf ../../build/git-hooks/pre-push

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
