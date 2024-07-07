import webpack from 'webpack';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // Warning: This might suppress other linting errors as well
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Add the ProvidePlugin configuration
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
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

    // Important: return the modified config
    return config;
  },

  // output: 'export',
  images: {
    unoptimized: true,
  },

  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/chat': { page: '/chat' }
    };
  },

  distDir: 'custom_build', // Custom output directory for the build
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
