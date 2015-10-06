module.exports = {
  name: 'stage',
  command: handleBuild,
  options: [
    {
      name: 'dependency',
      boolean: false,
      abbr: 'd'
    }
  ]
}

function handleBuild(args) {

	console.log(args)

}