import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
};

const defaultProps = {
  text: ''
};

class CheckBox extends Component {
  render() {
    const { text, onChange } = this.props
    return (
        <a href="javascript:;" className="checkbox" onClick={onChange}><span>{text}</span> <i></i></a>
    );
  }
}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;


export default CheckBox;
