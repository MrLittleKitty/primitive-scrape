import {ParsedPage} from "../parsing/ParsedPage";
import {ParseFieldTarget} from "../parsing/ParsedField";
import {ParsingContext} from "../parsing/ParsingContext";

export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"
export const TYPE_PARSE_SUCCEEDED = "parse-message-succeeded"
export const TYPE_SAVE_CONTEXT = "parse-save-context"

export interface Message {
    type: string
}

export interface ScrapeMessage extends Message {
    uid: string,
    parentContextUid: string|null,
    templateName: string,
    parseFields: ParseFieldTarget[],
}

export interface ScrapeResponse {

}

export interface ParseMessage extends ScrapeMessage {
    body: string | null
}

export interface ParseResponse {
}

export interface ParseSucceededMessage extends ScrapeMessage {
    result: ParsedPage
}

export interface SaveContextMessage extends Message {
    context: ParsingContext
}