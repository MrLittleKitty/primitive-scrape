import React from "react";
import {Box, FormControlLabel, FormGroup, Switch, SxProps, Theme, Typography} from "@mui/material";
import {HEADER_HEIGHT, SETTINGS_DIMENSIONS} from "./PositionsAndDimensions";

interface SettingsComponentProps {
    sx: SxProps<Theme>
    moveToContext: boolean,
    previewData: boolean,

    previewDataChanged: (value: boolean) => void
    moveToContextChanged: (value: boolean) => void
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

                    <FormGroup>
                        <FormControlLabel control={<Switch checked={this.props.previewData} onChange={(event) => this.props.previewDataChanged(event.target.checked)}/>} label="Preview Data" />
                        <FormControlLabel control={<Switch checked={this.props.moveToContext} onChange={(event) => this.props.moveToContextChanged(event.target.checked)}/>} label="Move to Context" />
                    </FormGroup>
                </Box>
            </Box>
        )
    }
}