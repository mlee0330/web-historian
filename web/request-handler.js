var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var urlParser = require('url');
var httpHelp = require('./http-helpers');

var actions = {

  'GET': function(req, res) {
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    httpHelp.serveAssets( res, urlPath);
  },

  'POST': function(req, res) {
    httpHelp.collectData(req, function(data) {
      var url = JSON.parse(data).url.replace('http://', '');
      archive.isUrlInList(url, function(found){
        if(found) {
          archive.isUrlArchived(url, function(exists) {
            if(exists) {
               httpHelp.redirect(res, '/' + url);
            } else {
              httpHelp.redirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httpHelp.redirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function(req, res) {
  if( actions[req.method] ) {
    actions[req.method](req, res);
  } else {
    exports.sendResponse(res, '404: Page was not found', 404);
  }
};