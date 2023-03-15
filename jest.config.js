const path = require("path");

const packagePaths = {
    '@manito/common': '<rootDir>/src/lib/js/manito/common',
    '@manito/core-ui-components': '<rootDir>/src/lib/js/manito/core-ui-components',
    '@manito/app': '<rootDir>/src/web/app',
};

module.exports = {
  preset: "ts-jest",
  // moduleNameMapper: {
  //   "^.+\\.(css|less|scss)$": "babel-jest",
  //   ...Object.entries(packagePaths).map(([packageName, packagePath]) => [
  //     `${packageName}(.*)$`, `${packagePath}/src/$1`
  //   ]),
  // },
  // modulePathIgnorePatterns: [
  //   ...Object.values(packagePaths).map((packagePath) => path.join(packagePath, 'dist')),
  // ],
  projects: [
    ...Object.values(packagePaths),
  ]
};