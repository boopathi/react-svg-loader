import builder from 'xmlbuilder';

let xmldec = {
  version: '1.0',
  standalone: true,
  encoding: 'UTF-8'
};

function traverse(tags, root) {
  for(var i in tags) {
    let item = root.ele(tags[i]['#name'], tags[i]['$']);
    if (tags[i].$$) traverse(tags[i].$$, item);
  }
}

export default function(json) {
  var root = builder.create('svg', xmldec, null, {
    headless: true
  });
  Object.keys(json.svg.$).map(function(at) {
    root.att(at, json.svg.$[at]);
  });
  // for (var i in json.svg.$) root.att(i, json.svg.$[i]);
  traverse(json.svg.$$, root);
  return root.end({
    // weird
    // Unterminated JSX contents
    // keep this to true cuz I don't why the resultant
    // JSX throws error while parsing -
    pretty: true
  });
}
