import {Element, TextNode} from "parse5/dist/tree-adapters/default";

function _isTextNode(node: any) : node is TextNode {
    return 'value' in node;
}

function _isElement(el: any)  : el is Element {
    return 'attrs' in el && 'childNodes' in el;
}

function _textExtract(element: any) : string {
    if (element && _isTextNode(element)) {
        const val = element.value.trim();
        if(val != null) {
            return val.trim();
        }
    }
    return "";
}

function extractText(element: Element) : string {
    const elementText = _textExtract(element);
    if(elementText != null && elementText !== '') {
        return elementText;
    }

    if('childNodes' in element) {
        const childNodes = element.childNodes;
        if(childNodes != null && childNodes.length === 1) {
            return _textExtract(childNodes[0]);
        }
    }

    return ""
}

function regexExtract(rawText: string, regex: string, returnEmptyIfNoMatch: boolean) : string {
    if(rawText == null || rawText === '') {
        return '';
    }
    // If there is no regex argument passed in then return whatever we parsed from the raw text
    if(regex == null || regex === '') {
        return rawText;
    }

    const regexObject = new RegExp(regex);
    const match = rawText.match(regexObject);

    // If there was no match then return raw text
    if(!match) {
        if(returnEmptyIfNoMatch) {
            return "";
        }
        return rawText;
    }

    // If there was a match then our value is the first (and only) capture group
    // Regex in javascript is 1 based for some reason :(
    return match[1];
}

function textExtractor(elements: Element[], argument: string, returnEmptyIfNoMatch: boolean = false) : string {
    if(elements.length === 1) {
        const rawText = extractText(elements[0])
        // If there was a problem parsing the raw text then return empty string
        return regexExtract(rawText, argument, returnEmptyIfNoMatch);
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

/*
    This extracts an enum value from the given text element.
    You MUST provide an argument and it must be a comma separated string of enum values.
    The return value of this function is one of those enum values or "" (the empty string).
    If the text contains multiple of the enum values, the longest one will be returned.
    Example:
        text="Loft condo: monique lofts",
        argument="condo,loft condo",
        return value="loft condo" (because "loft condo" is longer than "condo")
 */
function extractEnumValue(elements: Element[], argument: string) : string {
    const enumValues : string[] = argument.split(',');
    const text = textExtractor(elements, "").toLowerCase();
    let matches = [];
    for(let val of enumValues) {
        if(text.includes(val)) {
            matches.push(val);
        }
    }
    if(matches.length < 1) {
        return "";
    }
    let longest = matches[0];
    for(let i = 1; i < matches.length; i++) {
        if(matches[i].length > longest.length) {
            longest = matches[i];
        }
    }
    return longest;
}

/*
    You MUST provide a regex as the second parameter for this search.
    Otherwise this will return the first text value it can find that isn't empty
 */
function searchTextExtractor(elements: Element[], regex: string) : string {
    if(regex === '.*?((?:[\\d.]+)|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[ -]+(?:bedroom|bdrm)[s]?.*') {
        console.log("Searching tree", elements);
    }

    for(let el of elements) {
        // Try to see if we can extract any of the text from the value itself
        const extractedValue = textExtractor([el], regex, true);
        if(extractedValue != null && extractedValue !== '') {
            return extractedValue;
        }

        // Ugh recursion. We hate to see it, but in this case its pretty good for traversing DOM tree
        // We are going to recurse through all child values and check them against the regex

        if('childNodes' in el) {
            const childNodes = el.childNodes;
            if(childNodes != null) {
                const childElements = childNodes.map(node => node as Element);
                const extractedChildValue = searchTextExtractor(childElements, regex);
                if (extractedChildValue != null && extractedChildValue !== '') {
                    return extractedChildValue;
                }
            }
        }
    }
    return "";
}


function extractFirstLinkText(elements: Element[], argument: string) : string {
    // Go through all elements looking for the first element that has an href attribute
    for(let el of elements) {
        // Check for the "href" attribute and extract the text value if we find it
        if('attrs' in el) {
            for (let attr of el.attrs) {
                if (attr.name === 'href') {
                    return textExtractor([el], argument, true);
                }
            }
        }

        // Ugh recursion. We hate to see it, but in this case its pretty good for traversing DOM tree
        if('childNodes' in el) {
            const childNodes = el.childNodes;
            if (childNodes != null) {
                const childElements = el.childNodes.map(node => node as Element);
                const extractedChildValue = extractFirstLinkText(childElements, argument);
                if (extractedChildValue != null && extractedChildValue !== '') {
                    return extractedChildValue;
                }
            }
        }
    }
    return "";
}

export const TEXT_EXTRACT_NAME = "extractText";
export const IMAGE_EXTRACT_NAME = "extractImage";
export const EXTRACT_FIRST_LINK_TEXT_NAME = "extractFirstLinkText";
export const SEARCH_TEXT_EXTRACT_NAME = "searchTextExtractName";
export const ENUM_VALUE_EXTRACT_NAME = "extractEnumValue";

export type ProcessorFunction = (elements: Element[], argument: string) => string
export type ProcessorFunctionName =
    typeof TEXT_EXTRACT_NAME |
    typeof IMAGE_EXTRACT_NAME |
    typeof EXTRACT_FIRST_LINK_TEXT_NAME |
    typeof SEARCH_TEXT_EXTRACT_NAME |
    typeof ENUM_VALUE_EXTRACT_NAME;

const PROCESSOR_FUNCTIONS = new Map<ProcessorFunctionName,ProcessorFunction>()


PROCESSOR_FUNCTIONS.set(TEXT_EXTRACT_NAME, textExtractor)
PROCESSOR_FUNCTIONS.set(IMAGE_EXTRACT_NAME, extractUrlFromImageTag)
PROCESSOR_FUNCTIONS.set(EXTRACT_FIRST_LINK_TEXT_NAME, extractFirstLinkText)
PROCESSOR_FUNCTIONS.set(SEARCH_TEXT_EXTRACT_NAME, searchTextExtractor)
PROCESSOR_FUNCTIONS.set(ENUM_VALUE_EXTRACT_NAME, extractEnumValue)

function processData(processorName: ProcessorFunctionName, argument: string, elements: Element[]) : string {
    const func = PROCESSOR_FUNCTIONS.get(processorName);
    if(func == null) {
        return "";
    }

    return func(elements, argument);
}

export {processData}