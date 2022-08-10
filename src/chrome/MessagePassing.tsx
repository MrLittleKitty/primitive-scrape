import {ParseFieldTarget} from "../parsing/ParsedField";
import {ParsingContext} from "../parsing/ParsingContext";
import {ParseSettings} from "../parsing/ParseSettings";
import {ParsingTemplate} from "../parsing/ParsingTemplate";

export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"
export const TYPE_PARSE_SUCCEEDED = "parse-message-succeeded"
export const TYPE_SAVE_CONTEXT = "parse-save-context"
export const TYPE_CHANGE_CURRENT_CONTEXT = "change-current-context"

export interface Message {
    type: string
}

export interface ScrapeMessage extends Message {
    uid: string,
    parentContextUid: string|null,
    template: ParsingTemplate,
    parseFields: ParseFieldTarget[],
    settings: ParseSettings
}

export interface ScrapeResponse {

}

export interface ParseMessage extends ScrapeMessage {
    body: string | null,
    url: string
}

export interface ParseResponse {
}

export interface ChangeCurrentContextMessage extends Message {
    contextUid: string,
}

export interface SaveContextMessage extends Message {
    context: ParsingContext,
    updatedParentContext: ParsingContext|null,
    settings: ParseSettings
}