import React, {SyntheticEvent} from "react";
import {Autocomplete, Box, Divider, IconButton, Stack, SxProps, TextField, Theme, Typography} from "@mui/material";
import {CHANGE_CONTEXT_DIMENSIONS, HEADER_HEIGHT, TEMPLATE_DIMENSIONS} from "./PositionsAndDimensions";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ButtonBlockComponent from "./ButtonBlockComponent";
import {ParsingTemplate, ParsingTemplateMap} from "../parsing/ParsingTemplate";

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

interface ChangeContextComponentProps {
    sx: SxProps<Theme>
    contexts: ContextMap
    currentContext: ParsingContext | null

    templateMap: ParsingTemplateMap,
    changeContextCallback: (context: ParsingContext) => void
}

interface ChangeContextComponentState {
    searchInput: string
}

export default class ChangeContextComponent extends React.Component<ChangeContextComponentProps, ChangeContextComponentState> {

    constructor(props: ChangeContextComponentProps) {
        super(props);
        this.state = {
            searchInput: "",
        };
    }

    changeSearchInput = (event: SyntheticEvent, newValue: string) => {
        this.setState({
            searchInput: newValue
        })
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

    filterContext = (searchInput: string, context: ParsingContext) : boolean => {
        // Show everything on empty input
        if(searchInput == null || searchInput.trim() === '') {
            return true;
        }

        // Check the name, UID, and template name
        if(context.name.includes(searchInput) || context.uid.startsWith(searchInput) || context.templateName.includes(searchInput)) {
            return true;
        }

        if(context.parentContextUid != null) {
            const parentContext = this.props.contexts[context.parentContextUid];
            if(parentContext != null) {
                return this.filterContext(searchInput, parentContext);
            }
        }

        // Check the URL
        // if(context.page.url.includes(searchInput)) {
        //     return true;
        // }

        return false;
    }

    buildTemplateSections = (contextMap: ContextMap, currentContext: ParsingContext|null, contextCallback: (context: ParsingContext) => void) : JSX.Element[] => {
        const map = new Map<string, ParsingContext[]>();
        for(let context of Object.values(contextMap).filter(context => this.filterContext(this.state.searchInput,context))) {
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

        entries = entries.sort((a,b) => {
            const templateA = this.props.templateMap[a.templateName];
            const templateB = this.props.templateMap[b.templateName];

            if(inParentTree(this.props.templateMap, templateB, templateA)) {
                // A comes first if A is B's parent
                return 1;
            } else if(inParentTree(this.props.templateMap, templateA, templateB)) {
                return -1;
            }
            else return 0;
        });

        function buildSubtree(context: ParsingContext) : string[] {
            let values = [context.uid];

            if(context.childContextsUids.length < 1) {
                return values;
            }

            for(let child of context.childContextsUids) {
                const childContext = contextMap[child];
                values = [...values, ...buildSubtree(childContext)]
            }
            return values;
        }

        const selectedContexts = new Set<string>();
        if(currentContext != null) {
            const subtree = buildSubtree(currentContext);
            for(let value of subtree) {
                selectedContexts.add(value);
            }
        }

        const results : JSX.Element[] = [];
        for(let entry of entries) {
            results.push((
                <TemplateSection
                    templateName={entry.templateName}
                    contexts={entry.contexts}
                    selectedContextsUids={selectedContexts}
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
                    <Box sx={{
                        width: CHANGE_CONTEXT_DIMENSIONS.width-10,
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
                            Change Context
                        </Typography>

                        <Box sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "start",
                        }}>
                            <Autocomplete
                                sx={{
                                    width: 200,
                                    paddingRight: "20px",
                                }}
                                size={"small"}
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                filterOptions={(x) => x}
                                inputValue={this.state.searchInput}
                                onInputChange={this.changeSearchInput}
                                options={[]}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Contexts"
                                    />
                                )}
                            />
                        </Box>
                    </Box>

                    <Divider/>

                    {this.buildTemplateSections(this.props.contexts, this.props.currentContext, this.props.changeContextCallback)}
                </Box>
            </Box>
        )
    }
}

interface TemplateSectionProps {
    templateName: string

    contexts: ParsingContext[],
    selectedContextsUids: Set<string>,

    contextClicked: (context: ParsingContext) => void
}

interface TemplateSectionState {

}

class TemplateSection extends React.Component<TemplateSectionProps, TemplateSectionState>{
    constructor(props: TemplateSectionProps) {
        super(props);
    }


    createContextItem = (context: ParsingContext, index: number, highLight: boolean) => {
        return (
            <ButtonBlockComponent
                sx={{
                    marginBottom: "8px",
                    marginLeft: index === 0 ? "0" : "8px",
                }}
                value={context}
                onClick={this.props.contextClicked}
                color={highLight ? "#404040" : undefined}
                textColor={highLight ? "#ececec" : undefined}
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
                        {Object.values(this.props.contexts).sort((a,b) => a.name.localeCompare(b.name)).map((item, index) => this.createContextItem(item, index, this.props.selectedContextsUids.has(item.uid)))}
                    </Stack>
                </Box>
            </>
        )
    }
}