var zipFolder = require('zip-folder');
var manifest = require(__dirname + '/../build/manifest.json');

zipFolder(__dirname + '/../build', __dirname + '/../packages/evala_' + manifest.version + '.zip', function (err) {
  if (err) {
    console.log('Zipping extension failed.', err);
  } else {
    console.log('Zipping extension successful.');
  }
});
