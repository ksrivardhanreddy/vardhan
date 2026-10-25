/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: { unoptimized: true },
  devIndicators: false,
};

module.exports = nextConfig;
