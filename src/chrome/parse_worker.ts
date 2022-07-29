import {ParseMessage, ParseResponse, TYPE_PARSE} from "./MessagePassing";

function acceptMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    console.log("Parse service worker received message")
    if(request.type === TYPE_PARSE) {
        const bodyToParse = request.body;
        console.log(bodyToParse)
        sendResponse({})
    }
    return true
}

console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(acceptMessage);