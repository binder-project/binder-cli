var cliclopts = require('cliclopts')

module.exports = function (name, extra, options) {
	var out = 'Usage: binder ' + name + ' ' + extra + ' [options]\n\nOptions:\n'
	return console.log(out + cliclopts(options).usage())
}