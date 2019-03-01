import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './StatItem.module.css';

const propTypes = {
  text: PropTypes.string,
  prefix: PropTypes.string,
  count: PropTypes.number.isRequired,
};

const defaultProps = {
  text: '',
  prefix: ''
};

class StatItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { text, count, prefix } = this.props;
    return (
      <div className={styles.statistic}>
        <strong >{prefix}{count.toLocaleString('en')}</strong>
        <small>{text}</small>
      </div>

    );
  }
}

StatItem.propTypes = propTypes;
StatItem.defaultProps = defaultProps;


export default StatItem;
