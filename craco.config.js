module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' &&
                        require.resolve('react-dev-utils/webpackHotDevClient'), './src/index.tsx'].filter(Boolean),
                    worker: './src/chrome/scrape_worker.ts',
                    content: './src/chrome/scrape_content_script.ts',

                },
                output: {
                    ...webpackConfig.output,
                    filename: '[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
            }
        },
    }
}