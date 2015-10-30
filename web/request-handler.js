var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var urlParser = require('url');
var httphelp = require('./http-helpers');

var actions = {

  'GET': function(req, res) {
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    httphelp.serveAssets( res, urlPath);
  },

  'POST': function(req, res) {
    httphelp.collectData(req, function(data) {
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found){
        if(found) {
          archive.isUrlArchived(url, function(exists) {
            if(exists) {
               httphelp.redirect(res, '/' + url);
            } else {
              httphelp.redirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httphelp.redirect(res, '/loading.html');
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
    httphelp.send404(res);
  }
};