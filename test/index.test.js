//Run these tests with nodeunit

var builder = require('../index.js'),
    mkdirp = require('mkdirp'),
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

  test.same(b.dir, '/foo/bar');

  test.same(b, b.setDir('/'), 'Returns self for chaining');

  test.done();
};


exports['changeDir'] = function(test) {
  var b = builder('/foo');

  test.same(b.dir, '/foo');

  b.changeDir('bar');
  test.same(b.dir, '/foo/bar');

  b.changeDir('..');
  test.same(b.dir, '/foo');

  b.changeDir('./bar/baz/..');
  test.same(b.dir, '/foo/bar');

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
      __dirname + '/support/path/to/file'
    ]);

    //Test wrote file OK
    test.same(fs.writeFileSync.lastCall.args, [
      __dirname + '/support/path/to/file/output.txt',
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
