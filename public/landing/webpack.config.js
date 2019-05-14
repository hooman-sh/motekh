const webpack = require('webpack')

const plugins = []

plugins.push(new webpack.DefinePlugin({
	'process.env': {
		'NODE_ENV': process.env.NODE_ENV
	}
}));
const isProd = (process.env.NODE_ENV === 'prod')
if (isProd == true) {
	console.log(isProd);
	postcssPlugins.push(require('pixrem'))
	postcssPlugins.push(require('autoprefixer'))
}
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CssoWebpackPlugin = require('csso-webpack-plugin').default;

module.exports = env => {
	console.log(isProd);
	const sourcemap = !isProd
	const postcssPlugins = [
		require('postcss-import')
	]



	return {
		devtool: 'source-map',


		entry: "./index.js",


		output: {
			path: path.resolve('./assets/'),
			filename: 'js/bundle.js',
			publicPath: '/assets/'
			// library: 'bundle'
		},


		module: {
			rules: [{
					test: /\.styl$/,
					use: ExtractTextPlugin.extract({
						use: [{
								loader: 'css-loader',
								options: {
									url: false,
									sourceMap: sourcemap
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
									sourceMap: sourcemap
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

			// new webpack.ProvidePlugin({
			// 	$: 'jquery',
			// 	jQuery: 'jquery',
			// 	"window.$": 'jquery',
			// 	'window.jQuery': 'jquery'
			// }),

			// new UglifyJSPlugin({
			// 	comments: false,
			// 	mangle: false
			// }),

			new ExtractTextPlugin('css/app.v7.min.css'),

			(isProd) && new CssoWebpackPlugin({
				devtool: 'source-map',
				comments: false
			})

			// new BrowserSyncPlugin(
			//   // BrowserSync options
			//   {
			//     // browse to http://localhost:3000/ during development
			//     host: 'localhost',
			//     port: 3000,
			//     // proxy the Webpack Dev Server endpoint
			//     // (which should be serving on http://localhost:3100/)
			//     // through BrowserSync
			//     proxy: 'http://localhost:8080/'
			//   },
			//   // plugin options
			//   {
			//     // prevent BrowserSync from reloading the page
			//     // and let Webpack Dev Server take care of this
			//     reload: false
			//   }
			// )
		],

		resolve: {

			alias: {
				App: path.resolve(__dirname, './src/app.module.js'),
				Component: path.resolve(__dirname, './src/components'),
				Modules: path.resolve(__dirname, './node_modules'),
				Style: path.resolve(__dirname, './src/styles/app.styl')
			},

			extensions: ['.styl']

		},

		// devServer: {
		// 	contentBase: '.',
		// 	open: true,
		// 	stats: {
		// 		colors: true
		// 	}
		// }
	}
}
