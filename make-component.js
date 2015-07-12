module.exports = function(svg) {
  return 'import React from "react";' + '\n'
    + 'export default class extends React.Component {' + '\n'
    + '  render() {' + '\n'
    + '    return ' + svg + '\n'
    + '  }' + '\n'
    + '}' + '\n'
};
