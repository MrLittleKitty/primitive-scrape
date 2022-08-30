import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import React from "react";
import ButtonBlockComponent from "./ButtonBlockComponent";
import {Box, Stack, SxProps, Theme, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ParsedField} from "../parsing/ParsedField";

interface DataRow {
    id: string,
    name: string,
    parsedData: string
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Field', flex: 1 },
    { field: 'parsedData', headerName: 'Parsed Data', minWidth: 300, flex: 3}
];

function mapToDataRow (field: ParsedField) : DataRow {
    return {
        id: field.parser.name,
        name: field.parser.name,
        parsedData: field.parsedValue
    }
}

interface ContexContextDetailsComponentProps {
    viewingContext: ParsingContext,
    contexts: ContextMap

    deleteButtonEnabled: boolean,
    deleteButtonClicked?: (context: ParsingContext) => void

    changeContextClick: (context: ParsingContext) => void,

    width: number,
    height: number,
    sx?: SxProps<Theme>
}

interface ContexContextDetailsComponentState {
}

export default class ContextDetailsComponent extends React.Component<ContexContextDetailsComponentProps, ContexContextDetailsComponentState> {

    constructor(props: ContexContextDetailsComponentProps) {
        super(props);
        this.state = {
        }
    }

    buildRows = () => {
        return [{
            id: "URL",
            name: "URL",
            parsedData: this.props.viewingContext.page.url,
        }, ...this.props.viewingContext.page.parsedFields.map(mapToDataRow)]
    }

    genButtonBlock = (context: ParsingContext) : JSX.Element => {
        return (
            <ButtonBlockComponent
                sx={{}}
                value={context}
                onClick={this.props.changeContextClick}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    render() {
        return (
            <Box sx={{
                height: this.props.height,
                width: this.props.width,
                ...(this.props.sx ? this.props.sx : {})
            }}>
                <Typography>
                    Context Name: {this.props.viewingContext.name}
                </Typography>
                <Typography>
                    Context Uid: {this.props.viewingContext.uid}
                </Typography>
                <Typography>
                    Template Name: {this.props.viewingContext.templateName}
                </Typography>
                {this.props.viewingContext.childContextsUids.length > 0 &&
                    <Box>
                        <Typography>
                            Child Contexts:
                        </Typography>
                        <Box sx={{
                            display: "flex"
                        }}>
                            <Stack
                               spacing={1}
                               direction={"row"}
                               sx={{
                                   flexWrap: "wrap",
                                   flex: 1,
                               }}
                            >
                                {this.props.viewingContext.childContextsUids.map(uid => this.genButtonBlock(this.props.contexts[uid]))}
                            </Stack>
                        </Box>
                    </Box>
                }

                {this.props.viewingContext.parentContextUid != null &&
                    <Box>
                        <Typography>
                            Parent Context:
                        </Typography>
                        <Box>
                            {this.genButtonBlock(this.props.contexts[this.props.viewingContext.parentContextUid])}
                        </Box>
                    </Box>
                }
                <Box sx={{
                    display: "flex",
                    height: this.props.height/2,
                    width: this.props.width,
                }}>
                    <Box sx={{
                        flex: 1
                    }}>
                        <DataGrid
                            rows={this.buildRows()}
                            columns={columns}
                            autoPageSize={true}
                            rowsPerPageOptions={[8]}
                            onProcessRowUpdateError={(error) => console.log(error)}
                        />
                    </Box>
                </Box>
                {this.props.deleteButtonEnabled &&
                    <ButtonBlockComponent
                        sx={{}}
                        value={this.props.viewingContext}
                        onClick={(value) => this.props.deleteButtonClicked ? this.props.deleteButtonClicked(value) : {}}
                    >
                        [DANGER] Delete this Context and all Children
                    </ButtonBlockComponent>
                }
            </Box>
        );
    }
}