import React, { Component, PropTypes } from 'react';
import s from './WytinyImages.scss';

class WytinyImages extends Component {
  render() {
    let imgs = this.props.imgs.map((item, index) => (
      <img className={s.pImg} src={item} key={index}/>
    ));
    return (
      <div className="img-container">
        <div className={s.text}>
          WY<div className={s.bind}></div>TINY
        </div>
        <div className="img-wp">{imgs}</div>
      </div>
    );
  }
}

export default WytinyImages;
