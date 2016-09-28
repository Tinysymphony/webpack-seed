import React from 'react';
import ReactDOM from 'react-dom';
import WytinyImages from 'components/wytinyImages';
import imgs from 'datas/imgs';

ReactDOM.render(
  <WytinyImages data={imgs}/>,
  document.getElementById('react-app')
);
