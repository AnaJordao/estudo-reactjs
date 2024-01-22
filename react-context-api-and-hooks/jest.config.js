// /** @type {import('jest').Config} */
// const config = {
//     verbose: true,
//     transformIgnorePatterns: ["/node_modules/(?!@bundled-es-modules)"]
//   };
  
//   module.exports = config;

module.exports = {
  // ... outras configurações do Jest
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ["/node_modules/(?!@bundled-es-modules)"],
};