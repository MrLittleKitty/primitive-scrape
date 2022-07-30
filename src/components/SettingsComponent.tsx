import React from "react";
import {Box, SxProps, Theme} from "@mui/material";
import {SETTINGS_DIMENSIONS} from "./PositionsAndDimensions";

interface SettingsComponentProps {
    sx: SxProps<Theme>
}

interface SettingsComponentState {

}

export default class SettingsComponent extends React.Component<SettingsComponentProps, SettingsComponentState> {

    constructor(props: SettingsComponentProps) {
        super(props);
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...SETTINGS_DIMENSIONS,
                outline: "dashed black",
            }}>
                Settings
            </Box>
        )
    }
}