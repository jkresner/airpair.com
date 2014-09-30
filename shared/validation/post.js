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