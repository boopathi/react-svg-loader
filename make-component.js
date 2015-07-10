module.exports = function(svg) {
  return 'import {Component} from "react";' + '\n'
    + 'export default class extends Component {' + '\n'
    + '  render() {' + '\n'
    + '    ' + svg + '\n'
    + '  }' + '\n'
    + '}' + '\n'
};
