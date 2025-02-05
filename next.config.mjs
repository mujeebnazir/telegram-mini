/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
      return config;
    },
    async headers() {
      return [
        {
          source: '/api/bot/:path*',
          headers: [
            { key: 'Content-Type', value: 'application/json' },
          ],
        },
      ];
    },
  }
  
  export default nextConfig;