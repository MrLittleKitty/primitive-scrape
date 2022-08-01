import {ParsedPage} from "./ParsedPage";

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