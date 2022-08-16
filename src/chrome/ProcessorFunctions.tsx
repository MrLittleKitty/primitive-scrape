import {Element, TextNode} from "parse5/dist/tree-adapters/default";

function _isTextNode(node: any) : node is TextNode {
    return 'value' in node;
}

function extractText(element: Element) : string {
    const childNode = element?.childNodes[0]
    if (childNode && _isTextNode(childNode)) {
        const val = childNode.value.trim();
        if(val != null) {
            return val.trim();
        }
    }
    return ""
}

function textExtractor(elements: Element[], argument: string) : string {
    if(elements.length === 1) {
        const rawText = extractText(elements[0])
        console.log("Raw text and argument", rawText, argument);
        // If there was a problem parsing the raw text then return empty string
        if(rawText == null || rawText === '') {
            return '';
        }
        // If there is no regex argument passed in then return whatever we parsed from the raw text
        if(argument == null || argument === '') {
            return rawText;
        }

        const regex = new RegExp(argument);
        const match = rawText.match(regex);
        // If there was no match then return raw text
        if(!match) {
            return rawText;
        }

        // If there was a match then our value is the first (and only) capture group
        // Regex in javascript is 1 based for some reason :(
        return match[1];
    }
    return ""
}

function extractUrlFromImageTag(elements: Element[], argument: string) : string {
    if(elements.length === 1) {
        const attributes = elements[0].attrs;
        for(let attribute of attributes) {
            if(attribute.name === 'src') {
                const val = attribute.value;
                if(val != null) {
                    return val.trim();
                }
            }
        }
    }
    return "";
}

export const TEXT_EXTRACT_NAME = "extractText"
export const IMAGE_EXTRACT_NAME = "extractImage"

export type ProcessorFunction = (elements: Element[], argument: string) => string
export type ProcessorFunctionName =
    typeof TEXT_EXTRACT_NAME |
    typeof IMAGE_EXTRACT_NAME;

const PROCESSOR_FUNCTIONS = new Map<ProcessorFunctionName,ProcessorFunction>()


PROCESSOR_FUNCTIONS.set(TEXT_EXTRACT_NAME, textExtractor)
PROCESSOR_FUNCTIONS.set(IMAGE_EXTRACT_NAME, extractUrlFromImageTag)

function processData(processorName: ProcessorFunctionName, argument: string, elements: Element[]) : string {
    const func = PROCESSOR_FUNCTIONS.get(processorName);
    if(func == null) {
        return "";
    }

    return func(elements, argument);
}

export {processData}