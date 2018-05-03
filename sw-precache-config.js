module.exports = {
  staticFileGlobs: [
    'index.html',
    'manifest.json',
    'bower_components/webcomponentsjs/webcomponents-loader.js',
    'images/default-receipt.png'
  ],
  importScripts: [
    'src/push/sw-push-import.js'
  ],
  runtimeCaching: [{
    urlPattern: /https:\/\/fonts\.googleapis\.com.*/,
    handler: 'cacheFirst'
  }, {
    urlPattern: /\/bower_components\/webcomponentsjs\/.*.js/,
    handler: 'fastest',
    options: {
      cache: {
        name: 'webcomponentsjs-polyfills-cache',
      },
    },
  }]
};
