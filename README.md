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
- `dir`           Base directory file operations start in.
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


###save(file)
Save the contents to a file.


###clear()
Reset/clear contents.
