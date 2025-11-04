/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    turbopack: {
        rules: {
            '*.csv': {
                loaders: ['csv-loader'],
                as: '*.js',
            },
        },
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.csv$/,
            loader: 'csv-loader',
            options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true
            }
        })
        return config
    },
}

export default nextConfig
