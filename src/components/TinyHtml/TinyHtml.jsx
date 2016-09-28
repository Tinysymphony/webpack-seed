import React, { Component, PropTypes } from 'react';
import s from './TinyHtml.scss';
import Header from '@components/Header';
import Footer from '@components/Footer';
import WytinyImages from '@components/WytinyImages';
import ProjectInfo from '@components/ProjectInfo';

class TinyHtml extends Component {
  render() {
    const {imgs, headerList, info} = this.props;
    return (
      <div className={s.container}>
        <Header list={headerList} />
        <WytinyImages imgs={imgs} />
        <ProjectInfo info={info} />
        <Footer />
      </div>
    );
  }
}

export default TinyHtml;
