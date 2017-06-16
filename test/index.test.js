import { Platform } from "react-native";
import sensitiveInfo from "react-native-sensitive-info";
import td from "testdouble";

import createSensitiveStorage from "../index";

jest.mock(
  "react-native-sensitive-info",
  () => require("./mocks/react-native-sensitive-info").default
);

jest.mock("react-native", () => ({
  Platform: {
    select: jest.fn()
  }
}));

describe("redux-persist-sensitive-storage", () => {
  const service = "KEYCHAIN_SERVICE";
  const options = {
    keychainService: service,
    sharedPreferencesName: "PREFS"
  };
  const createStorage = (platform = "ios") => {
    Platform.select.mockImplementation(obj => obj[platform]);
    return createSensitiveStorage(options);
  };
  const storage = createStorage();

  describe("getItem()", () => {
    describe("with a normal result", () => {
      beforeEach(() => {
        td.when(sensitiveInfo.getItem("KEY", options)).thenResolve("VALUE");
      });

      it("returns the value", () => {
        return expect(storage.getItem("KEY")).resolves.toBe("VALUE");
      });

      it("calls the callback with the value", done => {
        const callback = makeCallback(done, (_err, result) => {
          expect(result).toBe("VALUE");
        });

        storage.getItem("KEY", callback);
      });
    });

    describe("with an error", () => {
      beforeEach(() => {
        td.when(sensitiveInfo.getItem("KEY", options)).thenReject("ERROR");
      });

      it("re-throws the error", () => {
        return expect(storage.getItem("KEY")).rejects.toBe("ERROR");
      });

      it("calls the callback with the error", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBe("ERROR");
        });

        storage.getItem("KEY", callback);
      });
    });

    describe("sanitizing the result", () => {
      it("converts undefined to null", () => {
        td.when(sensitiveInfo.getItem("KEY", options)).thenResolve(undefined);

        return expect(storage.getItem("KEY")).resolves.toBeNull();
      });

      it("does not convert other falsy values to null", () => {
        td.when(sensitiveInfo.getItem("KEY", options)).thenResolve(0);

        return expect(storage.getItem("KEY")).resolves.toBe(0);
      });
    });
  });

  describe("setItem()", () => {
    describe("when successful", () => {
      it("forwards the value", async () => {
        await storage.setItem("KEY", "VALUE");

        td.verify(sensitiveInfo.setItem("KEY", "VALUE", options));
      });

      it("calls the callback", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBeNull();
        });

        storage.setItem("KEY", "VALUE", callback);
      });
    });

    describe("with an error", () => {
      beforeEach(() => {
        td
          .when(sensitiveInfo.setItem("KEY", "VALUE", options))
          .thenReject("ERROR");
      });

      it("re-throws the error", () => {
        return expect(storage.setItem("KEY", "VALUE")).rejects.toBe("ERROR");
      });

      it("calls the callback with the error", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBe("ERROR");
        });

        storage.setItem("KEY", "VALUE", callback);
      });
    });
  });

  describe("removeItem()", () => {
    describe("when successful", () => {
      it("forwards the request", async () => {
        await storage.removeItem("KEY");

        td.verify(sensitiveInfo.deleteItem("KEY", options));
      });

      it("calls the callback", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBeNull();
        });

        storage.removeItem("KEY", callback);
      });
    });

    describe("with an error", () => {
      beforeEach(() => {
        td.when(sensitiveInfo.deleteItem("KEY", options)).thenReject("ERROR");
      });

      it("re-throws the error", () => {
        return expect(storage.removeItem("KEY")).rejects.toBe("ERROR");
      });

      it("calls the callback with the error", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBe("ERROR");
        });

        storage.removeItem("KEY", callback);
      });
    });
  });

  describe("getAllKeys()", () => {
    describe("with a normal result", () => {
      const expectedResult = ["KEY1", "KEY2", "KEY3"];

      describe("on iOS", () => {
        const iOSStorage = createStorage("ios");

        beforeEach(() => {
          const items = [
            [
              { service, key: "KEY1", value: "VALUE1" },
              { service, key: "KEY2", value: "VALUE2" },
              { service, key: "KEY3", value: "VALUE3" }
            ]
          ];

          td.when(sensitiveInfo.getAllItems(options)).thenResolve(items);
        });

        it("extracts and returns the keys", () => {
          return expect(iOSStorage.getAllKeys()).resolves.toEqual(
            expectedResult
          );
        });

        it("calls the callback with the keys", done => {
          const callback = makeCallback(done, (_err, result) => {
            expect(result).toEqual(expectedResult);
          });

          iOSStorage.getAllKeys(callback);
        });
      });

      describe("on Android", () => {
        const androidStorage = createStorage("android");

        beforeEach(() => {
          const items = { KEY1: "VALUE1", KEY2: "VALUE2", KEY3: "VALUE3" };

          td.when(sensitiveInfo.getAllItems(options)).thenResolve(items);
        });

        it("extracts and returns the keys", () => {
          return expect(androidStorage.getAllKeys()).resolves.toEqual(
            expectedResult
          );
        });
      });
    });

    describe("with an error", () => {
      beforeEach(() => {
        td.when(sensitiveInfo.getAllItems(options)).thenReject("ERROR");
      });

      it("re-throws the error", () => {
        return expect(storage.getAllKeys()).rejects.toBe("ERROR");
      });

      it("calls the callback with the error", done => {
        const callback = makeCallback(done, err => {
          expect(err).toBe("ERROR");
        });

        storage.getAllKeys(callback);
      });
    });
  });
});

function makeCallback(done, body) {
  return (...args) => {
    try {
      body(...args);
      done();
    } catch (error) {
      done.fail(error);
    }
  };
}
