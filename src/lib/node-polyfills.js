// This file provides browser polyfills for Node.js modules that are used by the Uniswap widget
if (typeof window !== 'undefined') {
  // Polyfill for fs module
  window.fs = {
    readFileSync: () => null,
    writeFileSync: () => null,
    readFile: () => null,
    writeFile: () => null,
  };
  
  // Polyfill for path module
  window.path = {
    normalize: (p) => p,
    resolve: (...args) => args.join('/'),
    join: (...args) => args.join('/'),
  };
  
  // Add other Node.js module polyfills as needed
}

export {};