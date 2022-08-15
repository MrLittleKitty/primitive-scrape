import React from "react";
import {Box, SxProps, Theme} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, SEPARATION} from "./PositionsAndDimensions";
import {ParsedDataPreview} from "../parsing/ParsedDataPreview";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ParsedField} from "../parsing/ParsedField";

interface ScrapedDataPreviewComponentProps {
    sx: SxProps<Theme>,
    previewData: ParsedDataPreview,

    getDataCallback: (func: () => ParsedDataPreview) => void
}

interface ScrapedDataPreviewComponentState {
    data: ParsedDataPreview
}

interface DataRow {
    id: string,
    name: string,
    parsedData: string
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Field', width: (CHANGE_CONTEXT_DIMENSIONS.width/2) - SEPARATION },
    { field: 'parsedData', headerName: 'Parsed Data', width: (CHANGE_CONTEXT_DIMENSIONS.width/2) - SEPARATION, editable: true}
];

function mapToDataRow (field: ParsedField) : DataRow {
    return {
        id: field.parser.name,
        name: field.parser.name,
        parsedData: field.parsedValue
    }
}

export default class ScrapedDataPreviewComponent extends React.Component<ScrapedDataPreviewComponentProps, ScrapedDataPreviewComponentState> {

    constructor(props: ScrapedDataPreviewComponentProps) {
        super(props);
        this.state = {
            data: props.previewData
        }
    }

    componentDidMount() {
        this.props.getDataCallback(this.getData);
    }

    getData = () : ParsedDataPreview => {
        return this.state.data
    }

    handleRowUpdate = (newRow: DataRow, oldRow: DataRow) :  Promise<DataRow> | DataRow  => {
        console.log("Row changed:", newRow, oldRow);
        const parsedFields = this.state.data.page.parsedFields;
        console.log("parsed fields", parsedFields);
        for(let i = 0; i < parsedFields.length; i++) {
            let field = parsedFields[i];
            if(field.parser.name === oldRow.name) {
                console.log("Found field", field);
                field.parsedValue = newRow.parsedData;
                parsedFields[i] = field;
                let newData = this.state.data;
                newData.page.parsedFields = parsedFields;
                this.setState({
                    data: newData
                })
            }
        }

        return newRow;
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <DataGrid
                    rows={this.state.data.page.parsedFields.map(mapToDataRow)}
                    columns={columns}
                    autoPageSize={true}
                    rowsPerPageOptions={[8]}
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={this.handleRowUpdate}
                />
            </Box>
        )
    }
}