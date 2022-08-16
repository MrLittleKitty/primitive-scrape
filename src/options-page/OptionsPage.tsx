import React from 'react';
import {Box, Button, Stack} from "@mui/material";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import {IMAGE_EXTRACT_NAME, TEXT_EXTRACT_NAME} from "../chrome/ProcessorFunctions";
import ButtonBlockComponent from "../components/ButtonBlockComponent";

let UNIT_REF_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "UL - Unit",
    childTemplatesKey: [],

    name: "UL - Reference",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "UL - Building",
    childTemplatesKey: ["UL - Reference"],

    name: "UL - Unit",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

// { // This is also for Street Easy
//     name: "Name",
//         nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(8) > div > div.backend_data.BuildingInfo-item > a",
//     processorFunctionName: TEXT_EXTRACT_NAME,
// },
// {
//     // This is for StreetEasy right now
//     name: "Address",
//         nodeSelector: "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a",
//     processorFunctionName: TEXT_EXTRACT_NAME,
// },

let BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["UL - Unit"],

    name: "UL - Building",
    parsableFields: [
        {
            name: "Name",
            nodeSelector: "body > div.title > h1",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: ".*?:(.+)",
        },
        {
            name: "Address",
            nodeSelector: "body > div:nth-child(4) > div > div.building__detail > div.building__address",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Floor Count",
            nodeSelector: "body > div:nth-child(4) > div > div.building__overview > ul.building__stats > li:nth-child(2) > span.building__stats__value",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Unit Count",
            nodeSelector: "body > div:nth-child(4) > div > div.building__overview > ul.building__stats > li:nth-child(3) > span.building__stats__value",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Cover Image URL",
            nodeSelector: "body > div.slideshow > div > div.slideshow__nav > a.slideshow__nav__item.slideshow__nav__item--active > img",
            processorFunctionName: IMAGE_EXTRACT_NAME,
            processorFunctionArgument: "",
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
