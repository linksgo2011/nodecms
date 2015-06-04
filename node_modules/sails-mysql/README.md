# Sails-MySQL Adapter <a target="_blank" href="http://www.mysql.com"><img src="http://www.mysql.com/common/logos/powered-by-mysql-125x64.png" alt="Powered by MySQL" title="sails-mysql: MySQL adapter for Sails"/></a>
[![Build Status](https://travis-ci.org/balderdashy/sails-mysql.svg?branch=master)](https://travis-ci.org/balderdashy/sails-mysql)
[![npm version](https://badge.fury.io/js/sails-mysql.svg)](http://badge.fury.io/js/sails-mysql)
[![dependencies](https://david-dm.org/balderdashy/sails-mysql.svg)](https://david-dm.org/balderdashy/sails-mysql)

MySQL adapter for the Sails framework and Waterline ORM.  Allows you to use MySQL via your models to store and retrieve data.  Also provides a `query()` method for a direct interface to execute raw SQL commands.



## Installation

Install from NPM.

```bash
# In your app:
$ npm install sails-mysql
```

## Sails Configuration

Add the mysql config to the config/connections.js file. Basic options:

```javascript
module.exports.connections = {
  mysql: {
    module    : 'sails-mysql',
    host      : 'localhost',
    port      : 3306,
    user      : 'username',
    password  : 'password',
    database  : 'MySQL Database Name'

    // OR (explicit sets take precedence)
    module    : 'sails-mysql',
    url       : 'mysql2://USER:PASSWORD@HOST:PORT/DATABASENAME'
    
    // Optional
    charset   : 'utf8',
    collation : 'utf8_swedish_ci'
  }
};
```

And then change default model configuration to the config/models.js:

```javascript
module.exports.models = {
  connection: 'mysql'
};
```

## Run tests

You can set environment variables to override the default database config for the tests, e.g.:

```sh
$ WATERLINE_ADAPTER_TESTS_PASSWORD=yourpass npm test
```


Default settings are:

```javascript
{
  host: process.env.WATERLINE_ADAPTER_TESTS_HOST || 'localhost',
  port: process.env.WATERLINE_ADAPTER_TESTS_PORT || 3306,
  user: process.env.WATERLINE_ADAPTER_TESTS_USER || 'root',
  password: process.env.WATERLINE_ADAPTER_TESTS_PASSWORD || '',
  database: process.env.WATERLINE_ADAPTER_TESTS_DATABASE || 'sails_mysql',
  pool: true,
  connectionLimit: 10,
  waitForConnections: true
}
```



#### More Resources

- [Stackoverflow](http://stackoverflow.com/questions/tagged/sails.js)
- [#sailsjs on Freenode](http://webchat.freenode.net/) (IRC channel)
- [Twitter](https://twitter.com/sailsjs)
- [Professional/enterprise](https://github.com/balderdashy/sails-docs/blob/master/FAQ.md#are-there-professional-support-options)
- [Tutorials](https://github.com/balderdashy/sails-docs/blob/master/FAQ.md#where-do-i-get-help)
- [Waterline (ORM)](http://github.com/balderdashy/waterline)
- <a href="http://sailsjs.org" target="_blank" title="Node.js framework for building realtime APIs."><img src="https://github-camo.global.ssl.fastly.net/9e49073459ed4e0e2687b80eaf515d87b0da4a6b/687474703a2f2f62616c64657264617368792e6769746875622e696f2f7361696c732f696d616765732f6c6f676f2e706e67" width=60 alt="Sails.js logo (small)"/></a>



#### License

**[MIT](./LICENSE)**
&copy; 2014
[Mike McNeil](http://michaelmcneil.com), [Balderdash](http://balderdash.co) & contributors

[Sails](http://sailsjs.org) is free and open-source under the [MIT License](http://sails.mit-license.org/).

See the [MySQL Logo Usage Guidelines](http://www.mysql.com/about/legal/trademark.html) for more information on our use of the MySQL logo.

![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/a22d3919de208c90c898986619efaa85 "githalytics.com")](http://githalytics.com/mikermcneil/sails-mysql)
