import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {Box, Button, Paper, SxProps, Theme, Typography} from "@mui/material";
import PaperButton from "./PaperButton";


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
            <PaperButton
                sx={this.props.sx}
                hoverElevation={1}
                color={"#ececec"}
                clickColor={"#c9c9c9"}
                textColor={"#404040"}
                onClick={() => this.props.contextBlockClicked(this.props.context)}
            >
                {this.props.context.name}
            </PaperButton>
        )
    }
}