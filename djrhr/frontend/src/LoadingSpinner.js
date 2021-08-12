import React, { Component, useContext }from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import { MoonLoader } from 'react-spinners';
import { ContextLibrary } from '.';
import { useTheme } from '@material-ui/core/styles';

export const LoadingSpinner = (props) => {
    const { promiseInProgress } = usePromiseTracker();
    const theme = useTheme();
    return (
        <div>
            {
            (promiseInProgress === true) ?
                <div style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 100000000000
                    }}>
                    <MoonLoader color={theme.colors.primary} />
                </div>
            :
                null
            }
        </div>
    )
};