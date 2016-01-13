///<reference path="./GCMClient.ts"/>
var Notification;
var GCMClientImpl = (function () {
    function GCMClientImpl() {
    }
    GCMClientImpl.prototype.isServiceWorkerEnabled = function () {
        return ('serviceWorker' in navigator);
    };
    GCMClientImpl.prototype.isNotificationEnabled = function () {
        return !(Notification.permission === 'denied');
    };
    GCMClientImpl.prototype.getSubscription = function (callback) {
        navigator.serviceWorker.ready.then(function (swr) {
            // swr is serviceWorkerRegistration
            swr.pushManager.getSubscription()
                .then(function (subscription) {
                if (!subscription) {
                    callback.success(null);
                    return;
                }
                var path = subscription.endpoint.split('/');
                var token = path[path.length - 1];
                callback.success(token);
            })
                .catch(function (err) {
                console.warn('Error during getSubscription()', err);
                callback.error(err);
            });
        });
    };
    GCMClientImpl.prototype.subscribe = function (callback) {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe()
                .then(function (subscription) {
                if (!subscription) {
                    callback.error('Subscription is empty');
                    return;
                }
                var path = subscription.endpoint.split('/');
                var token = path[path.length - 1];
                callback.success(token);
            })
                .catch(function (e) {
                callback.error(e);
            });
        });
    };
    return GCMClientImpl;
})();
