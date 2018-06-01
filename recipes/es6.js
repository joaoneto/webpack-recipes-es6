const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('../package');

module.exports.recipe = {
  name: package.name,
  version: package.version,
  description: package.description,
  command: {
    command: 'build',
    describe: 'transpile and build all in ./dist dir',
    builder: {
      mode: {
        describe: 'webpack mode',
        default: 'development'
      }
    },
    handler: (argv) => {
      console.log('Initializing build...\n');
    }
  },
  hooks: {
    before: () => {},
    after: (webpackConfig) => {
      const compiler = webpack(webpackConfig);
      compiler.run((err, stats) => {
        if (err) process.stderr.write(err.toString() + '\n');
        process.stdout.write(stats.toString() + '\n');
      });
    }
  }
};

module.exports.webpackConfig = function (argv) {
  return {
    target: 'web',

    mode: argv.mode,

    devtool: 'source-map',

    entry: {
      app: path.resolve('./src/index.js')
    },

    output: {
      path: path.resolve('./dist'),
      publicPath: '/',
      filename: 'assets/js/[name].[hash:8].js',
      chunkFilename: 'assets/js/[id].[hash:8].js'
    },

    resolve: {
      extensions: ['.json', '.js', '.css'],
      descriptionFiles: ['package.json'],
      modules: [
        path.resolve('./app'),
        'node_modules',
      ]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve('./app')],
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }
          ]
        }
      ]
    },

    optimization: {
      splitChunks: {
        minSize: Infinity,
        cacheGroups: {
          default: false,
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'initial',
            enforce: true
          }
        }
      }
    },

    plugins: [
      new HtmlWebpackPlugin({
        chunks: ['app'],
        template: './src/index.html'
      }),
    ],

  }
};
