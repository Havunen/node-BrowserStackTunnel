var path = require('path'),
    https = require('https'),
    unzip = require('unzip'),
    fs = require('fs');

function ZipBinary(platform, arch, bin) {
  'use strict';

  var self = this;
  self.bin = bin || path.resolve(path.join(__dirname, '..', 'bin', platform, arch));
  self.path = path.resolve(path.join(self.bin, 'BrowserStackLocal'));
  self.command = self.path;
  self.args = [];

  self.update = function (callback) {
    var extractStream = unzip.Extract({
      path: self.bin
    });
    https.get('https://www.browserstack.com/browserstack-local/BrowserStackLocal-' + platform + '-' + arch + '.zip', function (response) {
      console.log('BrowserStackTunnel: download binary for ' + platform + '-' + arch + ' ...');
      extractStream.on('close', function () {
        console.log('BrowserStackTunnel: download complete');
        console.log('BrowserStackTunnel: chmod 0755 binary');
        fs.chmod(self.path, '0755', callback);
      });
      response.pipe(extractStream);
    });
  };
}

module.exports = ZipBinary;
