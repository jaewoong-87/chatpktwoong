/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  env: {
    API_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api" // 개발 환경일 때 API URL
        : "https://chat-pkts.vercel.app/api", // 프로덕션 환경일 때 API URL
  },
};

module.exports = nextConfig;
