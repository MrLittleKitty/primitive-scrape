import React from "react";
import {ParsingContext} from "../parsing/ParsingContext";
import {SxProps, Theme} from "@mui/material";

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
            <>
            </>
        )
    }
}