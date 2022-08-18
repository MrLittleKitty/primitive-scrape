import {ParseFieldTarget} from "../parsing/ParsedField";
import {ParsingContext} from "../parsing/ParsingContext";
import {ParseSettings} from "../parsing/ParseSettings";
import {ParsingTemplate} from "../parsing/ParsingTemplate";
import {ParsedDataPreview} from "../parsing/ParsedDataPreview";

export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"
export const TYPE_PARSE_SUCCEEDED = "parse-message-succeeded"
export const TYPE_SAVE_CONTEXT = "parse-save-context"
export const TYPE_CHANGE_CURRENT_CONTEXT = "change-current-context"
export const TYPE_CHANGE_TEMPLATE = "change-template"
export const TYPE_SAVE_PREVIEW_DATA = "save-preview-data"
export const TYPE_CLEAR_PREVIEW_DATA = "clear-preview-data"
export const TYPE_DELETE_CONTEXT = "delete-context"

export type MessageType =
    typeof TYPE_SCRAPE |
    typeof TYPE_PARSE |
    typeof TYPE_PARSE_SUCCEEDED |
    typeof TYPE_SAVE_CONTEXT |
    typeof TYPE_CHANGE_CURRENT_CONTEXT |
    typeof TYPE_CHANGE_TEMPLATE |
    typeof TYPE_SAVE_PREVIEW_DATA |
    typeof TYPE_CLEAR_PREVIEW_DATA |
    typeof TYPE_DELETE_CONTEXT;

export interface Message {
    type: MessageType
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
    contextUid: string|null,
}

export interface ChangeTemplateMessage extends Message {
    template: ParsingTemplate,
}

export interface SaveContextMessage extends Message {
    context: ParsingContext,
    updatedParentContext: ParsingContext|null,
    settings: ParseSettings
}

export interface SavePreviewDataMessage extends Message {
    settings: ParseSettings,
    previewData: ParsedDataPreview
}

export interface ClearPreviewDataMessage extends Message {
    previewUid: string,
}

export interface DeleteContextMessage extends Message {
    contextUid: string,
}