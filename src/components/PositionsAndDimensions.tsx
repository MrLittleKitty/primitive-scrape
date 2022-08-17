const PADDING = 5
export const SEPARATION = 10
export const HEADER_HEIGHT = 40;

const USABLE_WIDTH = 800 - (PADDING*2);
const USABLE_HEIGHT = 600 - (PADDING*2)


const TOP_SEPARATION = {
    top: PADDING
}

export interface Dimensions {
    width: number,
    height: number
}

export const CHANGE_CONTEXT_DIMENSIONS : Dimensions = {
    height: USABLE_HEIGHT,
    width: 450
}

export const CURRENT_CONTEXT_VIEWER_POSITION = {
    ...TOP_SEPARATION,
    left: PADDING,
}

export const CURRENT_CONTEXT_VIEWER_DIMENSIONS : Dimensions = {
    height: USABLE_HEIGHT,
    width: (USABLE_WIDTH-CHANGE_CONTEXT_DIMENSIONS.width - SEPARATION*2)/2
}

export const MAIN_BUTTON_DIMENSIONS : Dimensions = {
    height: 35,
    width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width
}

export const CHANGE_CONTEXT_POSITION= {
    ...TOP_SEPARATION,
    left: CURRENT_CONTEXT_VIEWER_POSITION.left + CURRENT_CONTEXT_VIEWER_DIMENSIONS.width + SEPARATION
}

export const TEMPLATE_DIMENSIONS : Dimensions = {
    height: 300,
    width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width
}

export const SETTINGS_DIMENSIONS : Dimensions = {
    height: USABLE_HEIGHT - TEMPLATE_DIMENSIONS.height - MAIN_BUTTON_DIMENSIONS.height - (SEPARATION*2),
    width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width
}

export const SETTINGS_POSITION = {
    top: PADDING + TEMPLATE_DIMENSIONS.height + SEPARATION,
    left: CHANGE_CONTEXT_POSITION.left + CHANGE_CONTEXT_DIMENSIONS.width + SEPARATION
}

export const TEMPLATE_POSITION = {
    ...TOP_SEPARATION,
    left: SETTINGS_POSITION.left
}

export const MAIN_BUTTON_POSITION = {
    bottom: SEPARATION,
    left: SETTINGS_POSITION.left
}








