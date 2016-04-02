/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Her from './her.svg';
import Pic from './image.svg';

let Root = (
  <div>
    <Pic />
    <Her width={300} height={300}/>
  </div>
);

ReactDOM.render(Root, document.getElementById('test'));
