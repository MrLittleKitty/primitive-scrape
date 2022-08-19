import React from 'react';
import {Box, Stack} from "@mui/material";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import {
    ENUM_VALUE_EXTRACT_NAME,
    EXTRACT_FIRST_LINK_TEXT_NAME,
    IMAGE_EXTRACT_NAME,
    SEARCH_TEXT_EXTRACT_NAME,
    TEXT_EXTRACT_NAME
} from "../chrome/ProcessorFunctions";
import ButtonBlockComponent from "../components/ButtonBlockComponent";
import {ParseFieldTarget, ParsingFieldSet} from "../parsing/ParsedField";


/*
    This extracts the value to the right of the first colon
 */
const RIGHT_OF_COLON_REGEX = ".*?:(.+)";
const UL_SQUARE_FEET_REGEX = ".*?([\\d,]+)[ -]\\bsquare\\b[ -](?:feet|foot).*";
const UL_BEDROOMS_REGEX = ".*?((?:[\\d.]+)|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[ -]+(?:bedroom|bdrm)[s]?.*";
const UL_BATHROOMS_REGEX = ".*?((?:[\\d.]+)|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[ -]+(?:bathroom|bath)[s]?.*";
const BUILDING_TYPE_ENUM_VALUES = "condo,house,townhouse,floating home,loft condo,loft home,custom home";

const URBAN_LIVING_URL_REGEX = "http[s]?:\\/\\/www.urbnlivn.com\\/.*"
const STREET_EASY_URL_REGEX = "http[s]?:\\/\\/streeteasy.com\\/.*"
const REDFIN_URL_REGEX = "http[s]?:\\/\\/www.redfin.com\\/.*"
//

const UL_BUILDING_SET :ParsingFieldSet = {
    name: "Urban Living Building",
    fields: [
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
            name: "Type",
            nodeSelector: "body > div.title > h1",
            processorFunctionName: ENUM_VALUE_EXTRACT_NAME,
            processorFunctionArgument: BUILDING_TYPE_ENUM_VALUES,
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
    pageMatchingRegex: URBAN_LIVING_URL_REGEX
}

const UL_UNIT_SET :ParsingFieldSet = {
    name: "Urban Living Unit",
    fields: [
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
            nodeSelector: "body > article.post > div > div.post__content",
            processorFunctionName: SEARCH_TEXT_EXTRACT_NAME,
            processorFunctionArgument: UL_BEDROOMS_REGEX,
        },
        {
            name: "Bathrooms",
            nodeSelector: "body > article.post > div > div.post__content",
            processorFunctionName: SEARCH_TEXT_EXTRACT_NAME,
            processorFunctionArgument: UL_BATHROOMS_REGEX,
        },
        {
            name: "Cover Image URL",
            nodeSelector: "body > article.post > div > figure > div > img",
            processorFunctionName: IMAGE_EXTRACT_NAME,
            processorFunctionArgument: "",
        }
    ],
    pageMatchingRegex: URBAN_LIVING_URL_REGEX,
}

const UL_REFERENCE_SET :ParsingFieldSet = {
    name: "Urban Living Reference",
    fields: [
        {
            name: "Title",
            nodeSelector: "body > article.post > div > h1",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Description",
            nodeSelector: "",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Source Name",
            nodeSelector: "body > header > div > div > div > a > span.logo__name",
            processorFunctionName: TEXT_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
        {
            name: "Image URL",
            nodeSelector: "body > article.post > div > figure > div > img",
            processorFunctionName: IMAGE_EXTRACT_NAME,
            processorFunctionArgument: "",
        },
    ],
    pageMatchingRegex: URBAN_LIVING_URL_REGEX,
}

const SE_UNIT_SET :ParsingFieldSet = {
    name: "Street Easy Unit",
    fields: [
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
    pageMatchingRegex: STREET_EASY_URL_REGEX,
}


let BUILDING_TEMPLATE : ParsingTemplate = {
    name: "Building",
    parentTemplateKey: null,
    childTemplatesKey: ["Unit"],

    parsingFieldSets: [UL_BUILDING_SET],
    defaultParsingFieldSet: UL_BUILDING_SET,

    fieldToExtractContextNameFrom: "Name"
}

let UNIT_TEMPLATE : ParsingTemplate = {
    name: "Unit",
    parentTemplateKey: "Building",
    childTemplatesKey: ["Reference"],

    parsingFieldSets: [UL_UNIT_SET],
    defaultParsingFieldSet: UL_UNIT_SET,

    fieldToExtractContextNameFrom: "Unit Number"
}

let REFERENCE_TEMPLATE : ParsingTemplate = {
    name: "Reference",
    parentTemplateKey: "Unit",
    childTemplatesKey: [],

    parsingFieldSets: [UL_REFERENCE_SET],
    defaultParsingFieldSet: UL_REFERENCE_SET,

    fieldToExtractContextNameFrom: "Source Name"
}

export const DEFAULT_BUILDING_EXPLORER_TEMPLATE_MAP : ParsingTemplateMap = {
    [BUILDING_TEMPLATE.name] : BUILDING_TEMPLATE,
    [UNIT_TEMPLATE.name] : UNIT_TEMPLATE,
    [REFERENCE_TEMPLATE.name] : REFERENCE_TEMPLATE,
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
                        Load Default Templates
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
