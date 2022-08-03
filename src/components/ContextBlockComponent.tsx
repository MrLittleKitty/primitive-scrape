import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {Box, Button, Paper, SxProps, Theme} from "@mui/material";

interface ContextBlockComponentProps {
    sx: SxProps<Theme>
    context: ParsingContext

    contextBlockClicked: (context: ParsingContext) => void
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
                    <Button
                        sx={{
                            flex: 1,
                        }}
                        onClick={() => this.props.contextBlockClicked(this.props.context)}>
                        {this.props.context.name}
                    </Button>
                </Box>
            </Paper>
        )
    }
}