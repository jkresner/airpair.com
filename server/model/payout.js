module.exports = ({ Id, Enum },
  { asSchema, required }) =>


asSchema({

  // The user the payout belongs to
  userId:          { type: Id, ref: 'User', required },

  //
  lines: [{
    order: {
      _id:         { type: Id, ref: 'Order', required },
      lineItemId:  { type: Id, ref: 'LineItem', required },
      by:          { type: {}, required },
    },
    total:         { type: Number, required },  // Amount paid outs
    info:          { type: {}, required }, // Copy of original order.lineItem.info
    type:          { type: String, required, enum: Enum.PAYOUT.LINE_TYPE }
  }],

  // Total amount paid out
  total:           { type: Number, required },

  // How it was paid out
  payMethodId:     { type: Id, ref: 'PayMethod', required },

  // Info on payment
  payment:         { type: {}, required }

  // fee ?

})
