import {ParseMessage, ParseResponse, ParseSucceededMessage, TYPE_PARSE, TYPE_PARSE_SUCCEEDED} from "./MessagePassing";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {parse} from "parse5";
import {parse6Adapter} from "../parsing/Parse6Adapter";
import {selectAll} from "css-select"
import {ParsedField, ParseFieldTarget} from "../parsing/ParsedField";
import {ParsingTemplate} from "../parsing/ParsingTemplate";
import {PROCESSOR_FUNCTIONS} from "./ProcessorFunctions";

const LOCAL_ADDRESS = "127.0.0.1:3001"
const APOLLO_CLIENT = new ApolloClient({
    uri: LOCAL_ADDRESS+'/graphql',
    cache: new InMemoryCache()
});

function parseBody(body: string, parseFields: ParseFieldTarget[]) : ParsedField[] {
    const returnVal : ParsedField[] = []
    const ast = parse(body)
    for(let field of parseFields) {
        const elements = selectAll(field.nodeSelector, ast, {adapter: parse6Adapter})
        const func = PROCESSOR_FUNCTIONS.get(field.processorFunctionName)
        const value = func ? func(elements) : "PROCESS FUNC UNKNOWN";
        returnVal.push({
            parser: field,
            parsedValue: value,
        })
    }
    return returnVal
}

function acceptMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    console.log("Parse service worker received message")
    if(request.type === TYPE_PARSE) {
        if(request.body != null) {
            const parsedFields = parseBody(request.body, request.parseFields)
            chrome.runtime.sendMessage<ParseSucceededMessage>({
                type: TYPE_PARSE_SUCCEEDED,
                uid: request.uid,
                templateName: request.templateName,
                parseFields: request.parseFields,
                result: {
                    url: document.location.href,
                    parsedFields: parsedFields,
                }
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