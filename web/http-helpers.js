var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  fs.readFile( archive.paths.siteAssets + asset, 'UTF-8', function(err, data){
    if(err){
      fs.readFile( archive.paths.archivedSites + asset, 'UTF-8', function(err, data) {
        if(err) {
          callback ? callback() : exports.sendResponse(res, '404: Page was not found', 404);
        } else {
          exports.sendResponse(res, data);
        }
      }); 
    } else {
      exports.sendResponse(res, data);
    }
  });
};

exports.sendResponse = function(res, obj, status) {
  status = status || 200;
  res.writeHead(status, headers);
  res.end(obj);
};

exports.collectData = function(request, callback) {
  var data = "";
  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", function() {
    callback(data);
  });
};

exports.redirect = function(res, loc, status) {
  status = status || 302;
  res.writeHead(status, {Location: loc});
  res.end();
};
