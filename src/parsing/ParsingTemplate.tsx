import {ParsableField} from "./ParsedField";

export interface ParsingTemplate {
    parentTemplate: ParsingTemplate | null,
    childTemplates: ParsingTemplate[]

    name: string,
    parsableFields: ParsableField[],
}