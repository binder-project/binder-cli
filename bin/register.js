var usage = require('../lib/usage.js')('register.txt')
var request = require('request')

module.exports = {
  name: 'register',
  command: register,
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

  if (args._.length === 0) return usage()
  var image = args._[0]

  var conn = {
    url: 'http://' + args.server + '/templates',
    method: 'POST',
    headers: {'Authorization': 'token ' + args.token},
    json: {"name": image, "image-name": image}
  }

  var callback = function(error, response, body) {
    if (error) {
      console.log('error registering template:')
      console.log(error.code)
    } else {
      if (response.statusCode === 201) {
        console.log('template registered')
      } else {
        console.log('failed to register template, got message:')
        console.log(body.message)
      }
    }
  }

  request(conn, callback)

}