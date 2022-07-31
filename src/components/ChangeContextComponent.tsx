import React from "react";
import {Box, SxProps, Theme} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS} from "./PositionsAndDimensions";

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
}

interface ChangeContextComponentState {

}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                outline: "dashed black",
            }}>
                Change Context
            </Box>
        )
    }
}