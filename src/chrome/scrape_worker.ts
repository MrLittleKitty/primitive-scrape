import {ScrapeMessage, ScrapeMessageResponse} from "../ExtensionPopupPage";

function acceptMessage(request: ScrapeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ScrapeMessageResponse) => void) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.scrape)
        sendResponse({confirmed: true});
    return true
}


chrome.runtime.onMessage.addListener(acceptMessage);