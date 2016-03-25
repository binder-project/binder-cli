# binder-client

Command line tool for managing Binder services: build, register, launch. Implements both a programmatic interface and a CLI interface for the protocol specification in [`binder-protocol`](https://github.com/binder-project/binder-protocol). 

Make it easy to mix and match use cases and environments: local or cloud deployment, building images or launching images directly, etc.

### install
```
npm install binder-client -g
```

### usage

This module can be imported as a module, or used directly from the CLI (and the usage is pretty much the same in both cases). Every method that's exposed by the client takes at least a host and a port as parameters, and authorized endpoints also require an API key. 

#### as CLI utility

The client can communicate with any endpoint in the Binder API using the following format (see examples): 
```
binder (build|registry|deploy) (command) [options] 
```

#### as an imported module
```
binder.(build|registry|deploy).(command)(options, function (err, result) {
  ...
})
```

### CLI examples

Unauthorized commands don't require an API token
```
binder deploy deploy binder-project-example-requirements --host='deploy.mybinder.org' --port=8084'
```

Endpoints are specified as camel-case in [`binder-protocol`](https://github.com/binder-project/binder-protocol), but they should be translated to kebab-case before use with the client:
```
binder registry fetch-all --host='build.mybinder.org' --port=8082 --api-token
```

If an endpoint has GET query parameters (i.e. `binder registry fetch`) they are specified as additional CLI arguments
```
binder registry fetch binder-project-example-requirements <deploy-id> --host='local' -api-token='blah'
```

### imported module

Translating CLI commands into programmatic API commands is straightforward (CLI arguments just need to be inserted into an options object):

To start building an image/template for a repository:
```
var buildOpts = {
  host: '<build server host>',
  port: 8082,
  apiKey: <api key>,
  repository: '<repo name>'
}
binder.build.start(buildOpts, function (err, status) {
  ...
})
```

To query the status of a single build:
```
var buildOpts = {
  host: '<build server host>',
  port: 8082,
  apiKey: <api key>,
  repository: '<repo name>'
}
binder.build.status(buildOpts, function (err, status) {
  ...
})
```
