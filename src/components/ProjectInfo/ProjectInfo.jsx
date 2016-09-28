import React, { Component, PropTypes } from 'react';
import s from './ProjectInfo.scss';

class ProjectInfo extends Component {
  render () {
    return (
      <div className="info-wp">
        <div className={s.info}>{this.props.info}</div>
        <div type="button" className="btn no-select">
          <div className="btn-full no-select"></div>
          <a className="btn-content no-select" href="https://github.com/Tinysymphony/webpack-seed" target="_blank"> MORE </a>
        </div>
      </div>
    );
  }
}

export default ProjectInfo;
