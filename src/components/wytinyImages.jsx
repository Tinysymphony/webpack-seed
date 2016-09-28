import React, { Component, PropTypes } from 'react';

class WytinyImages extends Component {
  render() {
    let imgs = this.props.data.map((item, index) => (
      <img className="p-img" src={item} key={index}/>
    ));
    return (
      <div className="img-container">
        {imgs}
      </div>
    );
  }
}

export default WytinyImages;
