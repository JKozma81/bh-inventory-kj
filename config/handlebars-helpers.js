module.exports = {
	ifeq: function(a, b, options) {
		if (a === b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	ifNoteq: function(a, b, options) {
		if (a !== b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	concat: function(a, b) {
		return a + b;
	}
};
