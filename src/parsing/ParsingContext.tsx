import {ParsingTemplate} from "./ParsingTemplate";
import {ParsedPage} from "./ParsedPage";

export interface ParsingContext {
    parentContext: ParsingContext | null,
    childContexts: ParsingContext[]

    contextUID: string,
    name: string,

    page: ParsedPage,
    template: ParsingTemplate
}