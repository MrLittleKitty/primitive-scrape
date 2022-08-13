import React from 'react';
import {Box} from "@mui/material";

interface OptionsPageState {

}

export default class OptionsPage extends React.Component<any, OptionsPageState> {

    constructor(props: any) {
        super(props);
    }

    render() {

        return (
            <Box sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#F6F6F6",
            }}>
                Hello and welcome to the test options page!
            </Box>
        );
    }
}
