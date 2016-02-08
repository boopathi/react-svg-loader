/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Her from './her.svg';
import Pic from './image.svg';

let Root = (
  <div>
    <Pic />
    <Her />
  </div>
);

ReactDOM.render(Root, document.getElementById('test'));
