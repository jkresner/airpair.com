module.exports = [
  {
    "_id" : "54ddc48fa779e09fc45b3b89",
    "type" : "md-file",
    "key" : "post-repo-readme",
    "description" : `Used for README.md for repos backing AirPair posts`,
    "markdown" : `## AirPair Social Authoring

### Thank you

Thanks for contributing content to [AirPair's community posts section](https://www.airpair.com/posts). This post can be edited at:

https://www.airpair.com/posts/edit/{{_id}}

## Licensing of Content

This post was originally authored by {{by.name}}. Unless some form of monetary exchange has occured
between {{by.name}} and AirPair inc., the ***owner*** including intellectual property rights
belong to {{by.name}}. If a finacial transaction has occured between AirPair inc. and {{by.name}},
AirPair inc. is the legal owner of this content.

Copyright and intellectual property right are exclusively held by **the owner** of this content.
Under no circumstances do contributions grant co-ownership rights. This content may not be
published anywhere other than airpair.com without the owners permission.

## Author Instructions

#### Editing

All edits are tracked via this GitHub repo. You can use the AirPair editor to
save changes back to this repo, or edit the markdown file with any tool of your choice.

#### Accepting contributions

All contributions come in the form of Pull Requests. Use GitHub to view and
merge or reject Pull Requests.

#### Updating your post on AirPair

AirPair does not automatically sync with this repo. Propagating HEAD is a
manual process which you can do, by clicking "Publish" during the community review phase.
Once your post is fully published, updating AirPair from this repo will
require an AirPair user with editor permissions.

## Contributor Instructions

#### Editing

Before you start editing, if it's been more than a few hours since you forked this post,
we highly recomment updating your fork so not to suggest edits on an old version of the post.

Edit your fork with the tool of your choice and then use GitHub to create a pull request from you
fork with the original repo as your base.
`
  },
  {
    "_id" : "54ddc48fa779e09fc45b3b99",
    "type" : "mail",
    "key" : "signup-100k-post-comp",
    "description" : "Used for signup email when new AirPair user via 100k posts comp cta",
    "subject": "AirPair - $100k Post Competition Signup Confirmation",
    "markdown" : `Hi {{ firstName }},

Welcome to AirPair, the community of Developers helping Developers.

Please set your account password at the following link:

https://www.airpair.com/me/password?token={{ hash }}

Thanks,

The AirPair Team
http://twitter.com/airpair
`
  }
]
