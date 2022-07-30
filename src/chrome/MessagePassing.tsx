
export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"
export const TYPE_PARSE_SUCCEEDED = "parse-message-succeeded"

export interface Message {
    type: string
}

export interface ScrapeMessage extends Message {
}

export interface ScrapeResponse {

}

export interface ParseMessage extends Message {
    body: string | null
}

export interface ParseResponse {
}

export interface ParseSucceededMessage extends Message {
    parsedFields: string[]
}