//Run these tests with nodeunit

var builder = require('../index.js'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    sinon = require('sinon');


exports['constructor - dir defaults to working directory'] = function(test) {
  var b = builder();

  test.same(b.dir, process.cwd());

  test.done();
};


exports['constructor option defaults'] = function(test) {
  var b = builder();

  test.same(b.options, {
    encoding: 'utf-8',
    eol: '\n',
    interpolate: /\{\{(.+?)\}\}/g
  });

  test.same(b.content, '');

  test.done();
};


exports['constructor options'] = function(test) {
  var b = builder(null, {
    eol: '\r\n',
    interpolate: /\<\<(.+?)\?\>/g,
    quiet: true
  });

  test.same(b.options, {
    encoding: 'utf-8',
    eol: '\r\n',
    interpolate: /\<\<(.+?)\?\>/g,
    quiet: true
  });

  test.done();
};


exports['setDir'] = function(test) {
  var b = builder('/');

  b.setDir('/foo/bar');

  test.same(b.dir, path.normalize('/foo/bar'));

  test.same(b, b.setDir('/'), 'Returns self for chaining');

  test.done();
};


exports['changeDir'] = function(test) {
  var b = builder('/foo');

  test.same(b.dir, path.normalize('/foo'));

  b.changeDir('bar');
  test.same(b.dir, path.normalize('/foo/bar'));

  b.changeDir('..');
  test.same(b.dir, path.normalize('/foo'));

  b.changeDir('./bar/baz/..');
  test.same(b.dir, path.normalize('/foo/bar'));

  test.same(b, b.changeDir('.'), 'Returns self for chaining');

  test.done();
};


exports['setContent'] = function(test) {
  var b = builder(__dirname);

  test.same(b.content, '');

  b.setContent('foo');
  test.same(b.content, 'foo');

  test.same(b, b.setContent(''), 'Returns self for chaining');

  test.done();
};


exports['getContent'] = function(test) {
  var b = builder(__dirname);

  b.setContent('bla');

  test.same(b.getContent(), 'bla');

  test.done();
};


exports['load'] = function(test) {
  var b = builder(__dirname + '/support');

  b.load('foo.txt');
  test.same(b.content, 'FOO');

  b.load('./bar.txt');
  test.same(b.content, 'BAR');

  test.same(b, b.load('foo.txt'), 'Returns self for chaining');

  test.done();
};


exports['concat'] = {
  'default eol': function(test) {
    var b = builder(__dirname + '/support');

    b.concat(['./foo.txt', 'bar.txt']);
    test.same(b.content, 'FOO\nBAR');

    test.done();
  },

  'custom eol': function(test) {
    var b = builder(__dirname + '/support');

    b.setContent('Hello.');

    b.concat(['bar.txt', 'foo.txt'], '');
    test.same(b.content, 'Hello.BARFOO');

    test.done();
  },

  'passing single file': function(test) {
    var b = builder(__dirname + '/support');

    b.setContent('Test!')

    b.concat('foo.txt');
    test.same(b.content, 'Test!\nFOO');

    test.done();
  },

  'returns self for chaining': function(test) {
    var b = builder(__dirname + '/support');

    test.same(b, b.concat('foo.txt'), 'Returns self for chaining');

    test.done();
  }
};


exports['wrap'] = function(test) {
  var b = builder(__dirname + '/support');

  b.setContent('FOO');

  var returned = b.wrap('template.txt', { version: '0.1.0' });

  test.same(b.content, 'Module v0.1.0: FOO!');

  test.same(returned, b, 'Returns self for chaining');

  test.done();
};


exports['perform'] = function(test) {
   var b = builder();

   test.same(b.content, '');

   b.perform(function(content) {
      return content + 'bar';
   });

   test.same(b.content, 'bar');

   test.done();
};


exports['uglify'] = function(test) {
  var b = builder();

  b.setContent('  foo  =   123;   ')

  b.uglify();

  test.same(b.content, 'foo=123');

  test.done();
};


exports['cssmin'] = {
  'default': function(test) {
    var b = builder(),
        css = ' .cl  {\n \t /* comment */ \n \t color:  #FFFFFF ; \n \t font-weight: normal ; \n \t margin: 0px 0px 0px 0px ; \n } \n \n  .cx  {\n \t /* comment */ \n \t color:  #000000 ; \n \t font-weight: bold ; \n } \n \n ';

    b.setContent(css);

    b.cssmin();

    test.same(b.content, '.cl{color:#FFF;font-weight:400;margin:0}.cx{color:#000;font-weight:700}');

    test.done();
  },

  'limit line length': function(test) {
    var b = builder(),
        css = ' .cl  {\n \t /* comment */ \n \t color:  #FFFFFF ; \n \t font-weight: normal ; \n \t margin: 0px 0px 0px 0px ; \n } \n \n  .cx  {\n \t /* comment */ \n \t color:  #000000 ; \n \t font-weight: bold ; \n } \n \n ';

    b.setContent(css);

    b.cssmin(39);

    test.same(b.content, '.cl{color:#FFF;font-weight:400;margin:0}\n.cx{color:#000;font-weight:700}');

    test.done();
  }
};


exports['compileStyl'] = function(test) {
  var b = builder();

  b.setContent('body\n \t font 12px Helvetica, Arial, sans-serif\n \na.button\n \t border-radius 5px');
  b.compileStyl();

  test.same(b.content, 'body{font:12px Helvetica,Arial,sans-serif}\na.button{border-radius:5px}\n');

  test.done();
}


exports['compileCoffee'] = function(test) {
  var b = builder();

  b.setContent('play() while life is on');
  b.compileCoffee();

  test.same(b.content, '\nwhile (life === true) {\n  play();\n}\n');

  test.done();
}

exports['save'] = {
  setUp: function(done) {
    this.sinon = sinon.sandbox.create();

    this.sinon.stub(fs, 'writeFileSync');
    this.sinon.stub(mkdirp, 'sync');

    done();
  },

  tearDown: function(done) {
    this.sinon.restore();
    done();
  },

  main: function(test) {
    var b = builder(__dirname + '/support', { quiet: true });

    b.setContent('test');

    var returned = b.save('path/to/file/output.txt');

    //Test make directory recursively
    test.same(mkdirp.sync.lastCall.args, [
      path.normalize(__dirname + '/support/path/to/file')
    ]);

    //Test wrote file OK
    test.same(fs.writeFileSync.lastCall.args, [
      path.normalize(__dirname + '/support/path/to/file/output.txt'),
      'test'
    ]);

    test.same(returned, b, 'Returns self for chaining');

    test.done();
  }
};


exports['clear'] = function(test) {
  var b = builder();

  b.setContent('foo');

  var returned = b.clear();

  test.same(b.content, '');

  test.same(returned, b, 'Returns self for chaining');

  test.done();
};
