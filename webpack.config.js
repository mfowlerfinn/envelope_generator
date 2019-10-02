const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {

  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pdf.bundle.js',
    libraryTarget: 'var',
    library: 'pdfkit'
  },
  resolve: {
    alias: {
      fs: 'pdfkit/js/virtual-fs.js'
    }
  },
  module: {
    rules: [
      { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
      { test: /src[/\\]assets/, loader: 'arraybuffer-loader' },
      { test: /\.afm$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    })
  ]
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       terserOptions: {
  //         output: {
  //           comments: false,
  //         },
  //       },
  //       extractComments: false,
  //     }),
  //   ],
  // },
};