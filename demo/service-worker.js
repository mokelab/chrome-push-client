self.addEventListener('push', function(event) {  
  console.log('Received a push message', event);
  if (event.data) {
    console.log(event.data.json());
  } else {
    console.log('event.data not found');
  }

  var title = 'Demo GCM for Chrome';  
  var body = 'Got push message!';  
  var icon = '/img/icon-192x192.png';  
  var tag = 'demo-gcm-for-chrome-tag';

  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,  
      tag: tag  
    })  
  );  
});

self.addEventListener('notificationclick', function(event) {  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/chrome-push-client/demo/index.html' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('/chrome-push-client/demo/index.html');  
      }
    })
  );
});
