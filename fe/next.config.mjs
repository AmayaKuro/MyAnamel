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
                hostname: '*.amayakuro.id.vn',
                port: '',
            },
        ],
    },
};
// TODO: Need to add mp4 here??

export default nextConfig;
