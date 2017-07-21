# Change Log

All notable changes to this project will be documented in this file.  This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/CodingZeal/redux-persist-sensitive-storage/compare/v1.0.0...HEAD)

## [1.0.0](https://github.com/CodingZeal/redux-persist-sensitive-storage/compare/v0.1.0...1.0.0) - 2017-07-21

### Added

- Add installation and usage instructions to the README.([#2](https://github.com/CodingZeal/redux-persist-sensitive-storage/pull/2))

### Fixed

- Only return `null` from `getItem` if the underlying call returns `undefined`.  Originally, any falsy return value was getting converted to `undefined`. ([#1](https://github.com/CodingZeal/redux-persist-sensitive-storage/pull/1))

- Don't fail when a `callback` is not provided to `setItem`, `removeItem`, or `getAllKeys`. ([#1](https://github.com/CodingZeal/redux-persist-sensitive-storage/pull/1))

## 0.1.0 - 2017-06-14

Happy birthday!
