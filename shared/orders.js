module.exports = {

	linesWithCredit: function(orders)
	{
		var lines = []
		for (var order of orders) {
			for (var li of order.lineItems)
			{
				if (li.type == 'credit' && li.info.remaining > 0) lines.push(li)
			}
		}
		// return _.sort(lines, (li) => li._id)
		return lines
	},

	getAvailableCredit: function(lines)
	{
		if (lines.length == 0) return 0
		var remaining = []
		for (var li of lines) remaining.push(li.info.remaining)
		return _.reduce(remaining, function(memo, num){ return memo + num; }, 0)
	},

}
