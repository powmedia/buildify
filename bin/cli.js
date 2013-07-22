#!/usr/bin/env node
/**
 * Buildify
 *
 * Builder for creating distributable JavaScript files from source.
 * Concatenate, wrap, uglify.
 *
 * This application will execute the script named `build.js` in the current
 * directory.
 *
 * Usage:
 *     buildify [tasks] {OPTIONS}
 *
 * Options:
 *     --version, -v  Show application version');
 *        --help, -h  Show this message');
 *
 * The option tasks is an optional list with task names to be executed.
 * If no tasks are provided, buildify will run the script including all tasks.
 */

// default build script
var BUILD_SCRIPT = 'build.js';

/**
 * Run the the default build script in current directory.
 */
function run () {
  var file = process.cwd() + '/' + BUILD_SCRIPT;
  require(file);
}

/**
 * Output application version number.
 * Version number is read version from package.json.
 */
function version () {
  var fs = require('fs');
  fs.readFile(__dirname + '/../package.json', function (err, data) {
    if (err) {
      console.log(err.toString());
    }
    else {
      var pkg = JSON.parse(data);
      var version = pkg && pkg.version ? 'v' + pkg.version : 'unknown';
      console.log(version);
    }
  });
}

/**
 * Output a help message
 */
function help() {
  console.log('Buildify');
  console.log();
  console.log('Builder for creating distributable JavaScript files from source.');
  console.log('Concatenate, wrap, uglify.');
  console.log();
  console.log('This application will execute the script named `build.js` in');
  console.log('the current directory.');
  console.log();
  console.log('Usage:');
  console.log('    buildify [tasks] {OPTIONS}');
  console.log();
  console.log('Options:');
  console.log('    --version, -v  Show application version');
  console.log('       --help, -h  Show this message');
  console.log();
}

/**
 * Process input and output, based on the command line arguments
 */
if (process.argv.length > 2) {
  var arg = process.argv[2];
  if (arg == '-v' || arg == '--version') {
    version();
  }
  else if (arg == '-h' || arg == '--help') {
    help();
  }
  else {
    run();
  }
}
else {
  run();
}
