import React from 'react';
import {Box, Stack} from "@mui/material";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import {
    EXTRACT_FIRST_LINK_TEXT_NAME,
    IMAGE_EXTRACT_NAME,
    SEARCH_TEXT_EXTRACT_NAME,
    TEXT_EXTRACT_NAME
} from "../chrome/ProcessorFunctions";
import ButtonBlockComponent from "../components/ButtonBlockComponent";


/*
    This extracts the value to the right of the first colon
 */
const RIGHT_OF_COLON_REGEX = ".*?:(.+)";
const UL_SQUARE_FEET_REGEX = ".*?([\\d,]+)[ -]\\bsquare\\b[ -](?:feet|foot).*";
const UL_BEDROOMS_REGEX = "";
const UL_BATHROOMS_REGEX = "";

let UL_BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["UL - Unit"],

    name: "UL - Building",
    parsableFields: [
        {
            name: "Name",
            nodeSelector: "body > div.title > h1",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: RIGHT_OF_COLON_REGEX,
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

let UL_UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "UL - Building",
    childTemplatesKey: ["UL - Reference"],

    name: "UL - Unit",
    parsableFields: [
        {
            name: "Unit Number",
            nodeSelector: "body > article.post > div > div.post__content",
            processorFunctionName: EXTRACT_FIRST_LINK_TEXT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Square Feet",
            nodeSelector: "body > article.post > div > div.post__content",
            processorFunctionName: SEARCH_TEXT_EXTRACT_NAME,
            processorFunctionArgument: UL_SQUARE_FEET_REGEX,
        },
        {
            name: "Floor Number",
            nodeSelector: "",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Bedrooms",
            nodeSelector: "",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Bathrooms",
            nodeSelector: "",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Cover Image URL",
            nodeSelector: "body > article.post > div > figure > div > img",
            processorFunctionName: IMAGE_EXTRACT_NAME,
            processorFunctionArgument: "",
        }
    ],
    fieldToExtractContextNameFrom: "Unit Number"
}

let UL_REFERENCE_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "UL - Unit",
    childTemplatesKey: [],

    name: "UL - Reference",
    parsableFields: [],
    fieldToExtractContextNameFrom: "Name"
}

let STREET_EASY_BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["SE - Unit"],

    name: "SE - Building",
    parsableFields: [

    ],
    fieldToExtractContextNameFrom: "Name"
}

let STREET_EASY_UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "SE - Building",
    childTemplatesKey: ["SE - Reference"],

    name: "SE - Unit",
    parsableFields: [
        {
            name: "Name",
            // This extract is actually for the building name, but on the unit page...its weird
            nodeSelector: "#content > main > div.row.DetailsPage > article:nth-child(4) > section:nth-child(8) > div > div.backend_data.BuildingInfo-item > a",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Address",
            // This extractor is the entire address, which contains the unit number on street easy
            nodeSelector: "#content > main > div.row.DetailsPage > article.right-two-fifths > section.main-info > h1 > a",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
    ],
    fieldToExtractContextNameFrom: "Name"
}

let STREET_EASY_REFERENCE_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "SE - Unit",
    childTemplatesKey: [],

    name: "SE - Reference",
    parsableFields: [

    ],
    fieldToExtractContextNameFrom: "Name"
}

let REDFIN_BUILDING_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: null,
    childTemplatesKey: ["Redfin - Unit"],

    name: "Redfin - Building",
    parsableFields: [

    ],
    fieldToExtractContextNameFrom: "Name"
}

let REDFIN_UNIT_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Redfin - Building",
    childTemplatesKey: ["Redfin - Reference"],

    name: "Redfin - Unit",
    parsableFields: [

    ],
    fieldToExtractContextNameFrom: "Name"
}

let REDFIN_REFERENCE_TEMPLATE : ParsingTemplate = {
    parentTemplateKey: "Redfin - Unit",
    childTemplatesKey: [],

    name: "Redfin - Reference",
    parsableFields: [

    ],
    fieldToExtractContextNameFrom: "Name"
}

export const DEFAULT_BUILDING_EXPLORER_TEMPLATE_MAP : ParsingTemplateMap = {
    [UL_BUILDING_TEMPLATE.name] : UL_BUILDING_TEMPLATE,
    [STREET_EASY_BUILDING_TEMPLATE.name] : STREET_EASY_BUILDING_TEMPLATE,
    [REDFIN_BUILDING_TEMPLATE.name] : REDFIN_BUILDING_TEMPLATE,

    [UL_UNIT_TEMPLATE.name] : UL_UNIT_TEMPLATE,
    [STREET_EASY_UNIT_TEMPLATE.name] : STREET_EASY_UNIT_TEMPLATE,
    [REDFIN_UNIT_TEMPLATE.name] : REDFIN_UNIT_TEMPLATE,

    [UL_REFERENCE_TEMPLATE.name] : UL_REFERENCE_TEMPLATE,
    [STREET_EASY_REFERENCE_TEMPLATE.name] : STREET_EASY_REFERENCE_TEMPLATE,
    [REDFIN_REFERENCE_TEMPLATE.name] : REDFIN_REFERENCE_TEMPLATE,
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
        const setState = this.setState.bind(this)

        this.state.templateStore.load().then(value => setState({
            templateStore: value
        }))
    }

    render() {

        return (
            <Box sx={{
                height: "600px",
                width: "600px",
                backgroundColor: "#F6F6F6",
            }}>
                <Stack spacing={2}>
                    <ButtonBlockComponent
                        sx={{}}
                        value={null}
                        onClick={(value) => {
                            this.state.templateStore.set(DEFAULT_BUILDING_EXPLORER_TEMPLATE_MAP);
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
