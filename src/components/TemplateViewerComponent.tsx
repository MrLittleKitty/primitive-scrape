import React from "react";
import {Box, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, Theme, Typography} from "@mui/material";
import {SEPARATION, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ParsingTemplate} from "../parsing/ParsingTemplate";

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: TEMPLATE_DIMENSIONS.height/2,
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
    templates: ParsingTemplate[],
    templateChangedFunc: (selectedTemplate: ParsingTemplate) => void
}

interface TemplateViewerComponentState {
    value: string
}

export default class TemplateViewerComponent extends React.Component<TemplateViewerComponentProps, TemplateViewerComponentState> {

    constructor(props: TemplateViewerComponentProps) {
        super(props);
    }

    handleTemplateChange = (event: SelectChangeEvent<string>) => {
        const selectedTemplateName = event.target.value;
        if(selectedTemplateName !== this.props.currentTemplate.name) {
            const templatesToSearch = this.concatAllTemplates()
            const value = templatesToSearch.find((value) => value.name === selectedTemplateName)
            if(value) {
                this.props.templateChangedFunc(value);
            }
        }
    }

    concatAllTemplates = () : ParsingTemplate[] => {
        if(this.props.currentTemplate.parentTemplate == null) {
            return this.props.templates;
        }
        return [...this.props.templates, ...this.props.currentTemplate.parentTemplate.childTemplates.filter(temp => temp.name !== this.props.currentTemplate.name)]
    }

    render() {
        const templates = this.concatAllTemplates();
        return (
            <Box sx={{
                ...this.props.sx,
                ...TEMPLATE_DIMENSIONS,
                outline: "dashed black",
            }}>
                <Box sx={{
                    width: TEMPLATE_DIMENSIONS.width,
                    height: (TEMPLATE_DIMENSIONS.height/2) - SEPARATION,
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
                        height: TEMPLATE_DIMENSIONS.height/2
                    }}
                    labelId="template-selector-label"
                    id="template-selector"
                    value={this.props.currentTemplate.name}
                    onChange={this.handleTemplateChange}
                    input={<OutlinedInput label="Template" />}
                    MenuProps={MenuProps}
                >
                    {templates.map(mapToMenuItem)}
                </Select>
            </Box>
        )
    }
}