var by = r => ({ autr: `${r.user.auth.gh.login}:${r.user.name}` })

module.exports = ({select,inflate,chain}) => ({

  firstReq: d => select(d, 'url status'),

  login: d => assign(select(d, 'type email'),{name:d.user.name}),

  signup: d => ({name:d.user.name}),

  link: d => ({name:d.user.name,provider:d.provider}),

  logout: d => ({name:d.user.name}),

  // setPass: r => [`post:new`, assign(by(r), _.pick(r,'title'))],

  // resetPass: r => [`post:new`, assign(by(r), _.pick(r,'title'))],

  createPost: r => [`post:new`, assign(by(r), _.pick(r,'title'))],

  updateSubmit: r => [`post:submit`, assign(by(r), _.pick(r,'_id','title','slug'))],

  updatePublish: r => [`post:publish`, assign(by(r), _.pick(r,'_id','title','slug'))],

  updateSync: r => [`post:sync`, assign(by(r), _.pick(r,'_id','title'))],

  fork: r => [`post:fork`, assign(by(r), _.pick(r,'_id','title'))],

  deletePost: r => [`post:delete`, assign(by(r), _.pick(r,'_id','title'))],

})
