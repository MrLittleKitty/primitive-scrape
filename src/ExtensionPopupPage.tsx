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
import {ParsedPage} from "./parsing/ParsedPage";
import ScrapedDataPreviewComponent from "./components/ScrapedDataPreviewComponent";
import {ParsedDataPreview} from "./parsing/ParsedDataPreview";
import { v4 as uuidv4 } from 'uuid';

interface ScrapeMessageContext {
    context: ParsingContext | null,
    template: ParsingTemplate
}

interface ExtensionPopupPageState {
    currentContext: ParsingContext | null,

    templates: ParsingTemplate[],
    currentTemplate: ParsingTemplate,

    scrapeMessageContexts: Map<string, ScrapeMessageContext>

    previewingData: ParsedDataPreview | null,

    moveToContext: boolean,
    previewScrape: boolean,
}

export default class ExtensionPopupPage extends React.Component<any, ExtensionPopupPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
        templates: STREET_EASY_BUILDING_EXPLORER_TEMPLATES,

        currentContext: null,
        currentTemplate: STREET_EASY_BUILDING_EXPLORER_TEMPLATES[0],

        scrapeMessageContexts: new Map<string, ScrapeMessageContext>(),

        previewingData: null,

        moveToContext: true,
        previewScrape: true,
    }
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listenForParseResult);
  }

  saveParsedData = (page: ParsedPage, context: ParsingContext | null) => {

      if(this.state.moveToContext) {
          //TODO---Move to the new context

          //TODO--Maybe also add to a list of recent contexts for viewing later
      }
  }

  processParsedData = (page: ParsedPage, context: ParsingContext | null, template: ParsingTemplate) => {
      if(this.state.previewScrape) {
          this.setState({
              previewingData: {
                  page: page,
                  context: context,
              }
          })
      } else {
          //No data previewing, so we just save the data right away
          this.saveParsedData(page, context)
      }
  }

  listenForParseResult = (request: ParseSucceededMessage, sender: chrome.runtime.MessageSender, responseFunc: (response: any) => void) => {
    console.log("Popup received message:", request)
    if(request.type === TYPE_PARSE_SUCCEEDED) {
        const messageContext : ScrapeMessageContext|undefined = this.state.scrapeMessageContexts.get(request.uid);
        if(messageContext) {
            this.processParsedData(request.result, messageContext.context, messageContext.template)
        }
        this.state.scrapeMessageContexts.delete(request.uid);
    }
    responseFunc({});
    return true;
  }

  sendScrapeMessage = () => {
        const instance = this;
        const uid = uuidv4();
        const messageContext : ScrapeMessageContext = {
            context: this.state.currentContext,
            template: this.state.currentTemplate
        }
        this.state.scrapeMessageContexts.set(uid, messageContext)

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if(tabs[0].id != null) {
            const id = tabs[0].id;
            chrome.scripting.executeScript({
              target: {tabId: id, allFrames: false},
              files: ['content.js'],
            }, (results) => {
              chrome.tabs.sendMessage<ScrapeMessage>(id, {
                  type: TYPE_SCRAPE,
                  uid: uid,
                  templateName: messageContext.template.name,
                  parseFields: messageContext.template.parsableFields,
              });
            });
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

          {this.state.previewingData == null &&
              <ChangeContextComponent
                sx={{
                    position: "absolute",
                    ...CHANGE_CONTEXT_POSITION,
                }}
              />
          }

            {this.state.previewingData != null &&
                <ScrapedDataPreviewComponent
                    sx={{
                        position: "absolute",
                        ...CHANGE_CONTEXT_POSITION,
                    }}
                    previewData={this.state.previewingData}
                />
            }
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
            templates={this.state.templates}
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
