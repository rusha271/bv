import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Disable dev tools UI completely
  devIndicators: false,

  // ✅ Ignore TypeScript errors in production builds (for Vercel)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Ignore ESLint errors during Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Add CORS headers for API routes
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // ✅ Optimize for Vercel deployment
  output: 'standalone',
  
  // ✅ Enable experimental features for better performance
  // experimental: {
  //   serverComponentsExternalPackages: ['@xenova/transformers'],
  //   optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  // },

  // ✅ Configure images for better performance
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/static/**',
      },
    ],
    unoptimized: false,
  },

  // ✅ Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  webpack: (config, { isServer }) => {
    // Handle WebAssembly files for transformers.js
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // Handle ONNX files
    config.module.rules.push({
      test: /\.onnx$/,
      type: 'asset/resource',
    });

    // Handle binary files
    config.module.rules.push({
      test: /\.bin$/,
      type: 'asset/resource',
    });

    // Handle JSON files for model configs
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    // Add fallbacks for Node.js modules when running in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        url: false,
        querystring: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        constants: false,
        events: false,
        punycode: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        vm: false,
        worker_threads: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        domain: false,
        module: false,
        net: false,
        readline: false,
        repl: false,
        tls: false,
        v8: false,
        inspector: false,
        perf_hooks: false,
        async_hooks: false,
      };
    }

    // ✅ Optimize bundle size for Vercel
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  // Configuration for external packages
  serverExternalPackages: ['@xenova/transformers'],

  // Turbopack configuration (updated format)
  turbopack: {
    rules: {
      '*.wasm': {
        loaders: ['file-loader'],
        as: '*.wasm',
      },
      '*.onnx': {
        loaders: ['file-loader'],
        as: '*.onnx',
      },
      '*.bin': {
        loaders: ['file-loader'],
        as: '*.bin',
      },
    },
  },
};

export default nextConfig;
