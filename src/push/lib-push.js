
(function() {
  'use strict';

  // Should be the key used in backend. To generate a pair key visit https://web-push-codelab.glitch.me/
  const backendPublicKey = 'BEsjzmg6xlDBqJUfXj7N8DLiMcLh5Rwg7AWWfYHbPWLk1DeUzaIsj4sJca6a9Wi1VNxC5UVBcpvjj0y4ySF6vLc';

  // If backend is in another server set this. Though you need to check that CORS is enabled.
  const backendBaseUrl = '/';

  const  isNotificationSupported = 'Notification' in window;
  const  isSwPushSupported = 'serviceWorker' in navigator && 'PushManager' in window

  let isNotificationGranted = isNotificationSupported && Notification.permission == 'granted'
  let isNotificationDenied = isNotificationSupported && Notification.permission == 'denied'
  let userSubscription = null;

  function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function requestPushPermission(ok, err) {
    if (isNotificationDenied) {
      console.warn('Notification is blocked by user configuration');
      err && err();
      return;
    }
    if (isNotificationGranted) {
      ok && ok();
      return;
    }
    if (isNotificationSupported && !isNotificationGranted) {
      Notification.requestPermission(function(status) {
        isNotificationGranted = status == 'granted';
        isNotificationDenied = status == 'denied';
        if (isNotificationGranted) {
          ok && ok(status);
        } else {
          err && err(status);
        }
      });
    }
  }

  function subscribePushUser(ok, err) {
    var applicationServerKey = urlB64ToUint8Array(backendPublicKey);
    navigator.serviceWorker.getRegistration()
    .then(function(swReg){
      return swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
    })
    .then(function(subscription) {
      userSubscription = subscription;
      ok && ok(subscription)
    })
    .catch(function(e) {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Failed to subscribe the user: ', e);
      }
      err && err();
    });
  }

  function setPushListener(cb) {
    navigator.serviceWorker.addEventListener('message', e => cb(e.data));
  }

  function backendAction(action, object, ok, err) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${backendBaseUrl}${action}`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
      ok && ok(this.responseText);
    };
    xhr.onerror = function(e) {
      console.log(`Error sending ${action} to backend`);
      err && err(e);
    }
    xhr.send(JSON.stringify(object || {}));
  }

  function notifyNewExpenseToBackend(expense, ok, err) {
    if (userSubscription) {
      backendAction('expense', {expense, user: userSubscription}, ok, err);
    }
  }

  ExpenseManager.Push = {
    requestPushPermission,
    subscribePushUser,
    setPushListener,
    notifyNewExpenseToBackend
  };
})();
