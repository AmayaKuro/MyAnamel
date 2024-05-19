/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
            {
                protocol: 'https',
                hostname: '*.ophim*',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '*.ytimg.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '*.amayakuro.id.vn',
                port: '',
            },
        ],
    },
};

export default nextConfig;
