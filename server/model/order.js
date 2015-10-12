module.exports = ({ Id, Enum, Touch },
  { asSchema, required, trim }) => {


var LineItem = asSchema({
  type:             { type: String, required, enum: Enum.ORDER.LINE_TYPE },
  qty:              { type: Number, required },
  unitPrice:        { type: Number, required },  // Amount paid per unit
  profit:           { type: Number, required },  // Margin taken by AirPair
  total:            { type: Number, required },  // Amount paid by customer
  balance:          { type: Number, required },  // Amount effecting customers balance
  info:             { type: {}, required },      // Arbitrary info about the line item
  bookingId:        { type: Id, ref: 'Booking' },
  suggestion:       { type: {} }   // backwards compatibal with v0
  // balanceRemaining: { type: Number }, // Amount effecting customers balance
})


LineItem.index({ 'info.expert._id':1 },{ name: "ExpertPayoutsIndex"})


return asSchema({

  // The user the order belongs to
  userId:         { type: Id, ref: 'User', required },

  // The user that create the order (often same as userId, but can be an admin)
  by:             { type: {}, required },

  lineItems:      [LineItem],

  // when the order was made
  utc:            { type: Date, 'default': Date },

  // Total amount paid by customer
  total:          { type: Number, required },

  // How it was paid for, if null probably credit given by an admin
  payMethodId:    { type: Id, ref: 'Paymethod' },

  // Info on payment
  payment:        { type: {}, required },

  // AirPair staff member watching the transaction
  owner:          { type: String, 'default': '' },

  //-- PAYG booking are calculated at time of purchase
  //-- Membership are calculated at time of purchase
  //-- Package orders always start with 0 and update as experts are booked or expires
  //-- Credit orders always 0 and updated as experts are booked or expires
  profit:         { type: Number, required },

  // Optionally link order to request
  requestId:      { type: Id, ref: 'Request' }

})

}
