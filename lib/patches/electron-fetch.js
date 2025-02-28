// This is a patched version of electron-fetch that doesn't rely on electron
// Copy the contents of node_modules/electron-fetch/lib/index.es.js but modify the electron parts

export * from 'electron-fetch/lib/index.js';

// Export a custom patched version that avoids the electron require issue
export default function fetch(url, opts) {
  // Your implementation that uses standard fetch or other browser-compatible approach
  return window.fetch(url, opts);
}