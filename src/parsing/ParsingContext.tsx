import {ParsedPage} from "./ParsedPage";
import {ParsedField} from "./ParsedField";

export type ContextMap = {
    [key: string] : ParsingContext
}

export interface ParsingContext {
    parentContextUid: string | null,
    childContextsUids: string[]

    uid: string,
    name: string,

    page: ParsedPage,
    templateName: string
}

export function extractContextName(fieldName: string, fields: ParsedField[]) : string {
    for(let f of fields) {
        if(f.parser.name === fieldName) {
            return f.parsedValue;
        }
    }
    return ""
}