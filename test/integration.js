var assert = require('assert')

var _ = require('lodash')
var async = require('async')

var binder = require('../lib/generate-client.js')

// TODO: set these parameters according to your test environment
var buildOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}
var registryOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}
var deployOpts = {
  host: '104.197.23.111',
  port: '8084',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}

var testRepo = 'https://www.github.com/binder-project/example-requirements'
var templateName = 'binder-project-example-requirements'
var registry = 'gcr.io/binder-testing/'

describe('Binder integration --', function () {

  // set during testing
  var imageName = null
  var deployId = null

  it('should start building the test repo', function (done) {
    binder.build.start(_.merge(buildOpts, { repository: testRepo }), function (err, body) {
      if (err) throw err
      imageName = body['image-name']
      return done()
    })
  })

  it('should query the progress of an active build until it completes', function (done) {
    this.timeout(20 * 10 * 3000)
    async.retry({ times: 20 * 10, interval: 3000 }, function (next) {
      binder.build.status(_.merge(buildOpts, { 'image-name': imageName }), function (err, body) {
        if (err) return next(err)
        if (!(body.status === 'completed')) {
          return next('build not yet completed')
        }
        return next(null)
      })
    }, function (err, result) {
      if (err) throw new Error(err)
      return done()
    })
  })

  it('should query for the completed build\'s template', function (done) {
    binder.registry.fetch(_.merge(registryOpts, { 'template-name': imageName }), function (err, body) {
      if (err) throw err
      assert(body['image-source'])
      assert(body['name'])
      assert(body['port'])
      done()
    })
  })

  it('should preload the template onto all nodes of the cluster', function (done) {
    this.timeout(1000 * 60 * 5)
    binder.deploy._preload(_.merge(deployOpts, { 'template-name': templateName }), function (err, body) {
      console.error(err)
      if (err) throw err
      done()
    })
  })

  it('should deploy an app from the registered template', function (done) {
    binder.deploy.deploy(_.merge(deployOpts, { 'template-name': templateName }), function (err, body) {
      if (err) throw err
      deployId = body.id
      done()
    })
  })

  it('should query the state of the deployed app until it succeeds', function (done) {
    this.timeout(20 * 10 * 3000)
    async.retry({ times: 20 * 10, interval: 3000 }, function (next) {
      binder.deploy.status(_.merge(deployOpts, {
        'template-name': templateName,
        id: deployId
      }), function (err, body) {
        if (err) return next(err)
        if (!(body.location)) {
          return next('app not yet deployed')
        }
        return next(null)
    })
  }, function (err, results) {
    if (err) throw new Error(err)
    done()
  })
  })

})
