export default function(svg) {
  return `
import React from 'react';
export default class extends React.Component {
  render() {
    return ${svg};
  }
}
`;

};
