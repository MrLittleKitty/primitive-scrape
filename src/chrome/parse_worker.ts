import {ParseMessage, ParseResponse, ParseSucceededMessage, TYPE_PARSE, TYPE_PARSE_SUCCEEDED} from "./MessagePassing";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {parse} from "parse5";
import {parse6Adapter} from "../parsing/Parse6Adapter";
import {selectOne} from "css-select"
import { TextNode } from "parse5/dist/tree-adapters/default";

const LOCAL_ADDRESS = "127.0.0.1:3001"
const APOLLO_CLIENT = new ApolloClient({
    uri: LOCAL_ADDRESS+'/graphql',
    cache: new InMemoryCache()
});

function parseBody(body: string) : string[] {
    console.log("XML parsing succeeded")
    const selector = "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a"
    const ast = parse(body)
    const node = selectOne(selector, ast, {adapter: parse6Adapter})
    const childNode = node?.childNodes[0]
    if(childNode && _isTextNode(childNode)) {
        const address = childNode.value
        console.log("Address is ", address)
        return [address];
    }
    console.log("Xpath result: ", node)
    return []
}

function _isTextNode(node: any) : node is TextNode {
    return 'value' in node;
}

function acceptMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    console.log("Parse service worker received message")
    if(request.type === TYPE_PARSE) {
        console.log("Document: ", request.body)
        if(request.body != null) {
            const parsedFields = parseBody(request.body)
            parsedFields.forEach((entry) => {
                console.log("Worker parsed field", entry)
            })
            chrome.runtime.sendMessage<ParseSucceededMessage>({
                type: TYPE_PARSE_SUCCEEDED,
                parsedFields: parsedFields
            });

            sendResponse({})
        }
        else {
            sendResponse({})
        }

    }
    return true
}



console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(acceptMessage);