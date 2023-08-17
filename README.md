# trupaid-app-kickoff-sah
After cloning this repo, you will need to install the dependencies:

`cd ProjectName`

`npm install` or `yarn install`

Then, you need to install the Podfile:

`cd ios`

`pod install`


## Running with React Native CLI

### Running android simulator

1. Activate android emulator following this [instructions](https://facebook.github.io/react-native/docs/running-on-device)
2. `react-native run-android` from project home folder

### Running iOS simulator

1. Go to `ios` folder and run `pod install` (if you don't have pod installed, follow this [instructions](https://guides.cocoapods.org/using/getting-started.html) )
2. Run `react-native run-ios` from project home folder.


### Building Android apk
1. In the terminal, go to android directly(cd android).
2. Run './gradlew app:assembleRelease'
3. You will see the built apk from /android/app/build/outputs/apk/release

### Building iOS
1. Open xcode and goto General tab.
2. Increase the Build number from next build(For initial version, version: 1.0 and build: 1)
3. Select Any iOS Device from scheme.
4. Select Product/Archive from the menu.
5. Once the archiving is completed, click Distribute app.
6. Select next until you see Upload screen.
7. Click upload to upload iOS app to the Testflight.


### Environments

1. node `v16.13.0`
2. npm  `8.1.0`
3. yarn `v1.22.17`
4. Xcode `12.0.1`
