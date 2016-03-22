var _ = require('lodash')
var request = require('request')
var urljoin = require('url-join')
var format = require('string-format')
format.extend(String.prototype)

var makeDocstring = function (api, specName, spec) {
  // TODO add parameter descriptions to the docstring
  return spec.description
}

var makeSpecFunc = function (api, name, spec) {
  return function (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }
    if (!cb) {
      return new Error('callback not specified')
    }
    opts = opts || {}
    // if any arguments have special handling according to their types, do that here
    var err = null
    _.forEach(api.global.params, function (val, key) {
      if (!(key in opts)) {
        var error = api.global.response.error.malformedRequest
        err = new Error(error.msg.format(name))
      }
    })
    _.forEach(spec.params, function (val, key) {
      if (!(key in opts)) {
        var error = api.global.response.error.malformedRequest
        err = new Error(error.msg.format(name))
      }
    })
    if (err) {
      return cb(err)
    }
    var path = spec.path.format(opts)
    if (!_.startsWith(opts.host, 'http://')) {
      opts.host = 'http://' + opts.host
    }
    var url = urljoin(opts.host + ':' + opts.port, path)
    var requestOpts = {
      url: url,
      json: true,
      method: spec.request.method
    }
    var bodyFields = spec.request.body
    if (bodyFields) {
      requestOpts.body = _.pick(opts, bodyFields)
    }
    if (spec.request.authorized) {
      requestOpts.headers = {
        'Authorization': opts['api-key']
      }
    }
    request(requestOpts, function (err, res, body) {
      var globalErrors = api.global.response.error
      if (err) {
        var error
        if (err.code === 'ETIMEDOUT') {
          error = globalErrors.timeout
          return cb(new Error(error.msg.format(opts)))
        } else if (err.code === 'ECONNREFUSED') {
          error = globalErrors.refused
          return cb(new Error(error.msg.format(opts)))
        } else {
          error = globalErrors.generic
          return cb(new Error(error.msg.format({ error: err })))
        }
      } else if (res.statusCode === 403) {
        return cb(new Error(globalErrors.unauthorized.msg))
      } else if (res.statusCode === spec.response.success.status) {
        return cb(null, body)
      } else {
        var errorType = body.type
        if (errorType in spec.response.error) {
          error = spec.response.error[errorType]
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




