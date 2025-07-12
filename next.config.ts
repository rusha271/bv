import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Ignore TypeScript errors in production builds (for Vercel)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Ignore ESLint errors during Vercel build
  eslint: {
    ignoreDuringBuilds: true,
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

    return config;
  },

  // Configuration for external packages
  serverExternalPackages: ['@xenova/transformers'],

  // Turbopack configuration
  experimental: {
    turbo: {
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
  },
};

export default nextConfig;
