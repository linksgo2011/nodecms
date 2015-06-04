var exec = require('child_process').exec;
var async = require('async');
var npm = require('npm');
var jpath = require('jpath');


/////////////////////////////////////////////////////////////////////
//
// Config

// The adapters being tested
var adapters = ['sails-postgresql', 'sails-mysql'];

// Core modules npm Dependencies path
var coreModulesPaths = {
  "waterline":               ".dependencies.waterline-adapter-tests.dependencies.waterline",
  "- anchor":                ".dependencies.waterline-adapter-tests.dependencies.waterline.dependencies.anchor",
  "- waterline-schema":      ".dependencies.waterline-adapter-tests.dependencies.waterline.dependencies.waterline-schema",
  "waterline-adapter-tests": ".dependencies.waterline-adapter-tests"
};

var wlSequelPath = ".";

//
/////////////////////////////////////////////////////////////////////


var status = {},
    npmData,
    exitCode = 0;
process.env.FORCE_COLORS = true;

console.time('total time elapsed');

var resultTable = "\n";
resultTable += " ------------------------------------------------------------------- \n";
resultTable += "| adapter          | version | status  | failed | total | wl-sequel |\n";
resultTable += "|------------------|---------|---------|--------|-------|-----------|\n";

function getNpmDetails(cb){
  npm.load({ depth: 2 }, function (er) {
  if (er) return process.exit(1);

  npm.commands.ls('', true, function(err, data){
    npmData = data;
    cb(err, data);
  });
});
}

function runTests(cb){
  async.eachSeries(adapters, function(adapterName, next){
    status[adapterName] = { failed: 0, total: 0, exitCode: 0 };
    
    console.log("\n");
    console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
    console.log("\033[0;34m                                     %s \033[0m", adapterName);
    console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
    console.log();
    
    var child = exec('node ./test/integration/runner.js ' + adapterName, { env: process.env });
    child.stdout.on('data', function(data) {
      if(isDot(data)) { status[adapterName].total++; }
      process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
      if(isDot(data)) { 
        status[adapterName].total++;
        status[adapterName].failed++;
      }
      process.stdout.write(data);
    });
    child.on('close', function(code) {
      status[adapterName].exitCode = code;
      var message = code == 0 ? "\033[0;32msuccess\033[0m" : "\033[0;31mfailed \033[0m";
      var wlSequel = getWlSequelVersion(adapterName);
      resultTable += "| " + padRight(adapterName, 16) 
        + " | " + padLeft(processVersion(npmData.dependencies[adapterName]), 7)
        + " | " + message 
        + " | " + padLeft(status[adapterName].failed, 6) 
        + " | " + padLeft(status[adapterName].total, 5)
        + " | " + padLeft(wlSequel, 9)
        + " |\n";
      
      console.log('exit code: ' + code);
      if(code != 0) { exitCode = code; }
      next();
    });
  }, 
  cb);
}

function printCoreModulesVersions(cb){
  var coreModules = "\n";
  coreModules += " ----------------------------------- \n";
  coreModules += "| core modules            | version |\n";
  coreModules += "|-------------------------|---------|\n";
  for(var moduleName in coreModulesPaths){
    coreModules += getModuleRow(moduleName, jpath(npmData, coreModulesPaths[moduleName])[0]);
  }
  coreModules += " ----------------------------------- \n";
  console.log(coreModules);
  cb();
}

function getModuleRow(name, module){;
  return "| "+ padRight(name, 23) + " | " 
    + padLeft(processVersion(module), 7) 
    + " |\n";
}


async.series([getNpmDetails, runTests, printCoreModulesVersions], function(err, res){
  resultTable += " ------------------------------------------------------------------- \n";
  console.log(resultTable);
  console.timeEnd('total time elapsed');
  if(err){
    console.error('Something wrong happened:', err);
  }
  process.exit(exitCode);
});



/**
 * Aux functions
 */
function isDot(data){
  return data == '․' || (data.length === 10 /*&& data[0] === '\u001b'*/ && data.charAt(5) === '․'.charAt(0));
}

function padRight(str, padding){
  var res = "" + str;
  for(var i=res.length; i<padding; i++){
    res += ' ';
  }
  return res;
}

function padLeft(str, padding){
  str = str + "";
  var pad = "";
  for(var i=str.length; i<padding; i++){
    pad += ' ';
  }
  return pad + str;
};

function processVersion(dependency){
  if(!dependency) return '';
  if(dependency._resolved){
    if(dependency._resolved.indexOf('git') === 0){
      var parts = dependency._resolved.split('#');
      return parts[parts.length-1].slice(0, 7);
    }
    if(dependency._resolved.indexOf('npmjs.org') >= 0){
      return dependency.version;
    }
  }
  if(dependency.gitHead){
    return dependency.gitHead.slice(0, 7);
  }
  // console.warn('WARN: Not sure we found the dependency that was resolved.');
  return dependency.version;
}

function getWlSequelVersion(adapterName){
  if(adapterName.indexOf('sql') < 0) { return ""; }
  var path = wlSequelPath.replace('%s', adapterName);
  return processVersion(jpath(npmData, path)[0]);
}
