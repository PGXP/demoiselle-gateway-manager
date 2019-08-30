'use strict';

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
  console.log('installed!');
});

// Service Worker Active
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
  console.log('activated!');
});

//self.importScripts('apoio-worker.js');

self.addEventListener('message', function (event) {

  if (event.data.command === 'message') {
    const title = 'Catálogo TIC';
    const notificationOptions = {
      body: event.data,
      icon: './images/catalogo.png',
      dir: 'auto',
      delay: 20000,
      focusWindowOnClick: true,
      vibrate: [100, 100, 100, 100, 100]
    };
    self.registration.showNotification(title, notificationOptions);
  }

});

self.addEventListener('push', function (event) {

  const title = 'Catálogo TIC';
  const notificationOptions = {
    body: event.data,
    icon: './images/catalogo.png',
    dir: 'auto',
    delay: 20000,
    focusWindowOnClick: true,
    vibrate: [100, 100, 100, 100, 100]
  };
  self.registration.showNotification(title, notificationOptions);

});


self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );

});
