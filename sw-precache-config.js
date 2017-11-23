module.exports = {
  staticFileGlobs: [
    'index.html',
    'manifest.json',
    'bower_components/webcomponentsjs/*',
    'images/default-receipt.png'
  ],
  navigateFallback: 'index.html',
  runtimeCaching: [{
    urlPattern: /https:\/\/fonts\.googleapis\.com.*/,
    handler: 'cacheFirst'
  }]
};
