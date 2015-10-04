# binder cli

Command line tool for managing Binder services: stage, build, register, launch

Make it easy to mix and match use cases and environments: local or cloud deployment, building images or launching images directly, etc.

100% vaporware! For now!

Example usage:

```
binder stage binder-project/example-requirements --dependency='Dockerfile' > spec.json
```

```
binder build spec.json --server='build.mybinder.org' -api-token='blah'
```

```
binder register example-requirements --registry='registry.mybinder.org' -api-token='blah' > template.json
```

```
binder launch template.json --host='local' -api-token='blah'
```

```
binder launch template.json --host='app.mybinder.org' -api-token='blah'
```
