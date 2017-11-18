const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'PlatforMe', template: 'game.html' }),
        new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }])
    ],
    watch: true,
    module: {
        rules: [
          {
              test: /\.css$/,
              use: [
                'style-loader',
                'css-loader'
              ]
          },
         {
             test: /\.(png|svg|jpg|gif)$/,
             use: [
               'file-loader'
             ]
         }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};