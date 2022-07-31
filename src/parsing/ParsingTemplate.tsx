import {ParsableField} from "./ParsedField";
import {ParsedPage} from "./ParsedPage";
import {TextNode} from "parse5/dist/tree-adapters/default";

export interface ParsingTemplate {
    parentTemplate: ParsingTemplate | null,
    childTemplates: ParsingTemplate[]

    name: string,
    parsableFields: ParsableField[],
    contextNameExtractorFunc: (page: ParsedPage) => string
}

let UNIT_REF_TEMPLATE : ParsingTemplate = {
    parentTemplate: null,
    childTemplates: [],

    name: "Reference",
    parsableFields: [],
    contextNameExtractorFunc: (page) => {
        return ""
    }
}

let UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplate: null,
    childTemplates: [UNIT_REF_TEMPLATE],

    name: "Unit",
    parsableFields: [],
    contextNameExtractorFunc: (page) => {
        return ""
    }
}

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

let BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplate: null,
    childTemplates: [UNIT_TEMPLATE],

    name: "Building",
    parsableFields: [
        {
          name: "Name",
          nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(9) > div > div.backend_data.BuildingInfo-item > a",
          processorFunction: textExtractor,
        },
        {
            // This is for StreetEasy right now
            name: "Address",
            nodeSelector: "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a",
            processorFunction: textExtractor,
        }
    ],
    contextNameExtractorFunc: (page) => {
        const parsedFields = page.parsedFields.filter((value) => value.parser.name === "Name")
        if(parsedFields.length === 1) {
            return parsedFields[0].parsedValue
        }
        return ""
    }
}

UNIT_TEMPLATE.parentTemplate = BUILDING_TEMPLATE
UNIT_REF_TEMPLATE.parentTemplate = UNIT_TEMPLATE

export const STREET_EASY_BUILDING_EXPLORER_TEMPLATES : ParsingTemplate[] = [BUILDING_TEMPLATE]