import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ExtensionPopupPage from './ExtensionPopupPage';
import "@fontsource/source-sans-pro/400.css"
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            "Source Sans Pro",
            "sans-serif"
        ].join(","),
        button: {
            textTransform: 'none'
        }
    }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
            <ExtensionPopupPage />
      </ThemeProvider>
  </React.StrictMode>
);