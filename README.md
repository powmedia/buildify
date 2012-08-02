buildify
===

Builder for creating distributable JavaScript files from source. Concatenate, wrap, uglify.


##Install
Requires [NodeJS](http://nodejs.org/#download) to run.

Then install buildify via npm:

    npm install buildify

Create a file with your build script (see the example in 'Usage' below), call it something like `build.js` and then run it with:

    node build.js
  

##Usage

    var buildify = require('buildify');
    
    buildify()
      .load('base.js')
      .concat(['part1.js', 'part2.js'])
      .wrap('../lib/template.js', { version: '1.0' })
      .save('../distribution/output.js')
      .uglify()
      .save('../distribution/output.min.js');


##API

###buildify([dir, options])
Create a new Builder instance.

Takes the starting directory as the first argument, e.g. __dirname. If this is not set, the current working directory is used.

Options:
- `interpolate`   Underscore template settings. Default to mustache {{var}} style interpolation tags.
- `encoding`      File encoding (Default 'utf-8')
- `eol`           End of line character (Default '\n')
- `quiet`         Whether to silence console output


###setDir(absolutePath)
Set the current working directory.


###changeDir(relativePath)
Change the current working directory.


###setContent(content)
Set the content to work with.


###getContent()
Get the current content. Note: breaks the chain.


###load(file)
Load file contents.


###concat(files, [eol])
Concatenate file contents.


###wrap(template, [data])
Wrap the contents in a template.

Useful for creating AMD/CommonJS compatible versions of code, adding notes/comments to the top of the file etc.


###uglify()
Minimise your JS using uglifyJS.


###cssmin()
Minimise your CSS using cssmin, the JavaScript port of the CSS minification tool from YUICompressor.


###save(file)
Save the contents to a file.


###saveGzip(file)
Save the contents gzip compressed to a file. Note: breaks the chain.


###clear()
Reset/clear contents.
