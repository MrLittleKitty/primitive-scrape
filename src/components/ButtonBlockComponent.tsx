import React from "react";
import {SxProps, Theme} from "@mui/material";
import PaperButton from "./PaperButton";

interface ButtonBlockComponentProps<T> {
    sx: SxProps<Theme>
    value: T

    onClick: (value: T) => void
}

interface ButtonBlockComponentState {
    elevation: number,
    backgroundColor: string
}

type ButtonBlockComponentPropsWithChildren<T> = React.PropsWithChildren<ButtonBlockComponentProps<T>>

export default class ButtonBlockComponent<T> extends React.Component<ButtonBlockComponentPropsWithChildren<T>, ButtonBlockComponentState> {

    constructor(props: ButtonBlockComponentPropsWithChildren<T>) {
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
                onClick={() => this.props.onClick(this.props.value)}
            >
                {this.props.children}
            </PaperButton>
        )
    }
}