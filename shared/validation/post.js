export function update(user, original, update)
{
  var isEditor = _.contains(user.roles, 'editor')
  var isOwner = _.idsEqual(original.by.userId, user._id)

  if ( !isEditor && !isOwner )
    return 'Post must be updated by owner'
  if (original.published && !isEditor)
    return 'Must be editor to update a published post'
}


export function publish(user, original, update)
{
  var isEditor = _.contains(user.roles, 'editor')

  if (!isEditor)
    return 'Post must be published by an editor'
  if (!update.publishReady)
    return "Post must be marked publishReady by author"
  if (!update.slug)
    return 'Post must have slug to be published'
}


export function deleteById(user, original)
{
  var isEditor = _.contains(user.roles, 'editor')
  var isOwner = _.idsEqual(original.by.userId, user._id)

  if ( !isEditor && !isOwner )
    return 'Post must be deleted by owner'
  if (original.published && !isEditor)
    return 'Must be editor to delete a published post'
}

export function submitForReview(user, original, update)
{
  var isOwner = _.idsEqual(update.by.userId, user._id)
  if (!isOwner)
    return 'Post can only be submitted for review by its owner'
}

export function submitForPublication()
{
  console.log("(validation) submitForPublication")
}

export function addReview(user, postId, review)
{
  console.log("(validation) addReview", user, postId, review)
}
