export interface ParsableField {
    name: string,
    nodeSelector: string,
    processorFunction: (elements: Element[]) => string,
}

export interface ParsedField {
    parser: ParsableField,
    parsedValue: string,
}