// pod install --repo-update
// https://github.com/zoontek/react-native-permissions/issues/449#issuecomment-618796631

import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
