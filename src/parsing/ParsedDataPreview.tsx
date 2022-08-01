import {ParsedPage} from "./ParsedPage";
import {ParsingContext} from "./ParsingContext";

export interface ParsedDataPreview {
    page: ParsedPage,
    contextUid: string | null
}