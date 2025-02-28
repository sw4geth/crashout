// Mock electron module for the browser
module.exports = {
  app: {
    isReady: () => true,
    on: () => {},
    once: () => {},
  },
  // Add other electron APIs as needed, but as empty implementations
};