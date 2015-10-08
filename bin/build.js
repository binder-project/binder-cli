var usage = require('../lib/usage.js')('build.txt')

module.exports = {
  name: 'build',
  command: build,
  options: [
    {
      name: 'build-server',
      boolean: false,
      abbr: 'b'
    },
    {
      name: 'api-token',
      boolean: false,
      abbr: 'a'
    }
  ]
}

function build(args) {

	if (args._.length === 0) return usage()

	console.log(args)

}