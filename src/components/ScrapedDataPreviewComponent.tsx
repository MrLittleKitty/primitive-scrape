import React from "react";
import {Box, IconButton, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, HEADER_HEIGHT, SEPARATION} from "./PositionsAndDimensions";
import {ParsedDataPreview} from "../parsing/ParsedDataPreview";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ParsedField} from "../parsing/ParsedField";
import {ParsingTemplateMap} from "../parsing/ParsingTemplate";
import ClearIcon from '@mui/icons-material/Clear';

interface ScrapedDataPreviewComponentProps {
    sx: SxProps<Theme>,
    previewData: ParsedDataPreview,
    templates: ParsingTemplateMap,

    clearPreviewData: (dataPreviewUid: string) => void,
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
    { field: 'name', headerName: 'Field', flex: 1 },
    { field: 'parsedData', headerName: 'Parsed Data', minWidth: (CHANGE_CONTEXT_DIMENSIONS.width/2) - SEPARATION, editable: true, flex: 3}
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
        const parsedFields = this.state.data.page.parsedFields;
        const template = this.props.templates[this.state.data.templateName];
        if(template != null && template.fieldToExtractContextNameFrom === newRow.name) {
            // I guess it only makes sense to validate the new context name if the template exists?
            const extractedContextName = newRow.parsedData;
            if(!this.validateContextName(extractedContextName)) {
                chrome.notifications.create("", {
                    type: "basic",
                    title: "Invalid Context Name",
                    message: "A context name must be set for a scraped page. Please set field '"+template.fieldToExtractContextNameFrom+"' to a non-empty value.",
                    iconUrl: "Icon-48.png"
                });
                return oldRow;
            }
        }

        for(let i = 0; i < parsedFields.length; i++) {
            let field = parsedFields[i];
            if(field.parser.name === oldRow.name) {
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

    validateContextName = (name: string) : boolean => {
        return name != null && name.trim() !== "";
    }

    buildRows = () => {
        return [{
            id: "URL",
            name: "URL",
            parsedData: this.state.data.page.url,
        }, ...this.state.data.page.parsedFields.map(mapToDataRow)]
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                backgroundColor: "white",
                display: "flex",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
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
                            Preview Scraped Data
                        </Typography>

                        <Box sx={{
                            padding: 0,
                            flex: 1,
                            display: "flex",
                            justifyContent: "end"
                        }}>
                            <IconButton onClick={() => this.props.clearPreviewData(this.state.data.previewUid)}>
                                <ClearIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        display: "flex",
                        width: CHANGE_CONTEXT_DIMENSIONS.width-20,
                        height: CHANGE_CONTEXT_DIMENSIONS.height-HEADER_HEIGHT-5,
                    }}>
                        <Box sx={{
                            flex: 1
                        }}>
                            <DataGrid
                                rows={this.buildRows()}
                                columns={columns}
                                autoPageSize={true}
                                rowsPerPageOptions={[8]}
                                experimentalFeatures={{ newEditingApi: true }}
                                processRowUpdate={this.handleRowUpdate}
                                onProcessRowUpdateError={(error) => console.log(error)}
                                isCellEditable={(params) => params.row.name !== "URL"}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }
}