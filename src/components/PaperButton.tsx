import React from "react";
import {Box, Button, Paper, SxProps, Theme, Typography} from "@mui/material";

interface PaperButtonProps {
    sx: SxProps<Theme>

    hoverElevation: number,
    hoverColor?: string,

    color: string,
    clickColor: string,

    textColor: string,

    onClick: () => void
}

interface PaperButtonState {
    elevation: number,
    backgroundColor: string
}

type PaperButtonPropsWithChildren = React.PropsWithChildren<PaperButtonProps>

export default class PaperButton extends React.Component<PaperButtonPropsWithChildren, PaperButtonState> {

    constructor(props: PaperButtonPropsWithChildren) {
        super(props);
        this.state = {
            elevation: 0,
            backgroundColor: this.props.color,
        }
    }

    isMouseOver = (isMouseOver: boolean) => {
        const newBackgroundColor = isMouseOver ? (this.props.hoverColor ? this.props.hoverColor : this.state.backgroundColor) : this.props.color
        this.setState({
            elevation: isMouseOver ? this.props.hoverElevation : 0,
            backgroundColor: newBackgroundColor
        })
    }

    isMouseDown = (isMouseDown: boolean) => {
        const newElevation = isMouseDown ? 0 : this.props.hoverElevation;
        this.setState({
            backgroundColor: isMouseDown ? this.props.clickColor : (this.props.hoverColor ? this.props.hoverColor : this.props.color),
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
                        onClick={this.props.onClick}
                        onMouseOver={() => this.isMouseOver(true)}
                        onMouseOut={() => this.isMouseOver(false)}>

                        <Typography sx={{
                            color: this.props.textColor
                        }}>
                            {this.props.children}
                        </Typography>
                    </Button>
                </Box>
            </Paper>
        )
    }
}