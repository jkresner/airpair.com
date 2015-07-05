var higherSplit = 0.6
var lowerSplit = 0.5

var base = {
  // opensource: 20,
  private: 30
}

// var weight = {
//   // opensource: { opensource:0, private:20 },
//   private: { opensource:-20, private:0 },
// }

var fns = {
  // getRelativeBudget(budget, requestPricing, pricing) {
  //   return budget - (base[requestPricing]-base[pricing])
  // },
  // getMaxExpertRate(budget, pricing) {
  //   return budget - base[pricing]
  // },
  addSuggestedRate(request, suggestion) {
    suggestion.suggestedRate = calcSuggestedRate(request.budget, suggestion.expert)

    // if (isCust) request.base = base
  }
}

// budget: request.rate
// requestPricing: type of rate (open-source, private, nda)
// pricing:
// NOTE suggestedRate is the developers rate
// not including airpair's margin
function calcSuggestedRate(requestBudget, expert)
{
  var e = expert
  // var r = {}
  // for (var pricing of ['opensource','private','nda'])
  // {
    // get the base margin for the type of pricing
    var baseMargin = base['private']
    if (requestBudget > 150)
      baseMargin = baseMargin + 10

    // if the user was to change their choice between opensource / private
    // var relativeBudget = fns.getRelativeBudget(requestBudget, 'private', pricing)

    // start with defaults rate
    var r = { expert: e.rate, total: requestBudget }

    // subtract margin from total budget to get what's left for the expert
    var expertBudget = requestBudget - baseMargin

    // if (expertBudget < 40 && e.rate >= 40) expertBudget = 40

    if (expertBudget > e.rate) {
      // split the difference with expert
      var extra = expertBudget - e.rate
      var split = extra*higherSplit
      r.expert = e.rate + split*.5
      r.total = r.expert + baseMargin + split*.5
    }

    if (expertBudget < e.rate) {
      // split the difference with expert
      // difference = e.rate - expertBudget
      r.expert = expertBudget //- difference*lowerSplit
      r.total = r.expert + baseMargin
    }

    // we could do more complex things on the split between
    // the expert and airpair
    // if (pricing == 'nda') {
    //   // give the expert $20 more p.h. for nda
    //   pr.expert += 20
    // }

    // r[pricing] = pr
    // $log 'baseMargin', baseMargin, 'expertBudget', expertBudget, 'expertRate', e.rate, 'suggestedExpertRate', pr.expert, 'suggestedTotal', pr.total
  // }

  return  r
}

export default fns


  //   ## Biased score to get the developer booked

  //   ## Futures

  //   ## karma / how many times that developer has been booked

  //   ## developer klout

  //   ## global variables on liquidity vs profit

  //   ## how quickly since the suggestion is the expert responding

  // calcSuggestedBookmeRates: (request, expert) ->
  //   # $log 'calcSuggestedBookmeRates.in', expert
  //   # $log 'calcSuggestedBookmeRates.in', request.pricing
  //   pricing = request.pricing
  //   weight = @weight[pricing]
  //   rake = expert.bookMe.rake
  //   rake = 10 if !rake?
  //   total = request.budget
  //   # $log 'bookme.calc', pricing, rake, total, weight, expert.bookMe
  //   r = bookMe: true
  //   r.opensource =
  //     total: total+weight.opensource
  //     expert: @_getExpertByRake total+weight.opensource, rake
  //   r.private =
  //     total: total+weight.private
  //     expert: @_getExpertByRake total+weight.private, rake
  //   r.nda =
  //     total: total+weight.nda
  //     expert: @_getExpertByRake total+weight.nda, rake
  //   # $log 'bookme.r', r
  //   r
  //   # offline:
  //   #   total: customerRates.offline
  //   #   expert: customerRates.offline * expertBookMe.rake


  // _getExpertByRake: (total, rake) =>
  //   total - (total*rake/100)








