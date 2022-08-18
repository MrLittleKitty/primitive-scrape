import React from 'react';
import {Box, Typography} from "@mui/material";
import {newLocalStorage, StorageInterface} from "../chrome/ChromeStorage";
import ButtonBlockComponent from "../components/ButtonBlockComponent";
import {ContextMap, ParsingContext} from "../parsing/ParsingContext";
import ContextDetailsComponent from "../components/ContextDetails";
import {DeleteContextMessage, TYPE_DELETE_CONTEXT} from "../chrome/MessagePassing";


interface ContextPageState {
    contextStore: StorageInterface<ContextMap>
    viewingContext: ParsingContext|null,
}

function genContextIdFromQueryParams() : string {
    const queryParams = window.location.search;
    console.log("query params", queryParams);
    const id = queryParams.substring(11);
    console.log("Context id", id);
    return id;
}

export default class ContextPage extends React.Component<any, ContextPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            contextStore: newLocalStorage("contextStorage", {}, (value) => (value == null || Object.keys(value).length < 1)),
            viewingContext: null,
        }
        this.state.contextStore.load().then(this.updateContextStoreAndViewingContext);
        // window.addEventListener('load', (event) => {
        //     const contextId = genContextIdFromQueryParams();
        //     this.setState({
        //         viewingContext: this.state.contextStore.get()[contextId]
        //     });
        // });
    }

    updateContextStoreAndViewingContext = (contextStore: StorageInterface<ContextMap>) => {
        const contextId = genContextIdFromQueryParams();
        const context = contextStore.get()[contextId];
        this.setState({
            contextStore: contextStore,
            viewingContext: context
        });
    }

    genButtonBlock = (context: ParsingContext) : JSX.Element => {
        return (
            <ButtonBlockComponent
                sx={{}}
                value={context}
                onClick={(value) => {}}
            >
                {context.name}
            </ButtonBlockComponent>
        )
    }

    sendDeleteMessage = (context: ParsingContext) => {
        chrome.runtime.sendMessage<DeleteContextMessage>({
            type: TYPE_DELETE_CONTEXT,
            contextUid: context.uid
        }, (response: any) => window.close());
    }

    render() {
        //const blocks = Object.values(this.state.contextStore.get()).map(context => this.genButtonBlock(context));
        const context = this.state.viewingContext;
        if(context == null) {
            return (
                <Typography>
                    No context to view
                </Typography>
            );
        }

        return (
            <Box sx={{
                height: "100%",
                width: "600px",
                backgroundColor: "#F6F6F6",
            }}>
               <ContextDetailsComponent
                   viewingContext={context}
                   contexts={this.state.contextStore.get()}
                   changeContextClick={(value) => this.setState({
                       viewingContext: value
                   })}
                   deleteButtonEnabled={true}
                   deleteButtonClicked={this.sendDeleteMessage}
               />
            </Box>
        );
    }
}
