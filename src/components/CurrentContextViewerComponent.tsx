import React from "react";
import {Box, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CURRENT_CONTEXT_VIEWER_DIMENSIONS, HEADER_HEIGHT} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ButtonBlockComponent from "./ButtonBlockComponent";

interface CurrentContextViewerComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap,
    currentContext: ParsingContext|null,

    contextClicked: (context: ParsingContext|null) => void,
}

interface CurrentContextViewerComponentState {

}

export default class CurrentContextViewerComponent extends React.Component<CurrentContextViewerComponentProps, CurrentContextViewerComponentState> {

    constructor(props: CurrentContextViewerComponentProps) {
        super(props);
    }

    createContextTree = (startingContext: ParsingContext|null, contextMap: ContextMap) : JSX.Element[] => {
        if(startingContext == null) {
            return []
        }
        let root = startingContext;
        let tree = [startingContext]
        while(root.parentContextUid != null) { //TODO---Maybe need to make sure root is never null as well?
            const parent = contextMap[root.parentContextUid]
            tree.push(parent)
            root = parent;
        }
        let components = Object.values(tree).map(this.createContextTreeItem)
        components.push(
            (
                <ButtonBlockComponent
                    sx={{

                    }}
                    value={null}
                    onClick={this.props.contextClicked}>
                    Clear Context
                </ButtonBlockComponent>
            )
        );
        components = components.reverse();
        return components
    }

    createContextTreeItem = (context: ParsingContext, index: number) => {
        return (
            <ButtonBlockComponent
                sx={{

                }}
                value={context}
                onClick={this.props.contextClicked}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    render() {
        const contextTree : JSX.Element[] = this.createContextTree(this.props.currentContext, this.props.contexts);
        return (
            <Box sx={{
                ...this.props.sx,
                ...CURRENT_CONTEXT_VIEWER_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                }}>
                    <Box sx={{
                        width: CURRENT_CONTEXT_VIEWER_DIMENSIONS.width,
                        height: HEADER_HEIGHT,
                        flex: 1,
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center"
                    }}>
                        <Typography
                            sx={{
                                color: "#404040"
                            }}
                            align={"center"}>
                            Current Context
                        </Typography>
                    </Box>
                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        height: CURRENT_CONTEXT_VIEWER_DIMENSIONS.height-HEADER_HEIGHT,
                    }}>
                        <Stack
                            spacing={1}
                        >
                            {contextTree}
                        </Stack>
                    </Box>
                </Box>
            </Box>
        )
    }
}