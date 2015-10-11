module.exports = {
  name: '',
  options: [
    { name: 'version', boolean: false },
    { name: 'help', boolean: false}
  ],
  command: command
}

function command (args) {
  if (args.version) return console.log(require('../package.json').version)
  if (args.help) return help()
}

function help () {
  var self = this
  console.log('Usage: binder <command> [options]')
  console.log('')
  console.log('Commands:')
  config.commands.forEach( function(command) {
    var indent = 23 - command.name.length
    console.log('    ' + command.name + Array(indent).join(' ') + command.help)
  })
}