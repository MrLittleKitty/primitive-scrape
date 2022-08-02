import React from "react";
import {Box, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, CURRENT_CONTEXT_VIEWER_DIMENSIONS, HEADER_HEIGHT} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ContextBlockComponent from "./ContextBlockComponent";

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap
    currentContext: ParsingContext | null
}

interface ChangeContextComponentState {

}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
    }

    createContextItem = (context: ParsingContext, index: number) => {
        return (
            <ContextBlockComponent
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "16px",
                }}
                context={context}
            />
        )
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                outline: "dashed black",
            }}>
                <Box sx={{
                    width: CHANGE_CONTEXT_DIMENSIONS.width,
                    height: HEADER_HEIGHT,
                    flex: 1,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography
                        variant={"h6"}
                        align={"center"}>
                        Change Current Context
                    </Typography>
                </Box>
                <Stack
                    direction={"row"}
                    sx={{
                        flexWrap: "wrap",
                        margin: "8px",
                    }}
                >
                    {Object.values(this.props.contexts).filter(value => this.props.currentContext == null || value.uid !== this.props.currentContext.uid).map(this.createContextItem)}
                </Stack>
            </Box>
        )
    }
}