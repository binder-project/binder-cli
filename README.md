# binder cli

Command line tool for managing Binder services: stage, build, register, launch

Make it easy to mix and match use cases and environments: local or cloud deployment, building images or launching images directly, etc.

100% vaporware! For now!

Example usage:

```
binder build github.com/user/name --server='build.mybinder.org' -token='blah'
```

```
binder register example-requirements --server='registry.mybinder.org' -token='blah'
```

```
binder launch example-requirements --host='local' -api-token='blah'
```

```
binder launch example-requirements --host='app.mybinder.org' -api-token='blah'
```
