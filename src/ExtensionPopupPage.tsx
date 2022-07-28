import React from 'react';


interface ExtensionPopupPageState {
  confirmed: boolean | null
}

export interface ScrapeMessage {
  scrape: boolean
}

export interface ScrapeMessageResponse {
  confirmed: boolean
}

export default class ExtensionPopupPage extends React.Component<any, ExtensionPopupPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      confirmed: null,
    }
  }

  sendScrapeMessage = () => {
    const t = this
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0].id != null) {
        chrome.tabs.sendMessage<ScrapeMessage>(tabs[0].id, {scrape: true}, function (response: ScrapeMessageResponse) {
          t.setState({
            confirmed: response.confirmed
          })
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

          {this.state.confirmed != null &&
           <h1>{this.state.confirmed}!</h1>
          }
        </>
    );
  }
}
