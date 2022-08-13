import {ParseFieldTarget} from "./ParsedField";
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
    if(context === null || allTemplates === null || Object.values(allTemplates).length < 1) {
        return allTemplates
    }

    let templateMap : ParsingTemplateMap = {};

    // This is the template for the current context
    const startingTemplate = allTemplates[context.templateName];

    // Right now we don't allow cycles, so a template is not allowed to be a child of itself
    //TODO---Allow cycles in the future
    if(startingTemplate && startingTemplate.childTemplatesKey) { // Make sure that the template isnt null
        for (let templateKey of startingTemplate.childTemplatesKey) {
            const temp = allTemplates[templateKey];
            templateMap[temp.name] = temp;
        }
    }

    return templateMap;
}