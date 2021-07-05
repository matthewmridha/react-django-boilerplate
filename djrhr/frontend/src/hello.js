import React, { useEffect, useState, useContext } from "react";
import { Fragment } from "react";
import { useCookies } from 'react-cookie';
import { URLContext } from ".";


export default function  Hello(props) {
    
    const [message, setMessage] = useState("hi");
    const baseUrl =  useContext(URLContext);
    const getMessage = () => {
        let endURL =  '/api/hello/';
        fetch(`${baseUrl + endURL}`, {
        method : "GET",
        timeout: 5000,
        headers : {
          "Content-Type" : "application/json",
          'Accept': 'application/json',
        },
        })
        .then(res => res.json())
        .then(res => {
            if (res.code === "token_not_valid"){
                window.location.href = '/login/';
                
            }
            else {
                setMessage(res.message);
            }
        })
        .catch(err => console.log(err));
    };

    useEffect(()=>{
        getMessage();
    }, []);

    

    return (
            <Fragment>
                <div> {message} </div>
            </Fragment>
        )
    
}

