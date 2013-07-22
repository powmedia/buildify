var buildify = require('../index');

buildify.task({
  name: 'minify',
  depends: ['concat'],
  task: function () {
    console.log('minify...');
  }
});

buildify.task({
  name: 'concat',
  task: function () {
    console.log('concat...');
  }
});