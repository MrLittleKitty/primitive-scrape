import {ParseMessage, ScrapeMessage, ScrapeResponse, TYPE_PARSE, TYPE_SCRAPE} from "./MessagePassing";

function scrapeBody(request: ScrapeMessage) {
    if(document.readyState === "complete") {
        chrome.runtime.sendMessage<ParseMessage>({
            type: TYPE_PARSE,
            uid: request.uid,
            body: document.body.outerHTML,
            templateName: request.templateName,
            parseFields: request.parseFields,
        })
    }
    else {
        console.log("Document is not ready. Failed to send message.")
        // setTimeout(() => {
        //     scrapeBody();
        // }, 1000);
    }
}

function acceptMessage(request: ScrapeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ScrapeResponse) => void) {
    console.log("Scraping content script received a message")
    if(request.type === TYPE_SCRAPE) {
        console.log("Ready state:", document.readyState)
        scrapeBody(request);
        sendResponse({body: document.body.outerHTML});
    }

    return true
}

console.log("Scraping content script loaded")
chrome.runtime.onMessage.addListener(acceptMessage);