import React from "react";
import {Box, SxProps, Theme} from "@mui/material";
import {TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";

interface TemplateViewerComponentProps {
    sx: SxProps<Theme>
}

interface TemplateViewerComponentState {

}

export default class TemplateViewerComponent extends React.Component<TemplateViewerComponentProps, TemplateViewerComponentState> {

    constructor(props: TemplateViewerComponentProps) {
        super(props);
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...TEMPLATE_DIMENSIONS,
                outline: "dashed black",
            }}>
                Template
            </Box>
        )
    }
}