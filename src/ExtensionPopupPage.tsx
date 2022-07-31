import React from 'react';
import {
  ParseMessage,
  ParseResponse,
  ParseSucceededMessage,
  ScrapeMessage,
  TYPE_PARSE, TYPE_PARSE_SUCCEEDED,
  TYPE_SCRAPE
} from "./chrome/MessagePassing";
import {Box, Button} from "@mui/material";
import CurrentContextViewerComponent from "./components/CurrentContextViewerComponent";
import {
    CHANGE_CONTEXT_POSITION,
    CURRENT_CONTEXT_VIEWER_POSITION,
    MAIN_BUTTON_POSITION,
    SETTINGS_POSITION, TEMPLATE_POSITION
} from "./components/PositionsAndDimensions";
import ChangeContextComponent from "./components/ChangeContextComponent";
import SettingsComponent from "./components/SettingsComponent";
import TemplateViewerComponent from "./components/TemplateViewerComponent";
import {ParsingContext} from "./parsing/ParsingContext";
import {ParsingTemplate, STREET_EASY_BUILDING_EXPLORER_TEMPLATES} from "./parsing/ParsingTemplate";


interface ExtensionPopupPageState {
    context: ParsingContext | null,

    templates: ParsingTemplate[],
    currentTemplate: ParsingTemplate,

    moveToContext: boolean,
    previewScrape: boolean,
}

export default class ExtensionPopupPage extends React.Component<any, ExtensionPopupPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
        context: null,
        templates: STREET_EASY_BUILDING_EXPLORER_TEMPLATES,
        currentTemplate: STREET_EASY_BUILDING_EXPLORER_TEMPLATES[0],

        moveToContext: true,
        previewScrape: true,
    }
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listenForParseResult);
  }


  listenForParseResult = (request: ParseSucceededMessage, sender: chrome.runtime.MessageSender, responseFunc: (response: any) => void) => {
    console.log("Popup received message:", request)
    if(request.type === TYPE_PARSE_SUCCEEDED) {
        //TODO---Implementation
    }
    responseFunc({});
    return true;
  }

  sendScrapeMessage = () => {
        const instance = this;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if(tabs[0].id != null) {
            const id = tabs[0].id;
            chrome.scripting.executeScript({
              target: {tabId: id, allFrames: false},
              files: ['content.js'],
            }, (results) => {
              chrome.tabs.sendMessage<ScrapeMessage>(id, {
                  type: TYPE_SCRAPE,
                  context: instance.state.context,
                  template: instance.state.currentTemplate
              });
            });``
          }
        });
  }

  render() {
    return (
        <Box sx={{
          height: "100%",
          width: "100%",

        }}>
          <CurrentContextViewerComponent
              sx={{
                position: "absolute",
                ...CURRENT_CONTEXT_VIEWER_POSITION,
              }}
          />

          <ChangeContextComponent
              sx={{
                position: "absolute",
                ...CHANGE_CONTEXT_POSITION,
              }}
          />

          <SettingsComponent
              sx={{
                position: "absolute",
                ...SETTINGS_POSITION
              }}
          />

          <TemplateViewerComponent
            sx={{
                position: "absolute",
                ...TEMPLATE_POSITION,
            }}
            currentTemplate={this.state.currentTemplate}
            templateChangedFunc={(template) => {
                this.setState({
                    currentTemplate: template
                })
            }}
          />

          <Button
              sx={{
                position: "absolute",
                ...MAIN_BUTTON_POSITION,
              }}
              variant="contained"
              onClick={this.sendScrapeMessage}>
            Scrape this page
          </Button>
        </Box>
    );
  }
}
