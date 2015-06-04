var queries = [],
    fs      = require('fs'),
    path    = require('path');

require("fs").readdirSync(__dirname + '/').forEach(function (file) {
  if (file === path.basename(__filename)) {
    return;
  }

  var query = require("./" + file);

  if (query.skip) {
    return;
  }

  queries.push(query);
});

module.exports = queries;
