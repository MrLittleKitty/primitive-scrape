import React from "react";
import {Box, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CURRENT_CONTEXT_VIEWER_DIMENSIONS, HEADER_HEIGHT, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ContextBlockComponent from "./ContextBlockComponent";

interface CurrentContextViewerComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap,
    currentContext: ParsingContext|null,
}

interface CurrentContextViewerComponentState {

}

export default class CurrentContextViewerComponent extends React.Component<CurrentContextViewerComponentProps, CurrentContextViewerComponentState> {

    constructor(props: CurrentContextViewerComponentProps) {
        super(props);
    }

    createContextTree = (startingContext: ParsingContext|null, contextMap: ContextMap) : ParsingContext[] => {
        if(startingContext == null) {
            return []
        }
        let root = startingContext;
        let tree = [startingContext]
        while(root.parentContextUid != null) {
            const parent = contextMap[root.parentContextUid]
            tree.push(parent)
            root = parent;
        }
        tree = tree.reverse();
        return tree
    }

    createContextTreeItem = (context: ParsingContext, index: number) => {
        return (
            <ContextBlockComponent
                sx={{

                }}
                context={context}
                contextBlockClicked={(context) => {}}
            />
        )
    }

    render() {
        const contextTree = this.createContextTree(this.props.currentContext, this.props.contexts);
        return (
            <Box sx={{
                ...this.props.sx,
                ...CURRENT_CONTEXT_VIEWER_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <Box sx={{
                    width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width,
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
                        Current Context
                    </Typography>
                </Box>
                <Stack
                    spacing={2}
                    sx={{
                        margin: "8px",
                    }}
                >
                    {Object.values(contextTree).map(this.createContextTreeItem)}
                </Stack>
            </Box>
        )
    }
}