import React from "react";
import {
    Box, Divider, IconButton,
    MenuItem,
    Stack,
    SxProps,
    Theme,
    Typography
} from "@mui/material";
import {CURRENT_CONTEXT_VIEWER_DIMENSIONS, HEADER_HEIGHT, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";
import ButtonBlockComponent from "./ButtonBlockComponent";
import SettingsIcon from '@mui/icons-material/Settings';

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
    currentTemplate: ParsingTemplate|null,
    validTemplates: ParsingTemplateMap,

    iconClicked: () => void,
    templateChangedFunc: (selectedTemplate: ParsingTemplate) => void
}

interface TemplateViewerComponentState {
}

export default class TemplateViewerComponent extends React.Component<TemplateViewerComponentProps, TemplateViewerComponentState> {

    constructor(props: TemplateViewerComponentProps) {
        super(props);
    }

    handleTemplateChange = (template: ParsingTemplate) => {
        const selectedTemplateName = template.name;
        if(this.props.currentTemplate == null || selectedTemplateName !== this.props.currentTemplate.name) {
            const value = this.props.validTemplates[selectedTemplateName]
            if(value) {
                this.props.templateChangedFunc(value);
            }
        }
    }

    buildTemplateButton = (template: ParsingTemplate) => {
        return (
              <ButtonBlockComponent
                  sx={{}}
                  value={template}
                  onClick={this.handleTemplateChange}
              >
                  {template.name}
              </ButtonBlockComponent>
        );
    }

    buildChangeTemplateTree = (currentTemplate: ParsingTemplate|null, templates: ParsingTemplateMap) : JSX.Element[] => {
        let values = Object.values(templates);
        if(currentTemplate != null) {
            values = values.filter(template => template.name !== currentTemplate.name)
        }
        return values.map(template => this.buildTemplateButton(template));
    }

    render() {
        const templateTree = this.buildChangeTemplateTree(this.props.currentTemplate, this.props.validTemplates); //TODO---Maybe the viewer should show only templates that fit in the current context (otherwise changing to a template might change the context)
        return (
            <Box sx={{
                ...this.props.sx,
                ...TEMPLATE_DIMENSIONS,
                backgroundColor: "white",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px"
                }}>
                    <Box sx={{
                        width: TEMPLATE_DIMENSIONS.width-10,
                        height: HEADER_HEIGHT,
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center",
                    }}>
                        <Typography
                            sx={{
                                color: "#404040"
                            }}
                            align={"center"}>
                            Current Template
                        </Typography>

                        <Box sx={{
                            padding: 0,
                            flex: 1,
                            display: "flex",
                            justifyContent: "end"
                        }}>
                            <IconButton onClick={this.props.iconClicked}>
                                <SettingsIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        height: TEMPLATE_DIMENSIONS.height-HEADER_HEIGHT,
                    }}>
                        <Stack spacing={1}>
                            {this.props.currentTemplate != null &&
                                this.buildTemplateButton(this.props.currentTemplate)
                            }

                            <Divider/>

                            <Box>
                                <Box sx={{
                                    width: TEMPLATE_DIMENSIONS.width,
                                    height: HEADER_HEIGHT,
                                    display: "flex",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}>
                                    <Typography
                                        sx={{
                                            color: "#404040"
                                        }}
                                        align={"center"}>
                                        Other Templates
                                    </Typography>
                                </Box>

                                <Stack spacing={1}>
                                    {templateTree}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Box>

            </Box>
        )
    }
}