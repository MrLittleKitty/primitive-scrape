import React from 'react';
import {
    ChangeCurrentContextMessage,
    ChangeTemplateMessage, ClearPreviewDataMessage,
    SavePreviewDataMessage,
    ScrapeMessage,
    TYPE_CHANGE_CURRENT_CONTEXT,
    TYPE_CHANGE_TEMPLATE,
    TYPE_CLEAR_PREVIEW_DATA,
    TYPE_SAVE_PREVIEW_DATA,
    TYPE_SCRAPE
} from "./chrome/MessagePassing";
import {Box, Typography} from "@mui/material";
import CurrentContextViewerComponent from "./components/CurrentContextViewerComponent";
import {
    CHANGE_CONTEXT_POSITION,
    CURRENT_CONTEXT_VIEWER_POSITION,
    MAIN_BUTTON_DIMENSIONS,
    MAIN_BUTTON_POSITION,
    SETTINGS_POSITION,
    TEMPLATE_POSITION
} from "./components/PositionsAndDimensions";
import ChangeContextComponent from "./components/ChangeContextComponent";
import SettingsComponent from "./components/SettingsComponent";
import TemplateViewerComponent from "./components/TemplateViewerComponent";
import {ContextMap, ParsingContext} from "./parsing/ParsingContext";
import {genValidTemplatesForContext, ParsingTemplate, ParsingTemplateMap,} from "./parsing/ParsingTemplate";
import ScrapedDataPreviewComponent from "./components/ScrapedDataPreviewComponent";
import {ParsedDataPreview} from "./parsing/ParsedDataPreview";
import {v4 as uuidv4} from 'uuid';
import {
    newLocalStorage,
    newReadOnlyLocalStorage,
    ReadOnlyStorageInterface,
    StorageInterface
} from "./chrome/ChromeStorage";
import {DEFAULT_SETTINGS, ParseSettings} from "./parsing/ParseSettings";
import PaperButton from "./components/PaperButton";
import ButtonBlockComponent from "./components/ButtonBlockComponent";
import {sendBasicNotification} from "./chrome/ChromeUtils";
import {ParseFieldTarget} from "./parsing/ParsedField";

interface ExtensionPopupPageState {
    contexts: ReadOnlyStorageInterface<ContextMap>
    currentContext: ReadOnlyStorageInterface<ParsingContext | null>,

    allTemplates: ReadOnlyStorageInterface<ParsingTemplateMap>,
    validTemplates: ParsingTemplateMap,
    currentTemplate: ReadOnlyStorageInterface<ParsingTemplate|null>,

    previewingData: ReadOnlyStorageInterface<ParsedDataPreview[]>,
    getPreviewDataFunc: (() => ParsedDataPreview)|null,

    parseSettings: StorageInterface<ParseSettings>,
}

function loadStateFromStorage(state: {[key: string] : any}, key: string, func: (state: any) => void) {
    const constFunc = func;
    const value = state[key];
    if(value != null) {
        // @ts-ignore because this isn't type safe, but we know it is being used on storage interfaces in state
        value.load().then(value => {
            constFunc({
                [key]: value
            })
        });
    }
}

