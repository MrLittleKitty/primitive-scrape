
export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"

export interface ScrapeMessage {
    type: string
}

export interface ScrapeResponse {
    body: string | null
}

export interface ParseMessage {
    type: string
    body: string | null
}

export interface ParseResponse {
}