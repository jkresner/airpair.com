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
