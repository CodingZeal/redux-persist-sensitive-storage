"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_sensitive_info_1 = __importDefault(require("react-native-sensitive-info"));
function default_1(options = {}) {
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
    const extractKeys = react_native_1.Platform.select({
        android: Object.keys,
        ios: (items) => items[0].map((item) => item.key),
    });
    function noop() {
        return null;
    }
    return {
        getItem(key, callback = noop) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // getItem() returns `null` on Android and `undefined` on iOS;
                    // explicitly return `null` here as `undefined` causes an exception
                    // upstream.
                    let result = yield react_native_sensitive_info_1.default.getItem(key, options);
                    if (typeof result === "undefined") {
                        result = null;
                    }
                    callback(null, result);
                    return result;
                }
                catch (error) {
                    callback(error);
                    throw error;
                }
            });
        },
        setItem(key, value, callback = noop) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield react_native_sensitive_info_1.default.setItem(key, value, options);
                    callback(null);
                }
                catch (error) {
                    callback(error);
                    throw error;
                }
            });
        },
        removeItem(key, callback = noop) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield react_native_sensitive_info_1.default.deleteItem(key, options);
                    callback(null);
                }
                catch (error) {
                    callback(error);
                    throw error;
                }
            });
        },
        getAllKeys(callback = noop) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const values = yield react_native_sensitive_info_1.default.getAllItems(options);
                    if (typeof extractKeys === "undefined")
                        throw new Error("Platform not supported");
                    const result = extractKeys(values);
                    callback(null, result);
                    return result;
                }
                catch (error) {
                    callback(error);
                    throw error;
                }
            });
        },
    };
}
exports.default = default_1;
