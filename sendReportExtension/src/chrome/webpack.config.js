const fs = require('fs')
const webpack = require('webpack')

try {
    fs.writeFileSync('dist/chrome/manifest.json', fs.readFileSync('src/chrome/manifest.json'))
    console.log('* copy success "manifest.json"')
    fs.writeFileSync('dist/chrome/manifest.json', fs.readFileSync('src/chrome/manifest.json'))
    console.log('* copy success "manifest.json"')
    fs.writeFileSync('dist/chrome/jspdf.js', fs.readFileSync('src/chrome/jspdf.js'))
    console.log('* copy success "jspdf.js"')
    fs.writeFileSync('dist/chrome/logo.png', fs.readFileSync('src/resources/logo.png'))
    console.log('* copy success "logo.png"')
} catch (error) {
    console.warn('*--  copy files fail, any path error ?')
}

try {
    fs.unlinkSync('dist/chrome/preview.html')
    fs.unlinkSync('dist/chrome/preview.js')
} catch (error) {
    console.warn('*--  deletes files fail, any path error ?')
}

module.exports = {
	entry: {
		content: './src/chrome/content',
		background: './src/chrome/background',
		//options: './src/chrome/options'
	},
	output: {
		path: './dist/chrome',
		filename: '[name].js'
	},
	plugins: [
		// ignore dev config
		new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

		// set global vars
		new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('production')
			}
		}),

		// optimizations
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],
	module: {
		loaders: [
			{ test: /\.js$/, loaders: [ 'babel' ], exclude: /node_modules/, include: __dirname },
			{ test: /\.json$/, loader: 'json' }
		]
	}
}