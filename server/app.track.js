module.exports = ({select,inflate,chain}) => ({

  firstReq: d => select(d, 'url status'),

  login: d => assign(select(d, 'type email'),{name:d.user.name}),

  signup: d => ({name:d.user.name}),

  link: d => ({name:d.user.name,provider:d.provider})

  // setPass: r => [`post:new`, assign(by(r), _.pick(r,'title'))],

  // resetPass: r => [`post:new`, assign(by(r), _.pick(r,'title'))],

})
