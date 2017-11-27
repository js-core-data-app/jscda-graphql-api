# js-core-data-app

NodeJS application built with js-core-data framework

# structure

* schema - folder containing schema versions
* plugins (optional) - connect middlewares that are included into rest api
* middlewares (optional) - similar as plugins, but for project specific logic
* seeds (optional) - seed data in folder structure

# Plugins

Plugins can also be load from local and global node_modules. Each module must
have prefix `jscda-` to be loaded. Loading global modules is disabled by
default, but you can enable it by setting environment variable:
`LOAD_GLOBAL_PLUGINS=true`
