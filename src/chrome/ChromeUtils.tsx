export function sendBasicNotification(title: string, message: string) {
    chrome.notifications.create("", {
        type: "basic",
        title: title,
        message: message,
        iconUrl: "Icon-48.png"
    });
}