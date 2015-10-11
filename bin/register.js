var request = require('request')
var usage = require('../lib/usage.js')

module.exports = {
  name: 'register',
  command: register,
  help: 'Register a template for future deployment',
  options: [
    {
      name: 'server',
      boolean: false,
      abbr: 's'
    },
    {
      name: 'token',
      boolean: false,
      abbr: 't'
    }
  ]
}

function register(args) {

  if (args.help || args._.length === 0) return usage(this.options)

  var image = args._[0]

  var conn = {
    url: 'http://' + args.server + '/templates',
    method: 'POST',
    headers: {'Authorization': 'token ' + args.token},
    json: {"name": image, "image-name": image}
  }

  var callback = function(error, response, body) {
    if (error) {
      console.log('Error registering template:')
      console.log(error.code)
    } else {
      if (response.statusCode === 201) {
        console.log('Template registered')
      } else {
        console.log('Failed to register template, got message:')
        console.log(body.message)
      }
    }
  }

  request(conn, callback)

}