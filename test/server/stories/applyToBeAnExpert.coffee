
module.exports = (expertData, done) ->
  expertData.tags = expertData.tags || [FIXTURE.tags.angular]
  GET "/experts/me", {}, (meExpert) ->
    d = _.extend(meExpert, expertData)
    PUT "/users/me/username", {  username: expertData.username || expertData.userKey }, ->
      PUT "/users/me/initials", { initials: expertData.initials }, ->
        PUT "/users/me/location", expertData.location || FIXTURE.wrappers.localization_melbourne.locationData, ->
          PUT "/users/me/bio", { bio: expertData.bio || 'a bio'}, ->
            # $log('updating expert'.cyan, meExpert._id, d)
            if (meExpert._id)
              PUT "/experts/#{meExpert._id}/me", d, done
            else
              POST "/experts/me", d, done
