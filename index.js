import { Platform } from "react-native";
import sensitiveInfo from "react-native-sensitive-info";

export default function(options = {}) {
  // react-native-sensitive-info returns different a different structure on iOS
  // than it does on Android.
  //
  // iOS:
  // [
  //   [
  //     { service: 'app', key: 'foo', value: 'bar' },
  //     { service: 'app', key: 'baz', value: 'quux' }
  //   ]
  // ]
  //
  // Android:
  // {
  //   foo: 'bar',
  //   baz: 'quux'
  // }
  //
  // See https://github.com/mCodex/react-native-sensitive-info/issues/8
  //
  // `extractKeys` adapts for the different structure to return the list of
  // keys.
  const extractKeys = Platform.select({
    ios: items => items[0].map(item => item.key),
    android: Object.keys
  });

  return {
    async getItem(key, callback) {
      try {
        // getItem() returns `null` on Android and `undefined` on iOS;
        // explicitly return `null` here as `undefined` causes an exception
        // upstream.
        let result = await sensitiveInfo.getItem(key, options);

        if (typeof result === "undefined") {
          result = null;
        }

        callback && callback(null, result);

        return result;
      } catch (error) {
        callback && callback(error);
        throw error;
      }
    },

    async setItem(key, value, callback) {
      try {
        await sensitiveInfo.setItem(key, value, options);
        callback && callback(null);
      } catch (error) {
        callback && callback(error);
        throw error;
      }
    },

    async removeItem(key, callback) {
      try {
        await sensitiveInfo.deleteItem(key, options);
        callback && callback(null);
      } catch (error) {
        callback && callback(error);
        throw error;
      }
    },

    async getAllKeys(callback) {
      try {
        const values = await sensitiveInfo.getAllItems(options);
        const result = extractKeys(values);

        callback && callback(null, result);

        return result;
      } catch (error) {
        callback && callback(error);
        throw error;
      }
    }
  };
}
