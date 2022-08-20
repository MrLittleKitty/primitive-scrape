import {
    ChangeCurrentContextMessage,
    ChangeTemplateMessage,
    ClearPreviewDataMessage,
    DeleteContextMessage,
    ParseMessage,
    ParseResponse,
    SaveContextMessage,
    SavePreviewDataMessage,
    TYPE_CHANGE_CURRENT_CONTEXT,
    TYPE_CHANGE_TEMPLATE,
    TYPE_CLEAR_PREVIEW_DATA,
    TYPE_DELETE_CONTEXT,
    TYPE_PARSE,
    TYPE_SAVE_CONTEXT,
    TYPE_SAVE_PREVIEW_DATA
} from "../chrome/MessagePassing";
import {parse} from "parse5";
import {parse6Adapter} from "../parsing/Parse6Adapter";
import {selectAll} from "css-select"
import {ParsedField, ParseFieldTarget} from "../parsing/ParsedField";
import {processData} from "../chrome/ProcessorFunctions";
import {
    newLocalStorage,
    newReadOnlyLocalStorage,
    ReadOnlyStorageInterface,
    StorageInterface
} from "../chrome/ChromeStorage";
import {ContextMap, extractContextName, ParsingContext} from "../parsing/ParsingContext";
import {DEFAULT_SETTINGS, ParseSettings} from "../parsing/ParseSettings";
import {genValidTemplatesForContext, ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import {ParsedDataPreview} from "../parsing/ParsedDataPreview";
import TabActiveInfo = chrome.tabs.TabActiveInfo;
import {sendBasicNotification} from "../chrome/ChromeUtils";

let CONTEXT_MAP : StorageInterface<ContextMap> = newLocalStorage("contextStorage", {}, (value) => (value == null || Object.keys(value).length < 1))
let CURRENT_CONTEXT : StorageInterface<ParsingContext|null> = newLocalStorage("currentContext", null);
let TEMPLATE_MAP : ReadOnlyStorageInterface<ParsingTemplateMap> = newReadOnlyLocalStorage("templates", {}, (value) => {
    TEMPLATE_MAP = value;
    const validTemplates = genValidTemplatesForContext(CURRENT_CONTEXT.get(), TEMPLATE_MAP.get());
    const currentTemplate = CURRENT_TEMPLATE.get();

    // If the current template is not in the map of valid templates (which it won't be without cycles which don't exist yet)
    //  Then we need to change the current template to be something from the valid templates map
    if((currentTemplate != null && !validTemplates[currentTemplate.name]) || (currentTemplate == null && (validTemplates != null && Object.values(validTemplates).length > 0))) {
        let newTemplate = Object.values(validTemplates).find((value) => value != null);
        CURRENT_TEMPLATE.set(newTemplate === undefined ? null : newTemplate);
    }
    if(CURRENT_TEMPLATE.get() === null) {
        CURRENT_CONTEXT.set(null);
    }
}, (value) => (value == null || Object.keys(value).length < 1));
let CURRENT_TEMPLATE : StorageInterface<ParsingTemplate|null> = newLocalStorage("currentTemplate", null);
let PREVIEW_DATA : StorageInterface<ParsedDataPreview[]> = newLocalStorage("previewingData", [], (value) => (value == null || value.length < 1));

let SETTINGS : ReadOnlyStorageInterface<ParseSettings> = newReadOnlyLocalStorage("parseSettings", DEFAULT_SETTINGS, (value) => {
    SETTINGS = value;
}, (value) => (value == null || Object.keys(value).length < 1));

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
PREVIEW_DATA.load().then((value) => {
    PREVIEW_DATA = value;
});
SETTINGS.load().then((value) => {
    SETTINGS = value;
})

function parseBody(body: string, parseFields: ParseFieldTarget[]) : ParsedField[] {
    const returnVal : ParsedField[] = []
    const ast = parse(body)
    for(let field of parseFields) {
        const elements = selectAll(field.nodeSelector, ast, {adapter: parse6Adapter})
        const value = processData(field.processorFunctionName, field.processorFunctionArgument, elements)
        returnVal.push({
            parser: field,
            parsedValue: value,
        })
    }
    return returnVal
}

function listenForParseMessage(request: ParseMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ParseResponse) => void) {
    if(request.type === TYPE_PARSE) {
        if(request.body != null) {
            const parsedFields = parseBody(request.body, request.parseFields)

            // Write the new data to the preview data
            if(request.settings.previewData) {
                if(gateExistingContext(request.url, request.template.name)) {
                    let previewData = PREVIEW_DATA.get();
                    const newPreviewData : ParsedDataPreview = {
                        parentContextUid: request.parentContextUid,
                        previewUid: request.uid,
                        templateName: request.template.name,
                        page: {
                            url: request.url,
                            parsedFields: parsedFields
                        }
                    };
                    previewData.push(newPreviewData);
                    PREVIEW_DATA.set(previewData);
                }
            } else {
                const succeeded = genNewContextAndSave(
                    request.parentContextUid,
                    [],
                    request.uid,
                    extractContextName(request.template.fieldToExtractContextNameFrom, parsedFields),
                    request.url,
                    parsedFields,
                    request.template.name,
                    request.settings,
                );
                if(!succeeded) {
                    sendBasicNotification("Parsing Failed", "Parsing for this page has failed");
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

function listenForChangeCurrentContext(request: ChangeCurrentContextMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if(request.type === TYPE_CHANGE_CURRENT_CONTEXT) {
        const newContext = request.contextUid == null ? null : CONTEXT_MAP.get()[request.contextUid];
        // If the context we want to change is something other than empty but then we don't find it in the map, its bad
        console.log("New context is ", newContext)
        if(request.contextUid === null || newContext !== null) {
            changeCurrentContext(newContext);
        }
        sendResponse({})
    }

    return true;
}

function listenForChangeTemplate(request: ChangeTemplateMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if(request.type === TYPE_CHANGE_TEMPLATE) {
       CURRENT_TEMPLATE.set(request.template);
       sendResponse({})
    }

    return true;
}

function listenForSaveMessage(request: SaveContextMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if(request.type === TYPE_SAVE_CONTEXT) {
       saveData(request.context, request.updatedParentContext, request.settings);
        sendResponse({})
    }

    // TODO---Figure out a consistent way of what we should be doing with regards to returning true or just calling response()
    return true;
}

function listenForSavePreviewData(request: SavePreviewDataMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if(request.type === TYPE_SAVE_PREVIEW_DATA) {
        const previewData = request.previewData;
        if(previewData != null ) {
            const template = TEMPLATE_MAP.get()[previewData.templateName];
            if(template != null) {
                const succeeded = genNewContextAndSave(
                    previewData.parentContextUid,
                    [],
                    previewData.previewUid,
                    extractContextName(template.fieldToExtractContextNameFrom, previewData.page.parsedFields),
                    previewData.page.url,
                    previewData.page.parsedFields,
                    previewData.templateName,
                    request.settings
                );

                if(succeeded) {
                    // Now we remove the preview data that we just saved as a new context from the preview data storage
                    // This is so that the UI knows to update that this preview data has been saved
                    clearPreviewDataAndSave(previewData.previewUid);
                }
                sendResponse({})
            }
        }
    }

    return true;
}

function listenForClearPreviewData(request: ClearPreviewDataMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if (request.type === TYPE_CLEAR_PREVIEW_DATA) {
        clearPreviewDataAndSave(request.previewUid);
        sendResponse({})
    }
    return true;
}

function listenForDeleteContextMessage(request: DeleteContextMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if (request.type === TYPE_DELETE_CONTEXT) {
        deleteContextAndSubTree(request.contextUid);
        sendResponse({})
    }
    return true;
}

function listenForTabChanged(activeInfo: TabActiveInfo) {
    console.log("Tab event fired")
    if(SETTINGS.get().autoContextSelect) {
        chrome.tabs.get(activeInfo.tabId).then(tab => {
            const url = tab.url;
            const contexts = CONTEXT_MAP.get();
            const foundContext = Object.values(contexts).find(context => context.page.url === url);
            if (foundContext != null) {
                //We can change the context if the current context is null or not equal to the found one
                const currentContext = CURRENT_CONTEXT.get();
                if (currentContext == null || currentContext.uid !== foundContext.uid) {
                    changeCurrentContext(foundContext);
                }
            }
        });
    }
}

function findContextForPage(url: string, templateName: string) : ParsingContext|null {
    for(let context of Object.values(CONTEXT_MAP.get())) {
        if(context != null) {
            if (context.page.url === url && context.templateName === templateName) {
                return context;
            }
        }
    }
    return null;
}

function deleteContextAndSubTree(contextUid: string) {
    let contexts = CONTEXT_MAP.get();
    const rootContext = contexts[contextUid];
    const parentContextId = rootContext.parentContextUid;

    // Find the parent context and remove our ID from its child contexts array
    if(parentContextId != null && contexts[parentContextId] != null) {
        const parent = contexts[parentContextId];
        parent.childContextsUids = parent.childContextsUids.filter(id => id !== rootContext.uid);
        contexts[parent.uid] = parent;
    }

    // Find the uids of our entire subtree (children, children of children, etc.) and delete them all
    const contextsToDelete = [contextUid, ...getAllChildUids(rootContext, contexts)];
    for(let deleteTarget of contextsToDelete) {
        delete contexts[deleteTarget];
    }

    CONTEXT_MAP.set(contexts);

    const currentContext = CURRENT_CONTEXT.get();
    if(currentContext != null && contextsToDelete.find(uid => uid === currentContext.uid) != null) {
        if(parentContextId != null && contexts[parentContextId] != null) {
            changeCurrentContext(contexts[parentContextId])
        } else {
            changeCurrentContext(null);
        }
    }
}

function getAllChildUids(context: ParsingContext, contextMap: ContextMap) : string[] {
    if(context == null || context.childContextsUids == null || context.childContextsUids.length < 1) {
        return []
    }

    let uids : string[] = [];
    for(let childUid of context.childContextsUids) {
        uids.push(childUid);
        const childContext = contextMap[childUid];
        if(childContext != null) {
            uids = [...uids, ...getAllChildUids(childContext, contextMap)]
        }
    }
    return uids;
}

function clearPreviewDataAndSave(previewDataUid: string) : void {
    let previewDataStorage = PREVIEW_DATA.get();
    PREVIEW_DATA.set(previewDataStorage.filter(data => data.previewUid !== previewDataUid))
}

// Creates a new context, saves it, then updates the parent context and saves it if the settings call for it
function genNewContextAndSave(parentContextUid: string|null, childContextUids: string[], uid: string, name: string, url: string, parsedFields: ParsedField[], templateName: string, settings: ParseSettings) : boolean {
    if(name == null || name.trim() === '' || templateName == null || templateName.trim() === '') {
        return false;
    }

    const newContext : ParsingContext =  {
        parentContextUid: parentContextUid,
        childContextsUids: childContextUids,

        uid: uid,
        name: name,

        page: {
            url: url,
            parsedFields: parsedFields
        },
        templateName: templateName
    };

    if(parentContextUid != null) {
        const updatedParentContext: ParsingContext = CONTEXT_MAP.get()[parentContextUid];
        if(updatedParentContext == null) {
            console.log("Parent context not found when it should be", parentContextUid)
        } else {
            updatedParentContext.childContextsUids.push(newContext.uid);
            saveData(newContext, updatedParentContext, settings);
        }
    } else {
        saveData(newContext, null, settings);
    }
    return true;
}

function changeCurrentContext(newContext: ParsingContext|null) {
    CURRENT_CONTEXT.set(newContext);

    const validTemplates = genValidTemplatesForContext(newContext, TEMPLATE_MAP.get());
    const currentTemplate = CURRENT_TEMPLATE.get();
    // If the current template is not in the map of valid templates (which it won't be without cycles which don't exist yet)
    //  Then we need to change the current template to be something from the valid templates map
    if(newContext == null || currentTemplate == null || !validTemplates[currentTemplate.name]) {
        const newTemplate = Object.values(validTemplates).find((value) => value != null);
        CURRENT_TEMPLATE.set(newTemplate === undefined ? null : newTemplate);
    }
}

function gateExistingContext(url: string, templateName: string) : boolean {
    const existingContext = findContextForPage(url, templateName);
    if(existingContext != null) {
        //TODO---Replace with a more intelligent way of handling this: https://github.com/MrLittleKitty/primitive-scrape/issues/4
        sendBasicNotification("Duplicate Page", "A context with the name "+existingContext.name+" already exists with the same URL and template. Please delete it in order to parse again.");
        return false;
    }
    return true;
}

function saveData(context: ParsingContext, updatedParentContext: ParsingContext|null, settings: ParseSettings) {
    if(!gateExistingContext(context.page.url, context.templateName)) {
        return;
    }

    let newContextMap = {
        ...CONTEXT_MAP.get(),
        [context.uid]: context
    };

    if(updatedParentContext != null) {
        newContextMap[updatedParentContext.uid] = updatedParentContext
    }

    if(settings.moveToContext) {
        changeCurrentContext(context);
    }

    CONTEXT_MAP.set(newContextMap);
}


console.log("Starting the parse service worker")
chrome.runtime.onMessage.addListener(listenForParseMessage);
chrome.runtime.onMessage.addListener(listenForSaveMessage);
chrome.runtime.onMessage.addListener(listenForChangeCurrentContext);
chrome.runtime.onMessage.addListener(listenForChangeTemplate);
chrome.runtime.onMessage.addListener(listenForSavePreviewData);
chrome.runtime.onMessage.addListener(listenForClearPreviewData);
chrome.runtime.onMessage.addListener(listenForDeleteContextMessage);
chrome.tabs.onActivated.addListener(listenForTabChanged);