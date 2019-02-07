const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzer({ analyzerMode: 'static', defaultSizes: 'parsed', openAnalyzer: false })
    ]
  }  
}
