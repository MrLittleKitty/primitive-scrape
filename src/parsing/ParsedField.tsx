import { Element } from "parse5/dist/tree-adapters/default";
import {ProcessorFunctionName} from "../chrome/ProcessorFunctions";

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