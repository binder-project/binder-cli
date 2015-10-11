var cliclopts = require('cliclopts')
var builder = require('binder-build-core')
var usage = require('../lib/usage.js')
var logger = require('../lib/logger.js')

module.exports = {
  name: 'build',
  command: build,
  help: 'Build an environment from a specification',
  options: [
    {
      name: 'server',
      boolean: false,
      abbr: 's',
      help: 'Address of server'
    },
    {
      name: 'token',
      boolean: false,
      abbr: 't',
      help: 'Token for authentication'
    },
    {
      name: 'local',
      boolean: true,
      abbr: 'l',
      default: false,
      help: 'Whether to perform builds locally'
    }
  ]
}

function build(args) {

  if (args.help || args._.length === 0) return usage('build', '<repo>', this.options)
  var repo = args._[0]
  var log = new logger('build')

  if (args.local) {

    log.message('Starting local build for : ' + repo)
    var build = new builder()
    build.build(repo)

  }
  
  

	//if (args._.length === 0) return usage()

	//console.log(args)

}