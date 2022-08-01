import {ParseFieldTarget} from "./ParsedField";
import {TEXT_EXTRACT_NAME} from "../chrome/ProcessorFunctions";

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
          nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(9) > div > div.backend_data.BuildingInfo-item > a",
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