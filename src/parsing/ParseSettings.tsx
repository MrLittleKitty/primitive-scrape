export interface ParseSettings {
    previewData: boolean,
    moveToContext: boolean,

    showSettingsMenu: boolean,
    autoContextSelect: boolean
}

export const DEFAULT_SETTINGS : ParseSettings = {
    previewData: false,
    moveToContext: true,

    showSettingsMenu: false,
    autoContextSelect: false,
}