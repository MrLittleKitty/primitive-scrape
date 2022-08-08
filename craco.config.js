module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' &&
                        require.resolve('react-dev-utils/webpackHotDevClient'), './src/index.tsx'].filter(Boolean),
                    worker: './src/scripts/parse_worker.ts',
                    content: './src/scripts/scrape_content_script.ts',

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