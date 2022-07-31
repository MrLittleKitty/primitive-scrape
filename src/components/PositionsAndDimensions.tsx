const PADDING = 5
export const SEPARATION = 10

const USABLE_WIDTH = 800 - (PADDING*2);
const USABLE_HEIGHT = 600 - (PADDING*2)

const TOP_SEPARATION = {
    top: PADDING
}

export interface Dimensions {
    width: number,
    height: number
}


export const CURRENT_CONTEXT_VIEWER_POSITION = {
    ...TOP_SEPARATION,
    left: PADDING,
}

export const CURRENT_CONTEXT_VIEWER_DIMENSIONS : Dimensions = {
    height: 450,
    width: 200
}

export const CHANGE_CONTEXT_POSITION= {
    ...TOP_SEPARATION,
    left: CURRENT_CONTEXT_VIEWER_POSITION.left + CURRENT_CONTEXT_VIEWER_DIMENSIONS.width + SEPARATION
}

export const CHANGE_CONTEXT_DIMENSIONS : Dimensions = {
    height: 450,
    width: 450
}

export const SETTINGS_POSITION = {
    ...TOP_SEPARATION,
    left: CHANGE_CONTEXT_POSITION.left +CHANGE_CONTEXT_DIMENSIONS.width + SEPARATION
}

export const SETTINGS_DIMENSIONS : Dimensions = {
    height: 500,
    width: USABLE_WIDTH - SETTINGS_POSITION.left
}

export const TEMPLATE_POSITION = {
    top: CURRENT_CONTEXT_VIEWER_POSITION.top + CURRENT_CONTEXT_VIEWER_DIMENSIONS.height + SEPARATION,
    left: CURRENT_CONTEXT_VIEWER_POSITION.left
}

export const TEMPLATE_DIMENSIONS : Dimensions = {
    height: 100,
    width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width
}

export const MAIN_BUTTON_POSITION = {
    bottom: PADDING,
    left: "50%",
    transform: "translate(-50%, 0)",
}

export const MAIN_BUTTON_DIMENSIONS : Dimensions = {
    height: 500,
    width: 500
}








