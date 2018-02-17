import { StackNavigator } from 'react-navigation';

import About from 'components/About';
import CredentialDashboardContainer from './CredentialDashboardContainer';
import LogDashboard from 'components/LogDashboard';
import PreferencesDashboard from 'components/PreferencesDashboard';
import QRScanner from 'components/QRScanner';
import Session from 'components/Session';

export default StackNavigator({
  About: { screen: About },
  CredentialDashboard: { screen: CredentialDashboardContainer },
  LogDashboard: {screen: LogDashboard},
  PreferencesDashboard: {screen: PreferencesDashboard },
  QRScanner: { screen: QRScanner },
  Session: { screen: Session },
}, {
  initialRouteName: 'CredentialDashboard'
});
