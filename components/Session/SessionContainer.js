import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IssuanceSession from './IssuanceSession';
import DisclosureSession from './DisclosureSession';
import SigningSession from './SigningSession';

import fullCredentials from 'store/mappers/fullCredentials';
import fullDisclosuresCandidates from 'store/mappers/fullDisclosuresCandidates';
import fullMissingDisclosures from 'store/mappers/fullMissingDisclosures';

import {
  Container,
  Text,
} from 'native-base';

import PaddedContent from 'lib/PaddedContent';

const mapStateToProps = (state, props) => {
  const {
    navigation,
  } = props;

  const { sessionId } = navigation.state.params;

  const {
    credentials: {
      credentials,
    },
    irmaConfiguration,
    sessions: {
      [sessionId]: bareSession
    }
  } = state;

  const session = {
    ...bareSession,
    issuedCredentials: fullCredentials(bareSession.issuedCredentials, irmaConfiguration),
    disclosuresCandidates: fullDisclosuresCandidates(bareSession.disclosuresCandidates, irmaConfiguration, credentials),
    missingDisclosures: fullMissingDisclosures(bareSession.missingDisclosures, irmaConfiguration),
  };

  return {
    irmaConfiguration,
    session
  };
};

@connect(mapStateToProps)
export default class SessionContainer extends Component {

  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    irmaConfiguration: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  }

  state = {
    forceValidation: false,
    pin: null,

    // Meant for disclosure in issuance and signing
    showDisclosureStep: false
  }

  componentWillUnmount() {
    this.dismiss();
  }

  navigateBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  navigateToEnrollment() {
    const {
      dispatch,
      navigation,
      session: {
        missingSchemeManagerId: schemeManagerId
      }
    } = this.props;

    dispatch({
      type: 'Enrollment.Start',
      schemeManagerId
    });

    navigation.goBack();

    // Fuck you React Navigation #1127
    setTimeout(
      () => navigation.navigate('Enrollment', { schemeManagerId }),
      250
    );
  }

  makeDisclosureChoice(disclosureIndex, Type, CredentialHash) {
    const { dispatch, session } = this.props;

    dispatch({
      type: 'Session.MakeDisclosureChoice',
      sessionId: session.id,
      disclosureIndex,
      choice: {Type, CredentialHash},
    });
  }

  pinChange(pin) {
    this.setState({pin});
  }

  dismiss() {
    const { dispatch, session } = this.props;

    dispatch({
      type: 'IrmaBridge.DismissSession',
      sessionId: session.id,
    });
  }

  // TODO: This nextStep function has been overloaded with too many responsibilies
  // It should be refactored along with the different session screens.
  // It returns false only when proceeding on an invalid pin
  nextStep(proceed) {
    const { pin, showDisclosureStep } = this.state;
    const {
      dispatch,
      session: { id: sessionId, irmaAction, status, disclosures, disclosureChoices },
    } = this.props;

    // In case we proceed on issuance and there are attributes
    // to disclose, continue to the disclosure step
    if(proceed && irmaAction === 'issuing' &&
        !showDisclosureStep && disclosures.length > 0) {

      this.setState({showDisclosureStep: true});
      return true;
    }

    // In case we're on pin entry, give a pin response
    if(status === 'requestPin') {
      if(proceed && !pin) {
        this.setState({forceValidation: true});
        return false;
      }

      dispatch({
        type: 'IrmaBridge.RespondPin',
        sessionId,
        proceed,
        pin,
      });

      return true;
    }

    // In most other cases, continue to give a permission response
    dispatch({
      type: 'IrmaBridge.RespondPermission',
      sessionId,
      proceed,
      disclosureChoices,
    });

    return true;
  }

  render() {
    const { irmaConfiguration, session } = this.props;
    const { forceValidation, showDisclosureStep } = this.state;

    // Introduce a pseudo-status for when we're disclosing in issuance or signing
    let status = this.props.session.status;
    if(status === 'requestPermission' && showDisclosureStep)
      status = 'requestDisclosurePermission';

    const sessionProps = {
      forceValidation,
      irmaConfiguration,
      makeDisclosureChoice: ::this.makeDisclosureChoice,
      navigateBack: ::this.navigateBack,
      navigateToEnrollment: ::this.navigateToEnrollment,
      nextStep: ::this.nextStep,
      pinChange: ::this.pinChange,

      session: {
        ...session,
        status
      },
    };

    let content;
    switch(session.irmaAction) {
      case 'issuing':
        content = <IssuanceSession {...sessionProps} />;
        break;
      case 'disclosing':
        content = <DisclosureSession {...sessionProps} />;
        break;
      case 'signing':
        content = <SigningSession {...sessionProps} />;
        break;

      // Display an empty container while awaiting irmago response
      case undefined:
        return <Container />;

      default:
        return (
          <Container>
            <PaddedContent>
              <Text>Unrecognized IRMA action { session.irmaAction }.</Text>
            </PaddedContent>
          </Container>
        );
    }

    return content;
  }
}
