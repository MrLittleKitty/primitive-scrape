import React from "react";
import {Box, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, HEADER_HEIGHT} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ButtonBlockComponent from "./ButtonBlockComponent";

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap
    currentContext: ParsingContext | null

    changeContextCallback: (context: ParsingContext) => void
}

interface ChangeContextComponentState {

}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
    }

    createContextItem = (context: ParsingContext, index: number) => {
        return (
            <ButtonBlockComponent
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "8px",
                }}
                value={context}
                onClick={this.props.changeContextCallback}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px"
                }}>
                    <Box sx={{
                        width: CHANGE_CONTEXT_DIMENSIONS.width-20,
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
                            Change Current Context
                        </Typography>
                    </Box>

                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        width: CHANGE_CONTEXT_DIMENSIONS.width-20,
                        height: CHANGE_CONTEXT_DIMENSIONS.height-HEADER_HEIGHT-5,
                    }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <Stack
                                direction={"row"}
                                sx={{
                                    flexWrap: "wrap",
                                    flex: 1,
                                }}
                            >
                                {Object.values(this.props.contexts).filter(value => this.props.currentContext == null || value.uid !== this.props.currentContext.uid).map(this.createContextItem)}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }
}