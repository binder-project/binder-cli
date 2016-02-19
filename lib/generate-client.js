var _ = require('lodash')
var request = require('request')
var jsonfile = require('jsonfile')
var urljoin = require('url-join')
var format = require('string-format')
format.extend(String.prototype)

var makeDocstring = function (api, specName, spec) {
  // TODO add parameter descriptions to the docstring
  return spec.description 
}

var makeSpecFunc = function (api, name, spec) {
  return function (opts, cb) {
    // if any arguments have special handling according to their types, do that here
    _.forEach(api.global.params, function (val, key) {
      if (!(key in opts)) {
        var error = api.global.response.malformedRequest
        return cb(new Error(error.msg.format(name)))
      }
    })
    _.forEach(spec.params, function (val, key) {
      if (!(key in opts)) {
        var error = api.global.response.malformedRequest
        return cb(new Error(error.msg.format(name)))
      }
    })
    var path = spec.path.format(opts)
    if (!_.startsWith(options.host, 'http://')) {
      options.host = 'http://' + optsj.host
    }
    var url = urljoin(opts.host + ':' + opts.port, path)
    var requestOpts = {
      url: url,
      json: true,
      method: spec.request.method,
      timeout: 1500
    }
    var bodyFields = spec.request.body
    if (bodyFields) {
      requestOpts.body = _.pick(opts, bodyFields)
    }
    if (spec.request.authorized) {
      requestOpts.headers = {
        'Authorization': opts.apiKey
      }
    }
    request(requestOpts, function (err, res, body) {
      var suggestions = []
      var globalErrors = api.global.response.error
      var isError = false

      if (err) {
        var error
        if (err.code === 'ETIMEDOUT') {
          error = globalErrors.timeout
          msg = return cb(new Error(error.msg.format(options)))
        } else if (err.code === 'ECONNREFUSED') {
          error = globalErrors.refused
          msg = return cb(new Error(error.msg.format(options)))
        } else {
          error = globalErrors.generic
          msg = return cb(new Error(error.msg.format({ error: err })))
        }
      } else if (res.statusCode === 403) {
        return cb(new Error(globalErrors.unauthorized.msg))
      } else if (res.statusCode === endpoint.response.success.status) {
        var fullObj = _.merge({}, opts, {
          results: JSON.stringify(body, null, 2)
        })
        return cb(null, endpoint.response.success.msg.format(fullObj))
      } else {
        var errorType = body.type
        if (errorType in endpoint.response.error) {
          error = endpoint.response.error[errorType]
          return cb(new Error(body.error))
        } else {
          error = globalErrors.generic
          return cb(new Error(error.msg.format({ error: JSON.stringify(body) })))
        }
      }
    })
  }
}

module.exports = (function (api) {
  var client = {}
  _.forEach(api, function (specs, subsetName) {
    _.forEach(specs, function (spec, specName) {
      if (spec.description) {
        if (!(subsetName in client)) {
          client[subsetName] = {}
        }
        var func = makeSpecFunc(api, specName, spec)
        func.__doc__ = makeDocstring(api, specName, spec)
        client[subsetName][specName] = func
      }
    })
  })
  return client
})(require('binder-protocol'))




