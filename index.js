var xml2js = require('xml2js');
var traverse = require('./traverse');
var svgElements = require('./react-svg-elements');
var makeComponent = require('./make-component');
var cssParser = require('./css-parser');

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
    var allowedAttrs = ['d', 'id', 'width', 'height', 'style'];
    // $ is the list of attrs
    var allowedTags = svgElements.concat(['$']);
    var filtered = traverse(result, function(value, key, parent, parentKey) {
      if ('number' === typeof key) return true;
      if (parentKey === '$') return allowedAttrs.indexOf(key) > -1;
      return allowedTags.indexOf(key) > -1;
    });
    var rawxml = builder.buildObject(filtered);
    var xml = cssParser.styleAttrToJsx(rawxml);
    callback(null, makeComponent(xml));
  });

  parser.parseString(content.toString());

};
