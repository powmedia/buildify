buildify
===

Builder for creating distributable JavaScript files from source. Concatenate, wrap, uglify.


##Usage

    var buildify = require('buildify');
    
    buildify()
      .setDir(__dirname + '/src')
      .load('base.js')
      .concat(['part1.js', 'part2.js'])
      .wrap('../lib/template.js', { version: '1.0' })
      .save('../distribution/output.js')
      .uglify()
      .save('../distribution/output.min.js');


##API

###buildify([options])
Create a new Builder instance.

Options:
- dir           Base directory file operations start in.
- interpolate   Underscore template settings. Default to mustache {{var}} style interpolation tags.
- encoding      File encoding ('utf-8')
- eol           End of line character ('\n')
- quiet         Whether to silence console output


###setDir(absolutePath)
Set the current working directory to the given absolute path.

###changeDir(relativePath)
Change the current working directory to the given relative path