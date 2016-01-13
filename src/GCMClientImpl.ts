///<reference path="./GCMClient.ts"/>

var Notification : any;

class GCMClientImpl implements GCMClient {
    isServiceWorkerEnabled() {
        return ('serviceWorker' in navigator);
    }

    isNotificationEnabled() {
        return !(Notification.permission === 'denied');
    }

    getSubscription(callback : SubscriptionCallback) {
    (<any>navigator).serviceWorker.ready.then(function(swr) {
        // swr is serviceWorkerRegistration
        swr.pushManager.getSubscription()  
            .then(function(subscription){
                if (!subscription) {
                    callback.error('Subscription is empty');
                    return;
                }
                var path = subscription.endpoint.split('/');
                var token = path[path.length - 1];
                callback.success(token);
            })
            .catch(function(err) {  
                console.warn('Error during getSubscription()', err);
                callback.error(err);
            });  
    });  
    }
}