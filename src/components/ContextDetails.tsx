import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import React from "react";
import ButtonBlockComponent from "./ButtonBlockComponent";
import {Box, Stack, Typography} from "@mui/material";
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

    changeContextClick: (context: ParsingContext) => void,
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
                height: 1000,
                width: 500,
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
                <Typography>
                    Child Contexts:
                </Typography>
                <Box sx={{
                    display: "flex"
                }}>
                    <Stack
                       spacing={1}
                    >
                        {this.props.viewingContext.childContextsUids.map(uid => this.genButtonBlock(this.props.contexts[uid]))}
                    </Stack>
                </Box>

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
                    height: 500,
                    width: 600,
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
            </Box>
        );
    }
}