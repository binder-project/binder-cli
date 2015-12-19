# binder-cli

Interfaces with binder servers over HTTP requests.

Primary commands:

#### `binder build <repo> --token=X --url=X`
Interfaces with a build server, subcommands are:
* `build`
* `build status <image>`

#### `binder register <template> --token=X --url=X`
* `register`
* `register status <template>`

#### `binder deploy <template> --token=X --url=X`
* `deploy`
* `deploy status <template>`
* `deploy r <id>`
