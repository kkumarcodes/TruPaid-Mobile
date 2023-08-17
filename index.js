/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import codePush from "react-native-code-push";

let app = App

// enable codepush only in release
if (!__DEV__) {
  app = codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_RESTART,
    mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  })(app)
}

AppRegistry.registerComponent(appName, () => app)
