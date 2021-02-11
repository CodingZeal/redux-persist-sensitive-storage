import sensitiveInfo from "react-native-sensitive-info";
export default function (
  options?: sensitiveInfo.RNSensitiveInfoOptions
): {
  getItem(
    key: string,
    callback?: {
      (_: null, result: string[]): void;
      (_: null, result: string | null): void;
      (error: unknown): void;
    }
  ): Promise<string | null>;
  setItem(
    key: string,
    value: string,
    callback?: {
      (_: null, result: string[]): void;
      (_: null, result: string | null): void;
      (error: unknown): void;
    }
  ): Promise<void>;
  removeItem(
    key: string,
    callback?: {
      (_: null, result: string[]): void;
      (_: null, result: string | null): void;
      (error: unknown): void;
    }
  ): Promise<void>;
  getAllKeys(callback?: {
    (_: null, result: string[]): void;
    (_: null, result: string | null): void;
    (error: unknown): void;
  }): Promise<string[]>;
};
