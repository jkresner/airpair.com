module.exports = {

  htmlHead_tag: {
    "_id" : ObjectId("596fa662520057ce539bd07c"),
    "type": "html-head",
    "key": "page:tag-meta",
    "part": {
      "ogDescription": "Learn {{name}}",
      "ogImage": "https://static.airpair.com/img/software/{{slug}}.png",
      "ogType": "technology",
      "ogUrl": "https://www.airpair.com{{url}}",
      "ogTitle": "{{name}} Programming Guides and Tutorials from Top {{short}} Developers and expert consultants",
      "title": "{{name}} Programming Guides and Tutorials from Top {{short}} Developers and expert consultants",
      "canonical": "https://www.airpair.com{{url}}"
    }
  },

  post_readme: {
    "_id" : ObjectId("54ddc48fa779e09fc45b3001"),
    "type" : "md-file",
    "key" : "repo:post-readme",
    "description" : "Used for README.md for repos backing AirPair posts",
    "part": {
      "raw": "## Developer Community Content on [AirPair.com](https://www.airpair.com/)\n\n[This post was submitted and published on AirPair by {{by.name}} ({{by.social.gh.username}})\n ![{{slug}}](https://www.airpair.com/posts/thumb/{{_id}})](https://www.airpair.com/posts/review/{{_id}})\n\nContent on AirPair is stored using git so we can collaboratively improve it using Pull Requests.\n\n### To edit / contribute\n\n#### Manually\n\n1. Fork this post\n2. Edit your fork's `post.md` file on the `edit` branch\n3. Create a pull request from your fork's `edit` branch to the parent repo's `edit` branch\n\n** ***Please do not merge the `edit` branch into `master`!***\n\n#### The easy way\n\n1. [Fork this post on AirPair\n![Fork on AirPair](https://airpair.github.io/posts/fork.png)\n](https://www.airpair.com/posts/fork/{{_id}})\n\n2. [Edit on AirPair  using the live editor\n![Edit on AirPair](https://airpair.github.io/posts/edit.png)\n](https://www.airpair.com/posts/edit/{{_id}})\n\n3. [Create one-click Pull Requests from the live editor\n![Pull Request on AirPair](https://airpair.github.io/posts/pr.png)\n](https://www.airpair.com/posts/edit/{{_id}})\n\n### Accepting / merging contributions\n\nAll contributions come in the form of Pull Requests. Use GitHub to view and merge or reject Pull Requests.\n\n### Publishing\n\nAirPair does not automatically \"sync\" with the master repo. As an author you may sync your post while it is still in community review. Once fully published, find an editor in AirPair chat to sync HEAD with the live version published on airpair.com\n\n## Licensing of Content\n\nContent submitted to AirPair with no monetary exchange belongs to the author. If a financial exchange has occured between the author and AirPair, AirPair assumes ownership of this content. This content may not be published anywhere other than airpair.com without the owners consent.\n\nContributors are granted rights to copy this content for the purpose of contributing, however under no circumstances do contributions grant co-ownership rights with the owner of this content.\n"
    }
  }

}
