/* global document */
var Her = require('./her.svg');
var Pic = require('./image.svg');
var React = require('react');

React.render(React.createElement(
  "div",
  null,
  React.createElement(Pic, null),
  React.createElement(Her, null)
), document.getElementById('test'));
