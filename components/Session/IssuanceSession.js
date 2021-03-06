import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { namespacedTranslation } from 'lib/i18n';
import KeyboardAwareContainer from 'lib/KeyboardAwareContainer';

import DisclosureChoices from './children/DisclosureChoices';
import Error from './children/Error';
import Footer from './children/Footer';
import Header from './children/Header';
import IssuedCredentials from './children/IssuedCredentials';
import MissingDisclosures from './children/MissingDisclosures';
import PinEntry from './children/PinEntry';
import StatusCard from './children/StatusCard';

import PaddedContent from 'lib/PaddedContent';
import {
  Text,
  View,
} from 'native-base';

const t = namespacedTranslation('Session.IssuanceSession');

export default class IssuanceSession extends Component {

  static propTypes = {
    forceValidation: PropTypes.bool.isRequired,
    irmaConfiguration: PropTypes.object.isRequired,
    makeDisclosureChoice: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    navigateToEnrollment: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    pinChange: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
  }

  renderStatusCard() {
    const {
      navigateToEnrollment,
      session,
      session: {
        issuedCredentials,
        serverName,
        status,
      },
    } = this.props;

    let heading;
    switch(status) {
      case 'success':
      case 'cancelled':
      case 'requestPermission':
        heading = <Text>{ t(`.${status}Heading`) }</Text>;
    }

    let explanation;
    switch(status) {
      case 'unsatisfiableRequest':
        explanation = (
          <Text>
            { t('.unsatisfiableRequestExplanation.before') }
            &nbsp;<Text style={{fontWeight: 'bold'}}>{ serverName }</Text>&nbsp;
            { t('.unsatisfiableRequestExplanation.after') }
          </Text>
        );

        break;

      case 'requestPermission': {
        const credentialCount = issuedCredentials.length;
        const attributeCount = issuedCredentials.reduce(
          (acc, cr) => acc + cr.Attributes.length, 0
        );

        const credentialAmount = t('common.credentials', { count: credentialCount });
        const attributeAmount = t('common.attributes', { count: attributeCount });

        explanation = (
          <Text>
            <Text style={{fontWeight: 'bold'}}>{ serverName }</Text>&nbsp;
            { t('.requestPermissionExplanation', {credentialAmount, attributeAmount}) }
          </Text>
        );

        break;
      }

      case 'requestDisclosurePermission': {
        explanation = (
          <View>
            <Text>
              { t('.requestDisclosurePermission', {serverName}) }
            </Text>
          </View>
        );

        break;
      }

      case 'success': {
        explanation = <Text>{ t(`.${status}Explanation`) }</Text>;
      }
    }

    return (
      <StatusCard
        explanation={explanation}
        heading={heading}
        navigateToEnrollment={navigateToEnrollment}
        session={session} />
    );
  }

  renderDisclosures() {
    const { makeDisclosureChoice, session, session: { status } } = this.props;
    if(status !== 'requestDisclosurePermission')
      return null;

    return (
      <DisclosureChoices
        makeDisclosureChoice={makeDisclosureChoice}
        session={session}
      />
    );
  }

  render() {
    const {
      forceValidation,
      navigateBack,
      nextStep,
      pinChange,
      session,
    } = this.props;

    return (
      <KeyboardAwareContainer>
        <Header title={t('.headerTitle')} navigateBack={navigateBack} />
        <PaddedContent>
          { this.renderStatusCard() }
          <Error session={session} />
          <PinEntry
            session={session}
            forceValidation={forceValidation}
            pinChange={pinChange}
          />
          <MissingDisclosures session={session} />
          <IssuedCredentials session={session} />
          { this.renderDisclosures() }
        </PaddedContent>
        <Footer
          navigateBack={navigateBack}
          nextStep={nextStep}
          session={session}
        />
      </KeyboardAwareContainer>
    );
  }
}