export default class ExtensionPopupPage extends React.Component<any, ExtensionPopupPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
        contexts: newReadOnlyLocalStorage("contextStorage", {}, (value) => this.setState({
            contexts: value
        }), (value) => (value == null || Object.keys(value).length < 1)),
        allTemplates: newReadOnlyLocalStorage("templates", {}, (value) => this.setState({
            allTemplates: value,
            validTemplates: genValidTemplatesForContext(this.state.currentContext.get(), this.state.allTemplates.get()),
        }),(value) => (value == null || Object.keys(value).length < 1)),

        currentContext: newReadOnlyLocalStorage("currentContext", null, (value) => this.setState({
            currentContext: value,
            validTemplates: genValidTemplatesForContext(value.get(), this.state.allTemplates.get())
        })),
        currentTemplate: newReadOnlyLocalStorage("currentTemplate", null, (value) => this.setState({
            currentTemplate: value
        }),(value) => (value == null || Object.keys(value).length < 1)),

        previewingData: newReadOnlyLocalStorage("previewingData", [], (value) => this.setState({
            previewingData: value
        }),(value) => (value == null || value.length < 1)),
        getPreviewDataFunc: null,

        parseSettings: newLocalStorage("parseSettings", DEFAULT_SETTINGS),

        validTemplates: {},
    }

    const setState = this.setState.bind(this)

    // The strings used is these functions are the fields names inside this.state, not the key used in local storage
    loadStateFromStorage(this.state, "previewingData", setState);
    loadStateFromStorage(this.state, "allTemplates", setState);
    loadStateFromStorage(this.state, "contexts", setState);
    loadStateFromStorage(this.state, "currentTemplate", setState);
    loadStateFromStorage(this.state, "parseSettings", setState);

      loadStateFromStorage(this.state, "currentContext", (values) => {
          this.setState(values);
          this.setState({
              //TODO--This is not really a thread safe way to ensure we can set valid templates
              //TODO----We need to actually wait until allTemplates AND currentContext have both loaded before we can do this
              validTemplates: genValidTemplatesForContext(this.state.currentContext.get(), this.state.allTemplates.get()),
          })
      });
  }

  genParsingFields = (template: ParsingTemplate, url: string) : ParseFieldTarget[] => {
      for(let set of template.parsingFieldSets) {
          const regex = new RegExp(set.pageMatchingRegex);
          if(url.match(regex)) {
              return set.fields;
          }
      }
      return template.defaultParsingFieldSet.fields;
  }

  sendScrapeMessage = () => {
    const uid = uuidv4();

    const template = this.state.currentTemplate.get();
    if(template == null) {
        //You can't parse anything with a null template
        return
    }

    const messageContext = {
        template: template,
        context: this.state.currentContext.get(),
        settings: this.state.parseSettings.get(),
        genFieldsFunc: this.genParsingFields
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0].id != null) {
        const id = tabs[0].id;
        const url = tabs[0].url;
        chrome.scripting.executeScript({
          target: {tabId: id, allFrames: false},
          files: ['content.js'],
        }, (results) => {
          chrome.tabs.sendMessage<ScrapeMessage>(id, {
              type: TYPE_SCRAPE,
              uid: uid,
              parentContextUid: messageContext.context == null ? null : messageContext.context.uid,
              template: messageContext.template,
              parseFields: messageContext.genFieldsFunc(messageContext.template, url == null ? "" : url),
              settings: messageContext.settings
          });
        });
      }
    });
  }

  savePreviewedData = () => {
      const getDataFunc = this.state.getPreviewDataFunc;
      if(getDataFunc == null) {
          return
      }

      const previewingData = getDataFunc();
      if(previewingData == null) {
          return
      }

      chrome.runtime.sendMessage<SavePreviewDataMessage>({
          type: TYPE_SAVE_PREVIEW_DATA,
          settings: this.state.parseSettings.get(),
          previewData: previewingData,
      });
  }

  clearPreviewData = (previewUid: string) => {
      chrome.runtime.sendMessage<ClearPreviewDataMessage>({
          type: TYPE_CLEAR_PREVIEW_DATA,
          previewUid: previewUid
      });
  }

  sendChangeContextMessage = (context: ParsingContext|null) => {
      console.log("Trying to change to", context);
      chrome.runtime.sendMessage<ChangeCurrentContextMessage>({
          type: TYPE_CHANGE_CURRENT_CONTEXT,
          contextUid: context != null ? context.uid : null,
      });
  }

  sendChangeTemplateMessage = (template: ParsingTemplate) => {
      chrome.runtime.sendMessage<ChangeTemplateMessage>({
          type: TYPE_CHANGE_TEMPLATE,
          template: template
      });
  }

  openSettingsWindow = () => {
      if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
      } else {
          window.open(chrome.runtime.getURL('options_page.html'));
      }
  }

  switchMenu = (showSettings: boolean) => {
      const settings = this.state.parseSettings.get();
      settings.showSettingsMenu = showSettings;

      this.setState({
          parseSettings: this.state.parseSettings.update(settings)
      });
  }

  downloadContexts = () => {
      const blob = new Blob([JSON.stringify(this.state.contexts.get())], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
          url: url,
          filename: "scraped_contexts.json"
      });
  }

  viewContext = (contex: ParsingContext|null) => {
      if(contex == null) {
        sendBasicNotification("No current context", "Current context must be set in order to view.");
        return;
      }

      chrome.windows.create({
          url: chrome.runtime.getURL("context-page.html")+"?contextId="+(contex.uid),
          type: "popup",
          width: 600,
          height: 1000
      });
  }

  _genSettingsOrTemplateComponent = (showSettings: boolean, template: ParsingTemplate) : JSX.Element => {
    if(showSettings) {
        return (
            <SettingsComponent
                sx={{
                    position: "absolute",
                    ...SETTINGS_POSITION
                }}
                previewData={this.state.parseSettings.get().previewData}
                moveToContext={this.state.parseSettings.get().moveToContext}
                autoContextSelect={this.state.parseSettings.get().autoContextSelect}
                iconClicked={() => this.switchMenu(false)}
                downloadButtonClicked={this.downloadContexts}
                viewContextButtonClicked={() => this.viewContext(this.state.currentContext.get())}
                previewDataChanged={(value) => {
                    const settings = this.state.parseSettings.get();
                    settings.previewData = value;
                    this.setState({
                        parseSettings: this.state.parseSettings.update(settings)
                    });
                }}
                moveToContextChanged={(value) => {
                    const settings = this.state.parseSettings.get();
                    settings.moveToContext = value;
                    this.setState({
                        parseSettings: this.state.parseSettings.update(settings)
                    });
                }}
                autoContextSelectChanged={(value) => {
                    const settings = this.state.parseSettings.get();
                    settings.autoContextSelect = value;
                    this.setState({
                        parseSettings: this.state.parseSettings.update(settings)
                    });
                }}
            />
        );
    }

    return (
        <TemplateViewerComponent
            sx={{
                position: "absolute",
                ...TEMPLATE_POSITION,
            }}
            currentTemplate={template}
            iconClicked={() => this.switchMenu(true)}
            validTemplates={this.state.validTemplates}
            templateChangedFunc={this.sendChangeTemplateMessage}
        />
    );
  }

  render() {
      const template = this.state.currentTemplate.get();
      // if(template == null || Object.values(this.state.validTemplates).length < 1 || Object.values(this.state.allTemplates.get()).length < 1) {
      if(template == null) {
          return (
              <Box>
                  <Typography>
                      Please add templates via the settings page in order to use this tool. Thank you.
                  </Typography>
                  <ButtonBlockComponent
                      sx={{}}
                      value={null}
                      onClick={this.openSettingsWindow}>
                      Open the options page
                  </ButtonBlockComponent>
              </Box>
          )
      }

      const previewData = this.state.previewingData.get();
      return (
        <Box sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#F6F6F6",
        }}>
          <CurrentContextViewerComponent
              sx={{
                position: "absolute",
                ...CURRENT_CONTEXT_VIEWER_POSITION,
              }}
              currentContext={this.state.currentContext.get()}
              contexts={this.state.contexts.get()}
              contextClicked={this.sendChangeContextMessage}
          />

          {previewData.length < 1 &&
              <ChangeContextComponent
                sx={{
                    position: "absolute",
                    ...CHANGE_CONTEXT_POSITION,
                }}
                currentContext={this.state.currentContext.get()}
                contexts={this.state.contexts.get()}
                changeContextCallback={this.sendChangeContextMessage}
              />
          }

            {previewData.length > 0 &&
                <ScrapedDataPreviewComponent
                    sx={{
                        position: "absolute",
                        ...CHANGE_CONTEXT_POSITION,
                    }}
                    previewData={previewData[0]}
                    templates={this.state.allTemplates.get()}
                    clearPreviewData={this.clearPreviewData}
                    getDataCallback={(func) => {
                        this.setState({
                            getPreviewDataFunc: func
                        })
                    }}
                />
            }

          {this._genSettingsOrTemplateComponent(this.state.parseSettings.get().showSettingsMenu, template)}

          <PaperButton
              sx={{
                  position: "absolute",
                  ...MAIN_BUTTON_POSITION,
                  ...MAIN_BUTTON_DIMENSIONS,
              }}
              hoverElevation={1}
              color={"#40385a"}
              hoverColor={"#524b6b"}
              clickColor={"#40385a"}
              textColor={"#f6f6f6"}
              onClick={previewData.length > 0 ? this.savePreviewedData : this.sendScrapeMessage}
          >
              {previewData.length > 0 ? "Save Data" : "Scrape Page"}
          </PaperButton>
        </Box>
    );
  }
}
