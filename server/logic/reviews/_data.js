const Views = {
  review:   '_id reviews stats',
  sub:     '_id name email avatar username auth.gh.login photos'
}

const Opts = {
  reviewParam: { select: `${Views.review} subscribed` },
  subscribedUsers: { select: Views.sub }
}

module.exports = { Views, Opts,


  Projections: ({md5,select}, {chain,view}) => ({

    review: d => 
      chain(d, 'posts.subscribedHash', 'posts.reviews', view.review)
    

    // slim: r => r
    // assign({
    //   _id: r._id,
    //   gave: r.val,
    //   said: r.said,
    //   replies: map(r.replies, rep => assign(rep, chain(rep.by,'byByte') )),
    //   votes: map(r.votes, v => assign(v, chain(v.by,'byByte')) )
    // }, chain(r.by,'byByte'))


  })


}
