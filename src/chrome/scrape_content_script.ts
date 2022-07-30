import {ParseMessage, ScrapeMessage, ScrapeResponse, TYPE_PARSE, TYPE_SCRAPE} from "./MessagePassing";

function scrapeBody() {
    if(document.readyState === "complete") {
        chrome.runtime.sendMessage<ParseMessage>({
            type: TYPE_PARSE,
            body: document.body.outerHTML
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
        scrapeBody();
        sendResponse({body: document.body.outerHTML});
    }

    return true
}

console.log("Scraping content script loaded")
chrome.runtime.onMessage.addListener(acceptMessage);