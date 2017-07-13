# redux-persist-sensitive-storage

[![npm version](https://badge.fury.io/js/redux-persist-sensitive-storage.svg)](https://www.npmjs.com/package/redux-persist-sensitive-storage)
[![CircleCI](https://circleci.com/gh/CodingZeal/redux-persist-sensitive-storage.svg?style=shield)](https://circleci.com/gh/CodingZeal/redux-persist-sensitive-storage)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Storage engine to use [react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info) with [redux-persist](https://github.com/rt2zz/redux-persist).

react-native-sensitive-info manages all data stored in Android Shared Preferences and iOS Keychain.

**NOTE:** Android Shared Preferences are not secure, but there is [a branch of react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info/tree/keystore) that uses the Android keystore instead of shared preferences.  You can use that branch with redux-persist-sensitive-storage if you prefer.

## Installation

You can install this package using either `yarn` or `npm`.  You will also need to install and link [react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info).

Using Yarn:
```
yarn add redux-persist-sensitive-storage react-native-sensitive-info
react-native link react-native-sensitive-info
```

Using npm:
```
npm install --save redux-persist-sensitive-storage react-native-sensitive-info
react-native link react-native-sensitive-info
```

## Usage

To use redux-persist-sensitive-storage, configure redux-persist according to [its documentation](https://github.com/rt2zz/redux-persist#redux-persist).

Modify the `persistStore` call as follows:

```js
import createSensitiveStorage from "redux-persist-sensitive-storage";

// ...

persistStore(store, { storage: createSensitiveStorage(options) });
```

`options` is optional and are used to configure the keychain service (iOS) and shared preferences name (Android) that react-native-sensitive-info uses.  See [the documentation](https://github.com/mCodex/react-native-sensitive-info#methods) for more information.

Here's a full example:

```js
import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...),
    autoRehydrate()
  )
);

persistStore(store, {
  storage: createSensitiveStorage({
    keychainService: "myKeychain",
    sharedPreferencesName: "mySharedPrefs"
  });
);
```
