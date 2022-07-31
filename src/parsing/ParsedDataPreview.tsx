import {ParsedPage} from "./ParsedPage";
import {ParsingContext} from "./ParsingContext";

export interface ParsedDataPreview {
    page: ParsedPage,
    context: ParsingContext | null
}