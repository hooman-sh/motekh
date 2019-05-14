const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var postcssPlugins = [
	require('postcss-import'),
	require('postcss-cssnext')({
		features: {
			initial: false
		}
	})
]
var isProd;

module.exports = {

		devtool: (!isProd) ? 'source-map' : false,

		entry: "./index.js",

		output: {
			path: path.resolve('./assets/'),
			filename: 'js/bundle.js',
			publicPath: '/assets/'
		},

		module: {
			rules: [{
					test: /\.styl$/,
					use: ExtractTextPlugin.extract({
						use: [{
								loader: 'css-loader',
								options: {
									url: false,
									sourceMap: !isProd
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: true,
									plugins: () => postcssPlugins
								}
							},
							{
								loader: 'stylus-loader',
								options: {
									preferPathResolver: 'webpack'
								}
							}
						]
					})
				},

				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: [{
								loader: 'css-loader',
								options: {
									url: false,
									sourceMap: !isProd
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: true,
									plugins: () => postcssPlugins
								}
							}
						]
					})
				}

			]
		},

		plugins: [

			new ExtractTextPlugin('css/app.v32.min.css'),

		],

		resolve: {

			alias: {
				App: path.resolve(__dirname, './src/app.module.js'),
				Component: path.resolve(__dirname, './src/components'),
				Modules: path.resolve(__dirname, './node_modules'),
				Style: path.resolve(__dirname, './src/styles/app.styl')
			},

			extensions: ['.styl']

		}

}
