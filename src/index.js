import xml2js from 'xml2js';
import filter from './deep-filter';
import svgElements from './react-svg-elements';
import makeComponent from './make-component';
import {styleAttrToJsx} from './css-parser';

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
    // let allowedAttrs = ['d', 'id', 'fill', 'width', 'height', 'style'];
    // $ is the list of attrs
    let allowedTags = svgElements.concat(['$']);
    let filtered = filter(result, function(value, key, parent, parentKey) {
      if ('number' === typeof key) return true;
      // if the attribute is a namespace attr, then ignore
      if (parentKey === '$') return key.indexOf(':') < 0;
      return allowedTags.indexOf(key) > -1;
    });
    let rawxml = builder.buildObject(filtered);
    let xml = styleAttrToJsx(rawxml);
    callback(null, makeComponent(xml));
  });

  parser.parseString(content.toString());

};
