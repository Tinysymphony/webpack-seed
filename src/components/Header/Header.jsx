import React, { Component, PropTypes } from 'react';
import s from './Header.scss';

class Header extends Component {
  render() {
    let items = this.props.list.map((item, index) => (
      <li key={index} className={s.item}>
        <a href={item.url || 'javascript:;'} target="_blank">{item.name}</a>
      </li>
    ));
    return (
      <header className={s.header}>
        <ul className={s.list}>{items}</ul>
      </header>
    );
  }
}

export default Header;
