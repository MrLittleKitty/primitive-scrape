import React from 'react';
import {tab} from "@testing-library/user-event/dist/tab";
import {ScrapeMessage, TYPE_SCRAPE} from "./chrome/MessagePassing";


interface ExtensionPopupPageState {
}

export default class ExtensionPopupPage extends React.Component<any, ExtensionPopupPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  sendScrapeMessage = () => {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0].id != null) {
        const id = tabs[0].id;
        chrome.scripting.executeScript({
          target: {tabId: id, allFrames: true},
          files: ['content.js'],
        }, () => {
          chrome.tabs.sendMessage<ScrapeMessage>(id, {
            type: TYPE_SCRAPE
          });
        });
      }
    });
  }

  render() {
    return (
        <>
          <button onClick={this.sendScrapeMessage}>
            Scrape this page
          </button>
        </>
    );
  }
}
