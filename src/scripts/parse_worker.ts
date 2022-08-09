import {
    ParseMessage,
    ParseResponse,
    SaveContextMessage,
    TYPE_PARSE,
    TYPE_PARSE_SUCCEEDED, TYPE_SAVE_CONTEXT
} from "../chrome/MessagePassing";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {parse} from "parse5";
import {parse6Adapter} from "../parsing/Parse6Adapter";
import {selectAll} from "css-select"
import {ParsedField, ParseFieldTarget} from "../parsing/ParsedField";
import {PROCESSOR_FUNCTIONS} from "../chrome/ProcessorFunctions";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import {ParseSettings} from "../parsing/ParseSettings";
import {ParsedPage} from "../parsing/ParsedPage";
import { v4 as uuidv4 } from 'uuid';

// const LOCAL_ADDRESS = "127.0.0.1:3001"
// const APOLLO_CLIENT = new ApolloClient({
//     uri: LOCAL_ADDRESS+'/graphql',
//     cache: new InMemoryCache()
// });

let CONTEXT_MAP : StorageInterface<ContextMap> = newLocalStorage("contextStorage", {})
let CURRENT_CONTEXT : StorageInterface<ParsingContext|null> = newLocalStorage("currentContext", null);
CONTEXT_MAP.load().then((value) => {
    CONTEXT_MAP = value;
});
CURRENT_CONTEXT.load().then((value) => {
    CURRENT_CONTEXT = value;
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

function extractName(fieldName: string, fields: ParsedField[]) : string {
    for(let f of fields) {
        if(f.parser.name === fieldName) {
            return f.parsedValue;
        }
    }
    return ""
}

function listenForParseMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    console.log("Parse service worker received message")
    if(request.type === TYPE_PARSE) {
        if(request.body != null) {
            const parsedFields = parseBody(request.body, request.parseFields)

            // Write the new data to the preview data
            if(request.settings.previewData) {

            } else {
                const newContext : ParsingContext = {
                    parentContextUid: request.parentContextUid,
                    childContextsUids: [],

                    uid: uuidv4(),
                    name: extractName(request.template.fieldToExtractContextNameFrom, parsedFields),

                    page: {
                        url: request.url,
                        parsedFields: parsedFields
                    },
                    templateName: request.template.name,
                }

                if(request.parentContextUid != null) {
                    const updatedParentContext: ParsingContext = CONTEXT_MAP.get()[request.parentContextUid];
                    updatedParentContext['childContextsUids'].push(newContext.uid);
                    saveData(newContext, updatedParentContext, request.settings);
                } else {
                    saveData(newContext, null, request.settings);
                }
            }

            sendResponse({})
        }
        else {
            sendResponse({})
        }

    }
    return true
}

function listenForSaveMessage(request: SaveContextMessage) {
    if(request.type === TYPE_SAVE_CONTEXT) {
       saveData(request.context, request.updatedParentContext, request.settings);
    }

    // TODO---Figure out a consistent way of what we should be doing with regards to returning true or just calling response()
    return true;
}

function saveData(context: ParsingContext, updatedParentContext: ParsingContext|null, settings: ParseSettings) {
    let newContextMap = {
        ...CONTEXT_MAP.get(),
        [context.uid]: context
    };

    if(updatedParentContext != null) {
        newContextMap[updatedParentContext.uid] = updatedParentContext
    }

    if(settings.moveToContext) {
        CURRENT_CONTEXT.set(context);
    }

    CONTEXT_MAP.set(newContextMap);
}


console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(listenForParseMessage);
chrome.runtime.onMessage.addListener(listenForSaveMessage);