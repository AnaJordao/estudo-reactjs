/** @type {import('jest').Config} */
const config = {
    verbose: true,
    transformIgnorePatterns: ["/node_modules/(?!@bundled-es-modules)"]
  };
  
  module.exports = config;