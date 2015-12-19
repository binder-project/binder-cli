# binder-cli

Interfaces over HTTP requests (some authenticated) with services that conform to the binder API.

Primary commands:

#### `binder build <repo> --token=X --url=X`
Interfaces with a build server, subcommands are:
* `build <repo>` get contents of a repostiory and build an image
* `build status <repo>` get status on a repository that is being built
* `build describe <image>` get info on an image that has been built

#### `binder register <template> --token=X --url=X`
* `register <template>` add a template into the registry
* `register describe <template>`describe a template in the registry

#### `binder deploy <template> --token=X --url=X`
* `deploy <template>` launch a container app
* `deploy status <>` status for all running apps
* `deploy status <template>` status for a single template
* `deploy status app <id>` status for a single running app
