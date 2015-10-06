#! /usr/bin/env node

var _ = require('lodash')

var name = process.argv.slice(2)[0]
var args = _.filter(process.argv, function(d) {return d !== name})

switch (name) {
  case 'build':
    require('binder-build').cli(args)
    break
  default:
    console.error('binder <command(s)> [--flag] [--key=value]')
}
