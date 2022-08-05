import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {Box, Button, Paper, SxProps, Theme, Typography} from "@mui/material";


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
                elevation={0}
                sx={{
                    ...this.props.sx,
                    backgroundColor: "#ececec"
                }}
            >
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Button
                        sx={{
                            flex: 1,
                            minWidth: "100%",
                        }}
                        onClick={() => this.props.contextBlockClicked(this.props.context)}>
                        <Typography sx={{
                            color: "#404040"
                        }}>
                            {this.props.context.name}
                        </Typography>
                    </Button>
                </Box>
            </Paper>
        )
    }
}