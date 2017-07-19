// var TO = ['post','post.review','post.section',
// 'post.question', // replying to a post question
// 'post:question' // replying to a post AS a question
// ]

module.exports = ({ Id }, { required, index }) => ({


  by:            { type: Id, ref: 'User', required, index },
  said:          { type: String, required },

  // uri:        { type: String},
  // to:            { type: String, enum: TO },
  // prev:          { type: Id, ref: 'Reply' },  // if a reply is edited, linked list history


})
