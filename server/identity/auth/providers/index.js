import * as Provider from './base'
import UserService from '../../../services/users'

var googleShake = Provider.init('google', (req, provider, profile, done) => {
  new UserService().upsertProviderProfile(req.user, provider, profile, done)  
})

$log('googleShake', googleShake)

export var google = { shake: googleShake }