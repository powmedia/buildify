#!/usr/bin/env node
/**
 * Buildify
 *
 * Builder for creating distributable JavaScript files from source.
 * Concatenate, wrap, uglify.
 *
 * This application will execute the script named 'build.js' in the current
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

// load modules
var fs = require('fs');

// default build script
var BUILD_SCRIPT = 'build.js';

/**
 * Run the the default build script in current directory.
 */
function run () {
  var file = process.cwd() + '/' + BUILD_SCRIPT;

  fs.exists(file, function (exists) {
    if (exists) {
      // run the file
      require(file);
    }
    else {
      // build script not found.
      // try the deprecated script name 'buildify.js'
      file = process.cwd() + '/buildify.js';
      fs.exists(file, function (exists) {
        if (exists) {
          console.log('Warning: Script name \'buildify.js\' is deprecated, ' +
              'use \'' + BUILD_SCRIPT + '\' instead.');

          // run the file
          require(file);
        }
        else {
          // no luck today
          console.log('Error: Build script \'' + BUILD_SCRIPT +
              '\' missing in current directory.');
        }
      });
    }
  });
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
  fs.readFile(__dirname + '/help.txt', function (err, data) {
    console.log(err ? err.toString() : data.toString());
  });
}

/**
 * Process input and output, based on the command line arguments
 */
if (process.argv.length > 2) {
  // TODO: real processing of command line argument...
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
