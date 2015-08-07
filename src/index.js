import xml2js from 'xml2js';
import builder from './build-xml';
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
    normalizeTags: true,
    explicitArray: true,
    explicitChildren: true,
    preserveChildrenOrder: true
  });

  parser.addListener('error', err => callback(err));

  parser.addListener('end', function(result) {
    let svg = result.svg;
    let allowedTags = svgTags.concat(['$', '$$', '#name']);
    let filtered = filter(result, function(value, key, parent, parentKey) {
      if ('number' === typeof key) {
        if (parentKey === '$$')
          return allowedTags.indexOf(value['#name']) > -1;
        return true;
      }
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
    // everything is synchronous anyway,
    // but the promise chain gives us a neat way to
    // list a pipeline - a list of transformations to
    // be done on some initial data
    Promise
      .resolve(filtered)
      .then(builder)
      .then(styleAttrToJsx)
      .then(convertRootToProps)
      .then(makeComponent)
      .then(component => callback(null, component))
      .catch(err => callback(err));

  });

  parser.parseString(content.toString());

};
