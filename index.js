var xml2js = require('xml2js');
var traverse = require('./traverse');
var svgElements = require('./react-svg-elements');
var makeComponent = require('./make-component');

module.exports = function(content) {

  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  var loaderContext = this;
  var callback = this.async();

  var parser = new xml2js.Parser({
    normalize: true,
    normalizeTags: true
  });

  var builder = new xml2js.Builder({
    headless: true
  });

  parser.addListener('error', function(err) {
    callback(err);
  });

  parser.addListener('end', function(result) {
    var svg = result.svg;
    var allowed = svgElements.concat(['$', 'd', 'width', 'height']);
    traverse(result, function(key, value, parent) {
      // traversing through an array
      if(!isNaN(key)) return;
      // not allowed
      if (allowed.indexOf(key) < 0) delete parent[key];
    });
    var xml = builder.buildObject(result);
    callback(null, makeComponent(xml));
  });

  parser.parseString(content.toString());

};
