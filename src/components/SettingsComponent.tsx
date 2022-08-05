import React from "react";
import {Box, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, HEADER_HEIGHT, SETTINGS_DIMENSIONS} from "./PositionsAndDimensions";

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
                backgroundColor: "white",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px"
                }}>
                    <Box sx={{
                        width: SETTINGS_DIMENSIONS.width,
                        height: HEADER_HEIGHT,
                        flex: 1,
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center"
                    }}>
                        <Typography
                            sx={{
                                color: "#404040"
                            }}
                            align={"center"}>
                            Settings
                        </Typography>
                    </Box>
                </Box>

            </Box>
        )
    }
}