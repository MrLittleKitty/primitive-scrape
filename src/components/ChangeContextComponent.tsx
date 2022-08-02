import React from "react";
import {Box, Paper, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, SEPARATION, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap
    currentContext: ParsingContext | null
}

interface ChangeContextComponentState {

}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
    }

    createContextItem = (context: ParsingContext, index: number) => {
        return (
            <Paper
                elevation={5}
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "16px",
                }}
            >
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px"
                }}>
                    <Typography
                        align={"center"}>
                        {context.name}
                    </Typography>
                </Box>
            </Paper>
        )
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                outline: "dashed black",
            }}>
                <Stack
                    direction={"row"}
                    sx={{
                        flexWrap: "wrap",
                        margin: "8px",
                    }}
                >
                    {Object.values(this.props.contexts).filter(value => this.props.currentContext == null || value.uid !== this.props.currentContext.uid).map(this.createContextItem)}
                </Stack>
            </Box>
        )
    }
}