import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {Box, Paper, SxProps, Theme, Typography} from "@mui/material";

interface ContextBlockComponentProps {
    sx: SxProps<Theme>
    context: ParsingContext
}

interface ContextBlockComponentState {

}

export default class ContextBlockComponent extends React.Component<ContextBlockComponentProps, ContextBlockComponentState> {

    constructor(props: ContextBlockComponentProps) {
        super(props);
    }

    render() {
        return (
            <Paper
                elevation={5}
                sx={{
                    ...this.props.sx
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
                        {this.props.context.name}
                    </Typography>
                </Box>
            </Paper>
        )
    }
}