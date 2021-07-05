import React, { Component, useContext }from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import { MoonLoader } from 'react-spinners';
import { ContextLibrary } from '.';

export const LoadingSpinner = (props) => {
    const theme =  useContext(ContextLibrary);
    const { promiseInProgress } = usePromiseTracker();

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
                    zIndex: "100000000000"
                    }}>
                    <MoonLoader color={theme.data.theme.loaderColor} />
                </div>
            :
                null
            }
        </div>
    )
};