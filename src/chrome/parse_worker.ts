import {ParseMessage, ParseResponse, TYPE_PARSE} from "./MessagePassing";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {parse} from "parse5";

const LOCAL_ADDRESS = "127.0.0.1:3001"
const APOLLO_CLIENT = new ApolloClient({
    uri: LOCAL_ADDRESS+'/graphql',
    cache: new InMemoryCache()
});

function parseBody(body: HTMLElement) {
    console.log("Outer HTML:", body.outerHTML);
    console.log("Outer text:", body.textContent);
    const document = parse(body.outerHTML);
    console.log(document.nodeName)
    console.log(document.childNodes)
}


function acceptMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    console.log("Parse service worker received message")
    if(request.type === TYPE_PARSE) {
        console.log("Document: ", request.body)

        sendResponse({})
    }
    return true
}



console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(acceptMessage);