import {ProcessorFunctionName} from "../chrome/ProcessorFunctions";

export interface ParsingFieldSet {
    name: string,
    fields: ParseFieldTarget[],
    pageMatchingRegex: string,
}

export interface ParseFieldTarget {
    name: string,
    nodeSelector: string,
    processorFunctionName: ProcessorFunctionName,
    processorFunctionArgument: string,
}

export interface ParsedField {
    parser: ParseFieldTarget,
    parsedValue: string,
}