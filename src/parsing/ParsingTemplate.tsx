import {ParseFieldTarget} from "./ParsedField";
import {TEXT_EXTRACT_NAME} from "../chrome/ProcessorFunctions";
import {ParsingContext} from "./ParsingContext";

export interface ParsingTemplate {
    parentTemplateKey: string | null,
    childTemplatesKey: string[]

    name: string,
    parsableFields: ParseFieldTarget[],
    fieldToExtractContextNameFrom: string,
}

export type ParsingTemplateMap = {
    [key: string] : ParsingTemplate
}

export function genValidTemplatesForContext(context: ParsingContext|null, allTemplates: ParsingTemplateMap) : ParsingTemplateMap {
    if(context == null) {
        return allTemplates
    }

    let templateMap : ParsingTemplateMap = {};

    // This is the template for the current context
    const startingTemplate = allTemplates[context.templateName];

    // Right now we don't allow cycles, so a template is not allowed to be a child of itself
    //TODO---Allow cycles in the future
    for(let templateKey of startingTemplate.childTemplatesKey) {
        const temp = allTemplates[templateKey];
        templateMap[temp.name] = temp;
    }

    return templateMap;
}

let UNIT_REF_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Unit",
    childTemplatesKey: [],

    name: "Reference",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Building",
    childTemplatesKey: ["Reference"],

    name: "Unit",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["Unit"],

    name: "Building",
    parsableFields: [
        {
          name: "Name",
          nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(8) > div > div.backend_data.BuildingInfo-item > a",
          processorFunctionName: TEXT_EXTRACT_NAME,
        },
        {
            // This is for StreetEasy right now
            name: "Address",
            nodeSelector: "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a",
            processorFunctionName: TEXT_EXTRACT_NAME,
        }
    ],
    fieldToExtractContextNameFrom: "Name"
}

let TEST_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: [],

    name: "Test",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

export const STREET_EASY_BUILDING_EXPLORER_TEMPLATE_MAP : ParsingTemplateMap = {
    [BUILDING_TEMPLATE.name] : BUILDING_TEMPLATE,
    [UNIT_TEMPLATE.name] : UNIT_TEMPLATE,
    [UNIT_REF_TEMPLATE.name] : UNIT_REF_TEMPLATE,
    //[TEST_TEMPLATE.name] : TEST_TEMPLATE,
}