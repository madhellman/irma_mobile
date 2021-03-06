import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { namespacedTranslation } from 'lib/i18n';
import PaddedContent from 'lib/PaddedContent';
import CredentialCard from 'components/CredentialCard';

import {
  Button,
  Container,
  Footer,
  H3,
  Icon,
  Text,
  View,
} from 'native-base';

const t = namespacedTranslation('CredentialDashboard');

export default class CredentialDashboard extends Component {

  static propTypes = {
    credentials: PropTypes.array.isRequired,
    deleteCredential: PropTypes.func.isRequired,
    enrolled: PropTypes.bool.isRequired,
    navigateToDetail: PropTypes.func.isRequired,
    navigateToEnrollment: PropTypes.func.isRequired,
    navigateToQRScanner: PropTypes.func.isRequired,
  }

  renderCredentials() {
    const { credentials, deleteCredential } = this.props;

    return credentials.map( credential =>
      <CredentialCard
        key={credential.Hash}
        credential={credential}
        collapsable={true}
        deleteCredential={deleteCredential}
      />
    );
  }

  renderEnrollButton() {
    const { navigateToEnrollment } = this.props;

    const buttonStyle = {alignSelf: 'center', borderRadius: 0, paddingHorizontal: 10};

    return (
      <View style={{paddingTop: 60}}>
        <Button iconLeft light onPress={navigateToEnrollment} style={buttonStyle}>
          <Icon name="key" style={{color: 'white'}} />
          <Text style={{color: 'white'}}>{ t('.unenrolled.button') }</Text>
        </Button>
      </View>
    );
  }

  renderNoCredentialsHint() {
    const { credentials, enrolled } = this.props;
    if(credentials.length !== 0)
      return null;

    const status = enrolled ? 'noAttributes' : 'unenrolled';

    return (
      <View key="title" style={{alignItems: 'center'}}>
        <H3 style={{paddingTop: 30, color: '#888888'}}>
          { t(`.${status}.header`) }
        </H3>
        <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
          <Text style={{paddingTop: 30, textAlign: 'justify', color: '#888888'}}>
            { t(`.${status}.text`) }
          </Text>
          { enrolled ? null : this.renderEnrollButton() }
        </View>
      </View>
    );
  }

  render() {
    const { navigateToQRScanner } = this.props;

    return (
      <Container>
        <PaddedContent>
          { this.renderNoCredentialsHint() }
          { this.renderCredentials() }
        </PaddedContent>
        <Footer style={{height: 60, paddingTop: 7}}>
          <Button primary onPress={navigateToQRScanner}>
            <Icon ios="ios-qr-scanner" android="md-qr-scanner" />
            <Text style={{color: 'white', paddingLeft: 10}}>{ t('.scanQRCode') }</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}
