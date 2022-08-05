import React from "react";
import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
    Typography
} from "@mui/material";
import {HEADER_HEIGHT, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";

function mapToMenuItem(template: ParsingTemplate) {
    return (
        <MenuItem
            key={template.name}
            value={template.name}
        >
            <Typography sx={{
                color: "#404040"
            }}>
                {template.name}
            </Typography>
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

    render() {
        const viewableTemplates = this.props.templates; //TODO---Maybe the viewer should show only templates that fit in the current context (otherwise changing to a template might change the context)
        return (
            <Box sx={{
                ...this.props.sx,
                ...TEMPLATE_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <Box sx={{
                    width: TEMPLATE_DIMENSIONS.width,
                    height: HEADER_HEIGHT,
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                    marginRight: "10px"
                }}>
                    <Typography
                        sx={{
                            color: "#404040"
                        }}
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
                >
                    {Object.values(viewableTemplates).map(mapToMenuItem)}
                </Select>
            </Box>
        )
    }
}