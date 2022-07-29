import {ParseMessage, ScrapeMessage, ScrapeResponse, TYPE_PARSE, TYPE_SCRAPE} from "./MessagePassing";

function acceptMessage(request: ScrapeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ScrapeResponse) => void) {
    console.log("Scraping content script received a message")
    if(request.type === TYPE_SCRAPE) {
        const response = chrome.runtime.sendMessage<ParseMessage>({
            type: TYPE_PARSE,
            body: document.body
        })
        sendResponse({body: document.body});
    }

    return true
}

console.log("Scraping content script loaded")
chrome.runtime.onMessage.addListener(acceptMessage);