module.exports = {
	ifeq: function (a, b, opts) {
		if (a === b) {
			return opts.fn(this);
		}
		return opts.inverse(this);
	},

	ifeqand: function (a, b, c, d, opts) {
		if (a === b && c === d) {
			return opts.fn(this);
		}
		return opts.inverse(this);
	},

	ifNoteq: function (a, b, options) {
		if (a !== b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	json: function (context) {
		return JSON.stringify(context);
	},

	times: function (n, block) {
		var accum = '';
		for (var i = 1; i < n + 1; ++i)
			accum += block.fn(i);
		return accum;
	},

	concat: function (a, b) {
		return a + b;
	}
};
