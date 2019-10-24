import { Storage } from "redux-persist";
import { RNSensitiveInfoOptions } from "react-native-sensitive-info";

export interface ReduxPersistSensitiveStorage extends Storage {
  getAllKeys(
    callback?: (error?: Error, result?: [string]) => void
  ): Promise<[string] | null>;
}

declare function createSensitiveStorage(
  options: RNSensitiveInfoOptions
): ReduxPersistSensitiveStorage

export default createSensitiveStorage;
