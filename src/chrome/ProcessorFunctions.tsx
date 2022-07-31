import {Element, TextNode} from "parse5/dist/tree-adapters/default";

export type ProcessorFunction = (elements: Element[]) => string

function _isTextNode(node: any) : node is TextNode {
    return 'value' in node;
}

function extractText(element: Element) : string {
    const childNode = element?.childNodes[0]
    if (childNode && _isTextNode(childNode)) {
        return childNode.value
    }
    return ""
}

function textExtractor(elements: Element[]) : string {
    if(elements.length === 1) {
        return extractText(elements[0])
    }
    return ""
}

const PROCESSOR_FUNCTIONS = new Map<string,ProcessorFunction>()

export const TEXT_EXTRACT_NAME = "extractText"
PROCESSOR_FUNCTIONS.set(TEXT_EXTRACT_NAME, textExtractor)

export {PROCESSOR_FUNCTIONS}