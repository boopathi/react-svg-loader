module.exports = { multipass: true,
  plugins:
   [ 'removeDoctype',
     'removeXMLProcInst',
     'removeComments',
     'removeMetadata',
     'removeEditorsNSData',
     'cleanupAttrs',
     'minifyStyles',
     'convertStyleToAttrs',
     'cleanupIDs',
     'removeRasterImages' ],
  js2svg: { pretty: true } };
