import {ParsingContext} from "../parsing/ParsingContext";
import {ParsingTemplate} from "../parsing/ParsingTemplate";
import {ParsedPage} from "../parsing/ParsedPage";

export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"
export const TYPE_PARSE_SUCCEEDED = "parse-message-succeeded"

export interface Message {
    type: string
}

export interface ScrapeMessage extends Message {
    context: ParsingContext | null,
    template: ParsingTemplate
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