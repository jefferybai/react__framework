const fs = require('fs')
const webpack = require('webpack')

try {
    fs.writeFileSync('dist/chrome/manifest.json', fs.readFileSync('src/chrome/manifest.json'))
    console.log('* copy success "manifest.json"')
    fs.writeFileSync('dist/chrome/logo.png', fs.readFileSync('src/resources/logo.png'))
    console.log('* copy success "logo.png"')
    fs.writeFileSync('dist/chrome/jspdf.js', fs.readFileSync('src/chrome/jspdf.debug.js'))
    console.log('* copy success "jspdf.js"')
    fs.writeFileSync('dist/chrome/preview.html', fs.readFileSync('src/chrome/preview.html'))
    console.log('* copy success "preview.html"')
} catch (error) {
    console.warn('*--  copy files fail, any path error ?')
}

module.exports = {
	entry: {
		content: './src/chrome/content',
		background: './src/chrome/background',
		//options: './src/chrome/options',
		preview: './src/chrome/preview'
	},
	output: {
		path: './dist/chrome',
		filename: '[name].js'
	},
	plugins: [],
	module: {
		loaders: [
			{ test: /\.js$/, loaders: [ 'babel' ], exclude: /node_modules/, include: __dirname },
			{ test: /\.json$/, loader: 'json' }
		]
	}
}