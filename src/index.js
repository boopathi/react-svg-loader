import xml2js from 'xml2js';
import filter from './deep-filter';
import {svgTags, svgAttrs} from './react-svg-elements';
import makeComponent from './make-component';
import {styleAttrToJsx, convertRootToProps} from './parsers';

export default function(content) {

  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  let loaderContext = this;
  let callback = this.async();

  let parser = new xml2js.Parser({
    normalize: true,
    normalizeTags: true
  });

  let builder = new xml2js.Builder({
    headless: true
  });

  parser.addListener('error', err => callback(err));

  parser.addListener('end', function(result) {
    let svg = result.svg;
    // $ is the list of attrs
    let allowedTags = svgTags.concat(['$']);
    let filtered = filter(result, function(value, key, parent, parentKey) {
      if ('number' === typeof key) return true;
      // if the attribute is a namespace attr, then ignore
      if (parentKey === '$') {
        return key.indexOf(':') < 0;
      }
      return allowedTags.indexOf(key) > -1;
    });

    // add some basic props by default
    if ('undefined' === typeof filtered.svg['$'].width)
      filtered.svg['$'].width = "300";
    if ('undefined' === typeof filtered.svg['$'].height)
      filtered.svg['$'].height = "300";

    // pass things through the pipeline
    let xml = builder.buildObject(filtered);
    xml = styleAttrToJsx(xml);
    xml = convertRootToProps(xml);
    var componentStr = makeComponent(xml);
    callback(null, componentStr);
  });

  parser.parseString(content.toString());

};
