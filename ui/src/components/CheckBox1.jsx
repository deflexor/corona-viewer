import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './CheckBox1.module.css';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  kind: PropTypes.number
};

const defaultProps = {
  text: '',
  checked: false,
  kind: 1
};

class CheckBox1 extends Component {
  
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange (e) {
    e.preventDefault();
    this.props.onChange(this.props)
  }

  render() {
    const { name, text, checked, kind } = this.props
    if(kind === 1) {
      return (
          <a href="#1" className={`${styles.checkbox1} ${checked ? styles.checkbox1Active : ''}`} onClick={this.onChange}><span>{text}</span> <i></i></a>
      );
    } else if (kind === 2) {
      return (
        <a href="#1" className={`${styles.checkbox2} ${checked ? styles[name] : ''}`} onClick={this.onChange}><i></i> <span>{text}</span></a>
      );
    }
  }
}

CheckBox1.propTypes = propTypes;
CheckBox1.defaultProps = defaultProps;


export default CheckBox1;
