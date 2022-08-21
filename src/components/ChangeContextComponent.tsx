import React from "react";
import {Box, Divider, Stack, SxProps, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, HEADER_HEIGHT} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ButtonBlockComponent from "./ButtonBlockComponent";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap
    currentContext: ParsingContext | null

    templateMap: ParsingTemplateMap,
    changeContextCallback: (context: ParsingContext) => void
}

interface ChangeContextComponentState {

}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
    }

    createContextItem = (context: ParsingContext, index: number) => {
        return (
            <ButtonBlockComponent
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "8px",
                }}
                value={context}
                onClick={this.props.changeContextCallback}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    buildTemplateSections = (contextMap: ContextMap, contextCallback: (context: ParsingContext) => void) : JSX.Element[] => {
        const map = new Map<string, ParsingContext[]>();
        for(let context of Object.values(contextMap)) {
            const template = context.templateName;
            const value = map.get(template);
            if(value != null) {
                map.set(template, [...value, context]);
            }
            else {
                map.set(template, [context]);
            }
        }

        interface Entry {
            templateName: string,
            contexts: ParsingContext[]
        }

        let entries : Entry[] = [];
        for(let entry of map.entries()) {
            entries.push({
                templateName: entry[0],
                contexts: entry[1]
            })
        }

        function inParentTree(templateMap: ParsingTemplateMap, templateA: ParsingTemplate, templateB: ParsingTemplate) {
            let template = templateB;
            while(template.parentTemplateKey != null && template.parentTemplateKey !== '') {
                if(template.name === templateA.name || template.parentTemplateKey === templateA.name) {
                    return true;
                }
                template = templateMap[template.parentTemplateKey];
            }
            return false;
        }

        entries = entries.sort((a,b) => {
            const templateA = this.props.templateMap[a.templateName];
            const templateB = this.props.templateMap[b.templateName];

            console.log("Comparing", templateA.name, templateB.name);

            if(inParentTree(this.props.templateMap, templateB, templateA)) {
                // A comes first if A is B's parent
                return 1;
            } else if(inParentTree(this.props.templateMap, templateA, templateB)) {
                return -1;
            }
            else return 0;
        });

        const results : JSX.Element[] = [];
        for(let entry of entries) {
            results.push((
                <TemplateSection
                    templateName={entry.templateName}
                    contexts={entry.contexts}
                    selectedContext={null}
                    contextClicked={contextCallback}/>
            ))
            results.push((<Divider/>));
        }
        results.pop();

        return results;
    }

    render() {
        return (
            <Box sx={{
                ...this.props.sx,
                ...CHANGE_CONTEXT_DIMENSIONS,
                backgroundColor: "white",
                overflowY: "auto",
                overflowX: "hidden",
            }}>
                <Box sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    width: CHANGE_CONTEXT_DIMENSIONS.width-20,
                    height: CHANGE_CONTEXT_DIMENSIONS.height-HEADER_HEIGHT,
                }}>
                    {this.buildTemplateSections(this.props.contexts, this.props.changeContextCallback)}
                </Box>
            </Box>
        )
    }
}

interface TemplateSectionProps {
    templateName: string

    contexts: ParsingContext[],
    selectedContext: ParsingContext|null,

    contextClicked: (context: ParsingContext) => void
}

interface TemplateSectionState {

}

class TemplateSection extends React.Component<TemplateSectionProps, TemplateSectionState>{
    constructor(props: TemplateSectionProps) {
        super(props);
    }


    createContextItem = (context: ParsingContext, index: number) => {
        return (
            <ButtonBlockComponent
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "8px",
                }}
                value={context}
                onClick={this.props.contextClicked}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    render() {
        return (
            <>
                <Box sx={{
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
                        {this.props.templateName}
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Stack
                        direction={"row"}
                        sx={{
                            flexWrap: "wrap",
                            flex: 1,
                        }}
                    >
                        {Object.values(this.props.contexts).map(this.createContextItem)}
                    </Stack>
                </Box>
            </>
        )
    }
}