const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CssoWebpackPlugin = require('csso-webpack-plugin').default
const isProd = true

module.exports = merge(common, {

	plugins: [

		new CssoWebpackPlugin({
			// devtool: false,
			comments: false
		}),

	]

})