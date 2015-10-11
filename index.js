#! /usr/bin/env node

var subcommand = require('subcommand')

var config = {
  root: {
    command: help
  },
  commands: [
    require('./bin/build.js'),
    require('./bin/register.js')
  ],
  defaults: require('./bin/defaults.js'),
  none: nomatch
}

var args = process.argv.slice(2)
var route = subcommand(config)
route(args)

function help (args) {
  if (args.version) return console.log(require('./package.json').version)
  console.log('Usage: binder <command> [options]')
  console.log('')
  console.log('Commands:')
  config.commands.forEach( function(command) {
    var indent = 23 - command.name.length
    console.log('    ' + command.name + Array(indent).join(' ') + command.help)
  })
}

function nomatch (args) {
  console.log("binder:", "'" + args._[0] + "'", 
    "is not a valid command. See 'binder --help' for usage.")
  process.exit(1)
}