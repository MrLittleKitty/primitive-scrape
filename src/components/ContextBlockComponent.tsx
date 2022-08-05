import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {Box, Button, Paper, SxProps, Theme, Typography} from "@mui/material";


interface ContextBlockComponentProps {
    sx: SxProps<Theme>
    context: ParsingContext

    contextBlockClicked: (context: ParsingContext) => void
}

interface ContextBlockComponentState {
    elevation: number,
    backgroundColor: string
}

export default class ContextBlockComponent extends React.Component<ContextBlockComponentProps, ContextBlockComponentState> {

    constructor(props: ContextBlockComponentProps) {
        super(props);
        this.state = {
            elevation: 0,
            backgroundColor: "#ececec"
        }
    }

    isMouseOver = (isMouseOver: boolean) => {
        const newBackgroundColor = isMouseOver ? this.state.backgroundColor : "#ececec"
        this.setState({
            elevation: isMouseOver ? 1 : 0,
            backgroundColor: newBackgroundColor
        })
    }

    isMouseDown = (isMouseDown: boolean) => {
        const newElevation = isMouseDown ? 0 : 1
        this.setState({
            backgroundColor: isMouseDown ? "#c9c9c9" : "#ececec",
            elevation: newElevation
        })
    }

    render() {
        return (
            <Paper
                elevation={this.state.elevation}
                sx={{
                    ...this.props.sx,
                    backgroundColor: this.state.backgroundColor
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
                            '&:hover': {
                                backgroundColor: this.state.backgroundColor
                            }
                        }}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onMouseDown={() => this.isMouseDown(true)}
                        onMouseUp={() => this.isMouseDown(false)}
                        onClick={() => this.props.contextBlockClicked(this.props.context)}
                        onMouseOver={() => this.isMouseOver(true)}
                        onMouseOut={() => this.isMouseOver(false)}>
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