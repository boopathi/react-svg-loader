var xml2js = require('xml2js');
var filter = require('./deep-filter');
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
    // var allowedAttrs = ['d', 'id', 'fill', 'width', 'height', 'style'];
    // $ is the list of attrs
    var allowedTags = svgElements.concat(['$']);
    var filtered = filter(result, function(value, key, parent, parentKey) {
      if ('number' === typeof key) return true;
      // if the attribute is a namespace attr, then ignore
      if (parentKey === '$') return key.indexOf(':') < 0;
      return allowedTags.indexOf(key) > -1;
    });
    var rawxml = builder.buildObject(filtered);
    var xml = cssParser.styleAttrToJsx(rawxml);
    console.log(makeComponent(xml));
    callback(null, makeComponent(xml));
  });

  parser.parseString(content.toString());

};
