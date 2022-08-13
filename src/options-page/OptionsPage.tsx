import React from 'react';
import {Box, Button, Stack} from "@mui/material";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import {TEXT_EXTRACT_NAME} from "../chrome/ProcessorFunctions";
import ButtonBlockComponent from "../components/ButtonBlockComponent";

let UNIT_REF_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Unit",
    childTemplatesKey: [],

    name: "Reference",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Building",
    childTemplatesKey: ["Reference"],

    name: "Unit",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["Unit"],

    name: "Building",
    parsableFields: [
        {
            name: "Name",
            nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(8) > div > div.backend_data.BuildingInfo-item > a",
            processorFunctionName: TEXT_EXTRACT_NAME,
        },
        {
            // This is for StreetEasy right now
            name: "Address",
            nodeSelector: "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a",
            processorFunctionName: TEXT_EXTRACT_NAME,
        }
    ],
    fieldToExtractContextNameFrom: "Name"
}

export const STREET_EASY_BUILDING_EXPLORER_TEMPLATE_MAP : ParsingTemplateMap = {
    [BUILDING_TEMPLATE.name] : BUILDING_TEMPLATE,
    [UNIT_TEMPLATE.name] : UNIT_TEMPLATE,
    [UNIT_REF_TEMPLATE.name] : UNIT_REF_TEMPLATE,
}

interface OptionsPageState {
    templateStore: StorageInterface<ParsingTemplateMap>
}

export default class OptionsPage extends React.Component<any, OptionsPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            templateStore: newLocalStorage("templates", {}, (value) => (value == null || Object.keys(value).length < 1))
        }
    }

    render() {

        return (
            <Box sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#F6F6F6",
            }}>
                <Stack spacing={2}>
                    <ButtonBlockComponent
                        sx={{}}
                        value={null}
                        onClick={(value) => {
                            this.state.templateStore.set(STREET_EASY_BUILDING_EXPLORER_TEMPLATE_MAP);
                        }}>
                        Load Default StreetEasy Templates
                    </ButtonBlockComponent>

                    <ButtonBlockComponent
                        sx={{}}
                        value={null}
                        onClick={(value) => {
                            this.state.templateStore.set({});
                        }}>
                        Clear Loaded Templates
                    </ButtonBlockComponent>
                </Stack>
            </Box>
        );
    }
}
