const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev, isServer }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    );

    if (dev && !isServer) {
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: ['react-refresh/babel'],
        },
      });
    }

    

    return config;
  },


  images: {
    unoptimized: true,
  },

  distDir: 'custom_build',
});
