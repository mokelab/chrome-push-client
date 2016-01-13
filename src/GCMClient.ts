interface GCMClient {
    /**
     * Checks whether service worker is enabled.
     * @return true if Service worker is enabled.
     */
    isServiceWorkerEnabled();

    /**
     * Checks whether notification is enabled.
     * @return true if Notification.permission != 'denied'
     */
    isNotificationEnabled();

    /**
     * Gets subscription ID(device token)
     */
    getSubscription(callback : SubscriptionCallback);
}

interface SubscriptionCallback {
    success(token : string);
    error(e : any);
}