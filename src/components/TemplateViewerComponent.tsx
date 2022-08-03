import React from "react";
import {Box, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, Theme, Typography} from "@mui/material";
import {HEADER_HEIGHT, SEPARATION, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: TEMPLATE_DIMENSIONS.height,
            width: TEMPLATE_DIMENSIONS.width,
        },
    },
};

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function mapToMenuItem(template: ParsingTemplate) {
    return (
        <MenuItem
            key={template.name}
            value={template.name}
            // style={getStyles(template.name, this.props.currentTemplate.name, theme)}
        >
            {template.name}
        </MenuItem>
    )
}

interface TemplateViewerComponentProps {
    sx: SxProps<Theme>,
    currentTemplate: ParsingTemplate,
    templates: ParsingTemplateMap,

    templateChangedFunc: (selectedTemplate: ParsingTemplate) => void
}

interface TemplateViewerComponentState {
}

export default class TemplateViewerComponent extends React.Component<TemplateViewerComponentProps, TemplateViewerComponentState> {

    constructor(props: TemplateViewerComponentProps) {
        super(props);
    }

    handleTemplateChange = (event: SelectChangeEvent<string>) => {
        const selectedTemplateName = event.target.value;
        if(selectedTemplateName !== this.props.currentTemplate.name) {
            const value = this.props.templates[selectedTemplateName]
            if(value) {
                this.props.templateChangedFunc(value);
            }
        }
    }

    // concatAllTemplates = () : ParsingTemplate[] => {
    //     if(this.props.currentTemplate.parentTemplateKey == null) {
    //         return this.props.templates;
    //     }
    //     return [...this.props.templates, ...this.props.currentTemplate.parentTemplate.childTemplates.filter(temp => temp.name !== this.props.currentTemplate.name)]
    // }

    render() {
        const viewableTemplates = this.props.templates; //TODO---Maybe the viewer should show only templates that fit in the current context (otherwise changing to a template might change the context)
        return (
            <Box sx={{
                ...this.props.sx,
                ...TEMPLATE_DIMENSIONS,
                outline: "dashed black",
            }}>
                <Box sx={{
                    width: TEMPLATE_DIMENSIONS.width,
                    height: HEADER_HEIGHT,
                    flex: 1,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography
                        variant={"h6"}
                        align={"center"}>
                        Template
                    </Typography>
                </Box>
                <Select
                    sx={{
                        width: TEMPLATE_DIMENSIONS.width,
                        height: TEMPLATE_DIMENSIONS.height-HEADER_HEIGHT,
                    }}
                    labelId="template-selector-label"
                    id="template-selector"
                    value={this.props.currentTemplate.name}
                    onChange={this.handleTemplateChange}
                    input={<OutlinedInput label="Template" />}
                    MenuProps={MenuProps}
                >
                    {Object.values(viewableTemplates).map(mapToMenuItem)}
                </Select>
            </Box>
        )
    }
}