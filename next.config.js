/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false, brotli: false };
      config.module.rules.push({
        test: /node_modules[\\/]brotli[\\/].*\.js$/,
        use: {
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: 'require\\("fs"\\)', replace: '{}', flags: 'g' },
              { search: 'require\\("path"\\)', replace: '{}', flags: 'g' },
            ],
          },
        },
      });
    }
    return config;
  },
};

module.exports = nextConfig;