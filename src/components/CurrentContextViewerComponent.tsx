import React from "react";
import {Box, Container, SxProps, Theme} from "@mui/material";
import {CURRENT_CONTEXT_VIEWER_DIMENSIONS} from "./PositionsAndDimensions";

interface CurrentContextViewerComponentProps {
    sx: SxProps<Theme>
}

interface CurrentContextViewerComponentState {

}

export default class CurrentContextViewerComponent extends React.Component<CurrentContextViewerComponentProps, CurrentContextViewerComponentState> {

    constructor(props: CurrentContextViewerComponentProps) {
        super(props);
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CURRENT_CONTEXT_VIEWER_DIMENSIONS,
                outline: "dashed black",
            }}>
                Context
            </Box>
        )
    }
}