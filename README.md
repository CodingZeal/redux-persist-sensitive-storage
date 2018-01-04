# redux-persist-sensitive-storage

[![npm version](https://badge.fury.io/js/redux-persist-sensitive-storage.svg)](https://www.npmjs.com/package/redux-persist-sensitive-storage)
[![CircleCI](https://circleci.com/gh/CodingZeal/redux-persist-sensitive-storage.svg?style=shield)](https://circleci.com/gh/CodingZeal/redux-persist-sensitive-storage)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Storage engine to use [react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info) with [redux-persist](https://github.com/rt2zz/redux-persist).

react-native-sensitive-info manages all data stored in Android Shared Preferences and iOS Keychain.

**NOTE:** Android Shared Preferences are not secure, but there is [a branch of react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info/tree/keystore) that uses the Android keystore instead of shared preferences.  You can use that branch with redux-persist-sensitive-storage if you prefer.

## Installation

You can install this package using either `yarn` or `npm`.  You will also need to install and link [react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info).

1. Install modules using `yarn` or `npm`:

  `yarn add redux-persist-sensitive-storage react-native-sensitive-info`

  or

  `npm install --save redux-persist-sensitive-storage react-native-sensitive-info`

1. After installing the modules link `react-native-sensitive-info` using the following command:

  `react-native link react-native-sensitive-info`

## Usage

To use redux-persist-sensitive-storage, create a sensitive storage instance using `createSensitiveStorage` and then
configure redux-persist according to [its documentation](https://github.com/rt2zz/redux-persist#redux-persist) using your instance as the storage argument in the configuration.

`createSensitiveStorage` takes an optional set of configuration options. These are used to configure the keychain service (iOS) and shared preferences name (Android) that react-native-sensitive-info uses.  See [their documentation](https://github.com/mCodex/react-native-sensitive-info#methods) for more information.

### For redux-persist v5.x or later

```js
import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";
import reducers from "./reducers"; // where reducers is an object of reducers

const storage = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs"
});

const config = {
  key: "root",
  storage,
};

const reducer = persistCombineReducers(config, reducers);

function configureStore () {
  // ...
  let store = createStore(reducer);
  let persistor = persistStore(store);

  return { persistor, store };
}
```

You may want to only persist some keys in secure storage, and persist other parts of your state in local storage. If that's the case, you can use redux-persist's [Nested Persists](https://github.com/rt2zz/redux-persist#nested-persists) support.  Your configuration might look something like this:

```js
import { AsyncStorage } from "react-native";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";

import { mainReducer, tokenReducer } from "./reducers";

const sensitiveStorage = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs"
});

const mainPersistConfig = {
  key: "main",
  storage: AsyncStorage,
  blacklist: ["someEphemeralKey"]
};

const tokenPersistConfig = {
  key: "token",
  storage: sensitiveStorage
};

let rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer),
  token: persistReducer(tokenPersistConfig, tokenReducer)
});
```

### For redux-persist v4.x

Modify the `persistStore` call as follows:

```js
import createSensitiveStorage from "redux-persist-sensitive-storage";

// ...

persistStore(store, { storage: createSensitiveStorage(options) });
```

Here is a more complete example:

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
