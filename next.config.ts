import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle Node.js modules that should be ignored in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      electron: false,
      fs: false,
      net: false,
      tls: false,
      'graceful-fs': false,
      https: false,
      http: false,
      stream: require.resolve('stream-browserify'),
      zlib: false,
      os: false,
      path: false,
      crypto: require.resolve('crypto-browserify'),
      'electron-fetch': false,
      buffer: require.resolve('buffer/'),
    };
    
    // Add buffer to the providePlugin
    config.plugins.push(
      new config.constructor.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    );
    
    return config;
  },
};

export default nextConfig;
