import { Element } from "parse5/dist/tree-adapters/default";

export interface ParseFieldTarget {
    name: string,
    nodeSelector: string,
    processorFunctionName: string
}

export interface ParsedField {
    parser: ParseFieldTarget,
    parsedValue: string,
}