var _ = require('lodash')
var request = require('request')
var urljoin = require('url-join')
var format = require('string-format')
format.extend(String.prototype)

module.exports = function (program, api, protocol) {
  var subset = protocol[api]
  _.forEach(subset, function (endpoint, name) {
    var argString = ' '
    var args = []
    _.forEach(endpoint.params, function (info, name) {
      argString += ('<{0}> '.format(name))
      args.push(name)
    })
    var cmd = program.command(_.kebabCase(name) + ' ' + argString)
    cmd.description(endpoint.description)
    _.forEach(protocol.global.params, function (info, name) {
      cmd.option('-{0}, --{1} <{2}>'.format(name[0], name, name), info.description)
    })
    cmd.action(function () {
      var argObj = {}
      var outerArgs = arguments
      _.forEach(_.range(args.length), function (i) {
        argObj[args[i]] = outerArgs[i]
      })
      var options = arguments[arguments.length - 1]
      var path = endpoint.path.format(argObj)
      if (!_.startsWith(options.host, 'http://')) {
        options.host = 'http://' + options.host
      }
      var url = urljoin(options.host + ':' + options.port, path)
      var requestOpts = {
        url: url,
        json: true,
        method: endpoint.request.method,
        timeout: 1500
      }
      var bodyFields = endpoint.request.body
      if (bodyFields) {
        requestOpts.body = _.pick(argObj, bodyFields)
      }
      if (endpoint.request.authorized) {
        requestOpts.headers = {
          'Authorization': options.apiKey
        }
      }
      console.log('\n ' + endpoint.msg.format(argObj) + '\n')
      request(requestOpts, function (err, res, body) {
        var suggestions = []
        var msg = 'This is the default Binder CLI response'
        var displayFunc = console.log
        var globalErrors = protocol.global.response.error
        var isError = false

        if (err) {
          isError = true
          displayFunc = console.error
          var error
          if (err.code === 'ETIMEDOUT') {
            error = globalErrors.timeout
            msg = error.msg.format(options)
          } else if (err.code === 'ECONNREFUSED') {
            error = globalErrors.refused
            msg = error.msg.format(options)
          } else {
            error = globalErrors.generic
            msg = error.msg.format({ error: err })
          }
          suggestions = error.suggestions
        } else if (res.statusCode === 403) {
          isError = true
          displayFunc = console.error
          msg = globalErrors.unauthorized.msg
          suggestions = globalErrors.unauthorized.suggestions
        } else if (res.statusCode === endpoint.response.success.status) {
          var fullObj = _.merge({}, argObj, { 
            results: JSON.stringify(body, null, 2)
          })
          msg = endpoint.response.success.msg.format(fullObj)
        } else {
          isError = true
          var errorType = body.type
          if (errorType in endpoint.response.error) {
            error = endpoint.response.error[errorType]
            msg = body.error
            suggestions = error.suggestions
          } else {
            error = globalErrors.generic
            msg = error.msg.format({ error: JSON.stringify(body) })
            suggestions = error.suggestions
          }
        }

        msg = (isError) ? 'Error: ' + msg : msg
        displayFunc(' ' + msg)
        _.forEach(suggestions, function (suggestion) {
          displayFunc('  - Possible fix: ' + suggestion)
        })
        displayFunc('\n')
      })
    })
  })
}
