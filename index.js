#! /usr/bin/env node

var subcommand = require('subcommand')
var usage = require('./lib/usage.js')('root.txt')

var config = {
  root: require('./bin/root.js'),
  commands: [
    require('./bin/build.js'),
    require('./bin/register.js'),
    require('./bin/help.js')
  ],
  defaults: require('./bin/defaults.js'),
  none: noMatch
}

var args = process.argv.slice(2)
var route = subcommand(config)
route(args)

function noMatch (args) {
  console.error("binder:", "'" + args[0] + "'", 
    "is not a valid command. See 'binder --help' for usage.")
  process.exit(1)
}