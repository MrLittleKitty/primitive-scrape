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
    isMouseDown: boolean,
    isMouseOver: boolean,
}

type PaperButtonPropsWithChildren = React.PropsWithChildren<PaperButtonProps>

export default class PaperButton extends React.Component<PaperButtonPropsWithChildren, PaperButtonState> {

    constructor(props: PaperButtonPropsWithChildren) {
        super(props);
        this.state = {
            isMouseOver: false,
            isMouseDown: false,
        }
    }

    genColor = (isMouseDown: boolean, isMouseOver: boolean) : string => {
        if(isMouseDown) {
            return this.props.clickColor;
        }

        if(isMouseOver) {
            return this.props.hoverColor ? this.props.hoverColor : this.props.color;
        }

        return this.props.color;
    }

    genElevation = (isMouseDown: boolean, isMouseOver: boolean) : number => {
        if(isMouseOver) {
            return this.props.hoverElevation;
        }

        return 0;
    }

    // isMouseOver = (isMouseOver: boolean) => {
    //     const newBackgroundColor = isMouseOver ? (this.props.hoverColor ? this.props.hoverColor : this.state.backgroundColor) : this.props.color
    //     this.setState({
    //         elevation: isMouseOver ? this.props.hoverElevation : 0,
    //         backgroundColor: newBackgroundColor
    //     })
    // }
    //
    // isMouseDown = (isMouseDown: boolean) => {
    //     const newElevation = isMouseDown ? 0 : this.props.hoverElevation;
    //     this.setState({
    //         backgroundColor: isMouseDown ? this.props.clickColor : (this.props.hoverColor ? this.props.hoverColor : this.props.color),
    //         elevation: newElevation
    //     })
    // }

    render() {
        const color = this.genColor(this.state.isMouseDown, this.state.isMouseOver);
        return (
            <Paper
                elevation={this.genElevation(this.state.isMouseDown, this.state.isMouseOver)}
                sx={{
                    ...this.props.sx,
                    backgroundColor: color
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
                                 backgroundColor: color
                            }
                        }}

                        disableRipple={true}
                        disableFocusRipple={true}


                        onClick={this.props.onClick}

                        onMouseDown={() => this.setState({ isMouseDown: true})}
                        onMouseUp={() => this.setState({ isMouseDown: false})}
                        onMouseOver={() => this.setState({ isMouseOver: true})}
                        onMouseOut={() => this.setState({
                            isMouseOver: false,
                            isMouseDown: false,
                        })}>

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