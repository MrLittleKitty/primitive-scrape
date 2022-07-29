
export const TYPE_SCRAPE = "scape-message"
export const TYPE_PARSE = "parse-message"

export interface ScrapeMessage {
    type: string
}

export interface ScrapeResponse {
    body: HTMLElement
}

export interface ParseMessage {
    type: string
    body: HTMLElement
}

export interface ParseResponse {
}