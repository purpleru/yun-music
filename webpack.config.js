
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const MiniCssExtract = require('mini-css-extract-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const autoprefixer = require('autoprefixer');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index.js',
        publicPath:'/'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    {
                        loader: MiniCssExtract.loader
                    }
                    ,
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer]
                            }
                        }
                    }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name][hash:6].[ext]',
                    outputPath: 'imgs',
                    esModule: false //不转为 esModule
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env', {
                                targets: {
                                    'ie': '9'
                                },
                                'corejs': '3',
                                'useBuiltIns': 'usage'
                            }
                        ]
                    ],
                    plugins: ['@babel/plugin-transform-runtime']
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html')
        }),
        new MiniCssExtract({
            filename: 'index.css'
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{
                from: path.join(__dirname, 'public'),
                globOptions: {
                    ignore: ['**/index.html']
                }
            }]
        })
    ],
    externals: {
        'jquery': 'jQuery'
    }
}