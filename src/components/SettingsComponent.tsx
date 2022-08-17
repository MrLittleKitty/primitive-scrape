import React from "react";
import {Box, FormControlLabel, FormGroup, IconButton, Stack, Switch, SxProps, Theme, Typography} from "@mui/material";
import {HEADER_HEIGHT, SETTINGS_DIMENSIONS} from "./PositionsAndDimensions";
import SettingsIcon from '@mui/icons-material/Settings';
import ButtonBlockComponent from "./ButtonBlockComponent";

interface SettingsComponentProps {
    sx: SxProps<Theme>
    moveToContext: boolean,
    previewData: boolean,

    viewContextButtonClicked: () => void,
    downloadButtonClicked: () => void,
    settingsIconClicked: () => void,
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
                        width: SETTINGS_DIMENSIONS.width-10,
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

                        <Box sx={{
                            padding: 0,
                            flex: 1,
                            display: "flex",
                            justifyContent: "end"
                        }}>
                            <IconButton onClick={this.props.settingsIconClicked}>
                                <SettingsIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Stack spacing={1}>
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={this.props.previewData} onChange={(event) => this.props.previewDataChanged(event.target.checked)}/>} label="Preview Data" />
                            <FormControlLabel control={<Switch checked={this.props.moveToContext} onChange={(event) => this.props.moveToContextChanged(event.target.checked)}/>} label="Move to Context" />
                        </FormGroup>

                        <ButtonBlockComponent
                            sx={{}}
                            value={null}
                            onClick={(value) => this.props.downloadButtonClicked()}
                        >
                            Download Data
                        </ButtonBlockComponent>

                        <ButtonBlockComponent
                            sx={{}}
                            value={null}
                            onClick={(value) => this.props.viewContextButtonClicked()}
                        >
                            View Context
                        </ButtonBlockComponent>
                    </Stack>
                </Box>
            </Box>
        )
    }
}