import {
    ChangeCurrentContextMessage, ChangeTemplateMessage,
    ParseMessage,
    ParseResponse,
    SaveContextMessage, TYPE_CHANGE_CURRENT_CONTEXT, TYPE_CHANGE_TEMPLATE,
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
import {genValidTemplatesForContext, ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";

// const LOCAL_ADDRESS = "127.0.0.1:3001"
// const APOLLO_CLIENT = new ApolloClient({
//     uri: LOCAL_ADDRESS+'/graphql',
//     cache: new InMemoryCache()
// });

let CONTEXT_MAP : StorageInterface<ContextMap> = newLocalStorage("contextStorage", {})
let CURRENT_CONTEXT : StorageInterface<ParsingContext|null> = newLocalStorage("currentContext", null);
let TEMPLATE_MAP : StorageInterface<ParsingTemplateMap> = newLocalStorage("templates", {});
let CURRENT_TEMPLATE : StorageInterface<ParsingTemplate|null> = newLocalStorage("currentTemplate", null);

CONTEXT_MAP.load().then((value) => {
    CONTEXT_MAP = value;
});
CURRENT_CONTEXT.load().then((value) => {
    CURRENT_CONTEXT = value;
});
TEMPLATE_MAP.load().then((value) => {
    TEMPLATE_MAP = value;
});
CURRENT_TEMPLATE.load().then((value) => {
    CURRENT_TEMPLATE = value;
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
    if(request.type === TYPE_PARSE) {
        if(request.body != null) {
            const parsedFields = parseBody(request.body, request.parseFields)

            // Write the new data to the preview data
            if(request.settings.previewData) {

            } else {
                const newContext : ParsingContext = {
                    parentContextUid: request.parentContextUid,
                    childContextsUids: [],

                    uid: request.uid,
                    name: extractName(request.template.fieldToExtractContextNameFrom, parsedFields),

                    page: {
                        url: request.url,
                        parsedFields: parsedFields
                    },
                    templateName: request.template.name,
                }

                if(request.parentContextUid != null) {
                    console.log("Context map and target parent context ID", CONTEXT_MAP.get(), request.parentContextUid);
                    const updatedParentContext: ParsingContext = CONTEXT_MAP.get()[request.parentContextUid];
                    if(updatedParentContext == null) {
                        console.log("Parent context not found when it should be", request.parentContextUid)
                    } else {
                        updatedParentContext.childContextsUids.push(newContext.uid);
                        saveData(newContext, updatedParentContext, request.settings);
                    }
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

function listenForChangeCurrentContext(request: ChangeCurrentContextMessage) {
    if(request.type === TYPE_CHANGE_CURRENT_CONTEXT) {
        const newContext = request.contextUid == null ? null : CONTEXT_MAP.get()[request.contextUid];
        // If the context we want to change is something other than empty but then we don't find it in the map, its bad
        console.log("New context is ", newContext)
        if(request.contextUid === null || newContext !== null) {
            CURRENT_CONTEXT.set(newContext);

            const validTemplates = genValidTemplatesForContext(newContext, TEMPLATE_MAP.get());
            const currentTemplate = CURRENT_TEMPLATE.get();
            if(currentTemplate != null) {
                // If the current template is not in the map of valid templates (which it won't be without cycles which don't exist yet)
                //  Then we need to change the current template to be something from the valid templates map
                if(!validTemplates[currentTemplate.name]) {
                    const newTemplate = Object.values(validTemplates).find((value) => value != null);
                    CURRENT_TEMPLATE.set(newTemplate === undefined ? null : newTemplate);
                }
            }
        }
    }

    return true;
}

function listenForChangeTemplate(request: ChangeTemplateMessage) {
    if(request.type === TYPE_CHANGE_TEMPLATE) {
       CURRENT_TEMPLATE.set(request.template);
    }

    return true;
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

    console.log("newContextMap", newContextMap)

    // if(updatedParentContext != null) {
    //     newContextMap[updatedParentContext.uid] = updatedParentContext
    // }

    if(settings.moveToContext) {
        CURRENT_CONTEXT.set(context);
    }

    CONTEXT_MAP.set(newContextMap);
}


console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(listenForParseMessage);
chrome.runtime.onMessage.addListener(listenForSaveMessage);
chrome.runtime.onMessage.addListener(listenForChangeCurrentContext);
chrome.runtime.onMessage.addListener(listenForChangeTemplate);