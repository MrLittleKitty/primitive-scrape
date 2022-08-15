import {ParsedPage} from "./ParsedPage";

export interface ParsedDataPreview {
    previewUid: string,
    page: ParsedPage,
    parentContextUid: string | null
    templateName: string,
}