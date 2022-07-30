import React from "react";
import {SxProps, Theme} from "@mui/material";

interface ScrapedDataPreviewComponentProps {
    sx: SxProps<Theme>
}

interface ScrapedDataPreviewComponentState {

}

export default class ScrapedDataPreviewComponent extends React.Component<ScrapedDataPreviewComponentProps, ScrapedDataPreviewComponentState> {

    constructor(props: ScrapedDataPreviewComponentProps) {
        super(props);
    }

    render() {
        return (
            <>
            </>
        )
    }
}