import {ParsedField} from "./ParsedField";

export interface ParsingContext {
    parentContext: ParsingContext | null,

    contextUID: string,

    parsingFields: ParsedField[]


}