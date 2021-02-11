import { Platform } from "react-native";
import sensitiveInfo, { SensitiveInfoEntry } from "react-native-sensitive-info";

export default function (options = {} as sensitiveInfo.RNSensitiveInfoOptions) {
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
    android: Object.keys,
    ios: (items: Array<Array<SensitiveInfoEntry>>) =>
      items[0].map((item) => item.key),
  });

  function noop(_: null, result: string[]): void;
  function noop(_: null, result: string | null): void;
  function noop(error: unknown): void;
  function noop() {
    return null;
  }

  return {
    async getItem(key: string, callback = noop) {
      try {
        // getItem() returns `null` on Android and `undefined` on iOS;
        // explicitly return `null` here as `undefined` causes an exception
        // upstream.
        let result: string | null = await sensitiveInfo.getItem(key, options);

        if (typeof result === "undefined") {
          result = null;
        }

        callback(null, result);

        return result;
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async setItem(key: string, value: string, callback = noop) {
      try {
        await sensitiveInfo.setItem(key, value, options);
        callback(null);
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async removeItem(key: string, callback = noop) {
      try {
        await sensitiveInfo.deleteItem(key, options);
        callback(null);
      } catch (error) {
        callback(error);
        throw error;
      }
    },

    async getAllKeys(callback = noop) {
      try {
        const values = await sensitiveInfo.getAllItems(options);

        if (typeof extractKeys === "undefined")
          throw new Error("Platform not supported");

        const result = extractKeys(values);

        callback(null, result);

        return result;
      } catch (error) {
        callback(error);
        throw error;
      }
    },
  };
}
