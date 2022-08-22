import React from "react";
import {SxProps, Theme} from "@mui/material";
import PaperButton from "./PaperButton";

interface ButtonBlockComponentProps<T> {
    sx: SxProps<Theme>
    value: T

    onClick: (value: T) => void

    color?: string,
    textColor?: string,
}

interface ButtonBlockComponentState {
}

type ButtonBlockComponentPropsWithChildren<T> = React.PropsWithChildren<ButtonBlockComponentProps<T>>

export default class ButtonBlockComponent<T> extends React.Component<ButtonBlockComponentPropsWithChildren<T>, ButtonBlockComponentState> {

    constructor(props: ButtonBlockComponentPropsWithChildren<T>) {
        super(props);
    }

    render() {
        return (
            <PaperButton
                sx={this.props.sx}
                hoverElevation={1}
                color={this.props.color ? this.props.color : "#ececec"}
                clickColor={"#c9c9c9"}
                textColor={this.props.textColor ? this.props.textColor : "#404040"}
                onClick={() => this.props.onClick(this.props.value)}
            >
                {this.props.children}
            </PaperButton>
        )
    }
}