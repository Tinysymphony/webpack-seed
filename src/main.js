import React from 'react';
import ReactDOM from 'react-dom';
import TinyHtml from '@components/TinyHtml';
import Data from 'datas/data';

ReactDOM.render(
  <TinyHtml {...Data}/>,
  document.getElementById('react-app')
);

if (module.hot) {
  module.hot.accept();
}
