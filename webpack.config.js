const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './map.js',
  output: {
    filename: 'dist/map.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'index.html',
        to: 'dist/index.html',
      },
      {
        from: 'node_modules/leaflet/dist',
        to: 'dist/leaflet',
      },
      {
        from: 'node_modules/leaflet.beautifymarker/*.js',
        to: 'dist/leaflet.beautifymarker/[name].[ext]',
      },
      {
        from: 'node_modules/leaflet.beautifymarker/*.css',
        to: 'dist/leaflet.beautifymarker/[name].[ext]',
      },
    ])
  ],
};
