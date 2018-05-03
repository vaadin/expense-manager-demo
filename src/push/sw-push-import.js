(function() {
  'use strict';

  function notifyPage(action, data) {
    self.clients.matchAll({includeUncontrolled: true}).then(function(clientList) {
      clientList.forEach(client => client.postMessage({action, data}));
    });
  }

  self.addEventListener('notificationclose', function(e) {
    notifyPage('close', e.notification.data);
  });

  self.addEventListener('notificationclick', function(e) {
    notifyPage('click', e.notification.data);
  });

  self.addEventListener('push', function(e) {
    console.log('push received in sw ', e.data);
    if (e.data) {
      var expense = e.data.json();
      notifyPage('review', expense);

      var options = {
        body: `${expense.merchant} $${expense.total}, ${expense.status}.`,
        icon: 'images/icons/icon-384x384.png',
        vibrate: [100, 50, 100],
        data: expense,
        actions: [{action: 'close', title: 'Close', icon: 'images/icons/mark-close.png'}]
      };
    }

    e.waitUntil(
      self.registration.showNotification('Expense Manager', options)
    );
  });
})();
