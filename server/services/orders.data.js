module.exports = {

	select: {
		listAdmin: {
			'userId': 1,
			'by': 1,
			'utc': 1,
			'total': 1,
			'owner':1
		}
	},

	query: {
		creditRemaining: function(userId) {
			return {  userId,
								'$and': [
										{'published' : { '$exists': true }},
										{'published': { '$lt': new Date() }}
								] }
		}
	},

	options: {
		ordersByDate: { sort: { 'utc': -1 } }
	}

}
