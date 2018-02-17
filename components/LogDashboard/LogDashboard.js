import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { namespacedTranslation } from 'lib/i18n';

import {
  Container,
  Text,
} from 'native-base';

export const t = namespacedTranslation('LogDashboard');

export default class LogDashboard extends Component {

  static propTypes = {

  }

  render() {
    return (
      <Container>
        <Text>Hi there</Text>
      </Container>
    );
  }
}
