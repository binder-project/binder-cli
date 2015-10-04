var usage = require('../lib/usage.js')('build.txt')

module.exports = {
  name: 'build',
  command: handleBuild,
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

function handleBuild(args) {

	if (args._.length === 0) return usage()

	console.log(args)

}