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
      argString.push('<{0}> '.format(name))
      args.push(name)
    })
    program.command(name + ' ' + args.join(' '))
    program.description(endpoint.description)
    _.forEach(global.params, function (info, name) {
      program.option('-{0}, --{1}'.format(name[0], name), info.description)
    })
    program.action(function () {
      var argObj = {}
      var argList = _.values(arguments)
      _.forEach(_.range(args.length), function (i) {
        argObj[args[i]] = argList[i]
      })
      var options = argList.slice(-1)
      var path = endpoint.path.format(argObj)
      var url = urljoin(options.host + ':' + options.port, path)
      var requestOpts = {
        url: url,
        json: true,
        method: endpoint.request.method
      }
      var bodyFields = endpoint.request.body
      if (bodyFields) {
        requestOpts.body = _.pick(argObj, bodyFields)
      }
      if (endpoint.request.authorized) {
        requestOpts.headers = {
          'Authorization': options['api-key']
        }
      }
      console.log('\n')
      console.log(endpoint.msg.format(argObj) + '\n')
      request(requestOpts, { timeout: 1500 }, function (err, res, body) {
        var suggestions = ['you shouldn\'t be seeing the default message!']
        var msg = 'This is the default Binder CLI response'
        var displayFunc = console.log
        var globalErrors = protocol.global.response.error
        if (err) {
          displayFunc = console.error
          var error
          if (err.code === 'ETIMEDOUT') {
            error = globalErrors.timeout
          } else if (err.code === 'ECONNREFUSED') {
            error = globalErrors.refused
          } else {
            error = globalErrors.generic
          }
          msg = error.msg.format(options)
          suggestions = error.suggestions
        } else if (res.statusCode === subset.response.success.status) {
          msg = subset.response.success.msg.format(argObj)
        } else {
          var errorType = body.type
          if (errorType in subset.response.error) {
            error = subset.response.error[errorType]
            msg = body.error
            suggestions = error.suggestions
          } else {
            error = globalErrors.generic
            msg = error.msg
            suggestions = error.suggestions
          }
        }
        displayFunc(msg)
        _.forEach(suggestions, function (suggestion) {
          displayFunc(' - Possible fix: ' + suggestion)
        })
        displayFunc('\n')
      })
    })
  })
}
