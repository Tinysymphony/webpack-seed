import { Component, PropTypes } from 'react';

class WytinyImages extends Component {
  render() {
    let imgs = this.props.data.map(item => (
      <img class="p-img" src={item} />
    ));
    return (
      <div className="img-container">
        {imgs}
      </div>
    );
  }
}

export default WytinyImages;
