import React from "react";
import {Box, SxProps, Theme} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, SEPARATION} from "./PositionsAndDimensions";
import {ParsedDataPreview} from "../parsing/ParsedDataPreview";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ParsedField} from "../parsing/ParsedField";

interface ScrapedDataPreviewComponentProps {
    sx: SxProps<Theme>,
    previewData: ParsedDataPreview
}

interface ScrapedDataPreviewComponentState {

}

interface DataRow {
    name: string,
    parsedData: string
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Field', width: (CHANGE_CONTEXT_DIMENSIONS.width/2) - SEPARATION },
    { field: 'parsedData', headerName: 'Parsed Data', width: (CHANGE_CONTEXT_DIMENSIONS.width/2) - SEPARATION}
];

function mapToDataRow (field: ParsedField) : DataRow {
    return {
        name: field.parser.name,
        parsedData: field.parsedValue
    }
}

export default class ScrapedDataPreviewComponent extends React.Component<ScrapedDataPreviewComponentProps, ScrapedDataPreviewComponentState> {

    constructor(props: ScrapedDataPreviewComponentProps) {
        super(props);
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                outline: "dashed black",
            }}>
                <DataGrid
                    rows={this.props.previewData.page.parsedFields.map(mapToDataRow)}
                    columns={columns}
                    autoPageSize={true}
                    rowsPerPageOptions={[8]}
                />
            </Box>
        )
    }
}