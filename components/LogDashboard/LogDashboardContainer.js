import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LogDashboard, { t } from './LogDashboard';

const mapStateToProps = (state) => {
  const {

  } = state;

  return {

  };
};

@connect(mapStateToProps)
export default class LogDashboardContainer extends Component {

  static propTypes = {

  }

  static navigationOptions = {
    title: t('.title'),
  };

  render() {
    return (
      <LogDashboard />
    );
  }
}
