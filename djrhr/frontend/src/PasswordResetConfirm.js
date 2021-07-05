import React, { useState, useContext, Fragment } from 'react';
import { ContextLibrary, URLContext } from '.';
import {
    useParams
  } from "react-router-dom";

export default function PasswordResetConfirm(props) {

    const baseUrl = useContext(URLContext);
    const stateLibrary = useContext(ContextLibrary);

    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    let {uid , token}= useParams();

    const changeInput = (e, arg) => {
		///arg=setState hook eg: setEmail
		arg(e.target.value);
	};

    const submitNewPassword = (e) => {
        e.preventDefault();
        const url = `${baseUrl}/auth/rest-auth/password/reset/confirm/${uid}/${token}/`;
        fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
				'Accept': 'application/json',
            },
            body : JSON.stringify({
                new_password1 : newPassword1,
                new_password2 : newPassword2,
                uid : uid,
                token : token
            })
        })
        .then(
            response => console.log(response)
        ).catch(error => console.log(error));
    };

    return(
        <Fragment>
            <h1>Set new Password</h1>
            <form onSubmit={submitNewPassword}>
                
                <input type="password" value={newPassword1} onChange={(e) => changeInput(e, setNewPassword1)} required />
                <input type="password" value={newPassword2} onChange={(e) => changeInput(e, setNewPassword2)} required />
                <input type="submit" value="submit"/>
            </form>
            
            
        </Fragment>
    );
}