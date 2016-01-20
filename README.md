# chrome-push-client
GCM client for Chrome browser

# How to integrate this library to your web application

## Creates google cloud project and get project number

(This is the same preparation for GCM for Android)

Creates google cloud project on https://console.developers.google.com, enable `Google Cloud Messaging for Android`, and get project number.

## Add manifest.json to your web application

Puts the following `manifest.json` file. Please replace {your project number}. 

```
{
"name": "Demo : GCM for Chrome",
"short_name": "GCMDemo",
"icons": [{
    "src": "img/icon-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
}],
"start_url": "/index.html",
"display": "standalone",
"gcm_sender_id": "{your project number}",
"gcm_user_visible_only": true
}
```

Adds the following <link> tag to <head></head>

```
<link rel="manifest" href="./manifest.json">
```

## Adds this library

This library is just a single `.js` file.

```
<script src="./GCMClientImpl.js"></script>
```

## Gets device token from GCM server

Creates `GCMClientImpl` 

```
var client = new GCMClientImpl();
```

Registers your service worker. 

```
window.addEventListener('load', function () {
  if (!client.isServiceWorkerEnabled()) {
    console.log('Service worker is disabled...');
    return;
  }
  if (!client.isNotificationEnabled()) {
    console.log('Notification is disabled...');
    return;
  }
  navigator.serviceWorker.register('./service-worker.js')  
    .then(initialiseState);  
});
```

In `initialiseState`, gets stored subscription by `client.getSubscription()`

```
function initialiseState() {
  client.getSubscription({
    success : function(token) {
      // sends this token to your server
      console.log('token=' + token);
    },
    error : function(err) {
      console.log('failed to get subscription ' + err);
    }
  });
}
```

When user clicks "subscribe" button on your web app, call `client.subscribe()`

```
client.subscribe({
  success : function(token) {
    // sends this token to your server
    console.log('token=' + token);
  },
  error : function(err) {
    console.log('failed to subscribe ' + err);
  }
});
```

That's all!
