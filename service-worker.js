(function(global) {
  console.log('Registering ServiceWorker...');

  importScripts('bower_components/sw-toolbox/sw-toolbox.js');

  //toolbox.options.debug = true;

  // Cache all local stuff
  toolbox.router.get('/(.*)', toolbox.fastest);
  // Cache Fonts etc
  toolbox.router.get('/(.*)', toolbox.cacheFirst, {
    origin: /\.googleapis\.com$/
  });

  // No route for API calls, we don't want those to hit the service worker
  // PouchDB handles offline sync already, we don't want double caching

  global.addEventListener('install', function(event) {
    event.waitUntil(global.skipWaiting());
  });
  global.addEventListener('activate', function(event) {
    event.waitUntil(global.clients.claim());
  });
})(self);
