const path = require('path');

const rewireEntries = [
    {
        name: 'options-page',
        entry: path.resolve(__dirname, './src/options-page/options_page.tsx'),
        template: path.resolve(__dirname, './public/options_page.html'),
        outPath: 'options_page.html',
    },
    {
        name: 'context-page',
        entry: path.resolve(__dirname, './src/context-page/context-page.tsx'),
        template: path.resolve(__dirname, './public/context-page.html'),
        outPath: 'context-page.html',
    }
];

const defaultEntryName = 'main';

const appIndexes = ['js', 'tsx', 'ts', 'jsx'].map((ext) =>
    path.resolve(__dirname, `src/index.${ext}`)
);

// Credit to this very helpful Github response for this code: https://github.com/dilanx/craco/issues/298#issuecomment-1046181546
function webpackMultipleEntries(config) {
    // Multiple Entry JS
    const defaultEntryHTMLPlugin = config.plugins.filter((plugin) => {
        return plugin.constructor.name === 'HtmlWebpackPlugin';
    })[0];
    defaultEntryHTMLPlugin.userOptions.chunks = [defaultEntryName];

    // config.entry is not an array in Create React App 4
    if (!Array.isArray(config.entry)) {
        config.entry = [config.entry];
    }

    // If there is only one entry file then it should not be necessary for the rest of the entries
    const necessaryEntry =
        config.entry.length === 1
            ? []
            : config.entry.filter((file) => !appIndexes.includes(file));
    const multipleEntry = {};
    multipleEntry[defaultEntryName] = config.entry;

    rewireEntries.forEach((entry) => {
        multipleEntry[entry.name] = necessaryEntry.concat(entry.entry);
        // Multiple Entry HTML Plugin
        config.plugins.unshift(
            new defaultEntryHTMLPlugin.constructor(
                Object.assign({}, defaultEntryHTMLPlugin.userOptions, {
                    filename: entry.outPath,
                    template: entry.template,
                    chunks: [entry.name],
                })
            )
        );
    });
    config.entry = multipleEntry;

    // Multiple Entry Output File
    let names = config.output.filename.split('/').reverse();

    if (names[0].indexOf('[name]') === -1) {
        names[0] = '[name].' + names[0];
        config.output.filename = names.reverse().join('/');
    }

    return config;
}

module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            let config = webpackMultipleEntries(webpackConfig);
            return {
                ...config,
                entry: {
                    ...config.entry,
                    worker: './src/scripts/parse_worker.ts',
                    content: './src/scripts/scrape_content_script.ts',
                },
                output: {
                    ...config.output,
                    filename: '[name].js',
                },
                optimization: {
                    ...config.optimization,
                    runtimeChunk: false,
                },
            }
        }
    },
};