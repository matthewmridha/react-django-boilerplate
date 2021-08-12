import React, { useState, useEffect, createContext } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import "regenerator-runtime/runtime";

//MATERIAL UI
import { createTheme, ThemeProvider, styled } from '@material-ui/core/styles';

//EXPORT CONTEXT
export const URLContext = createContext('');
export const ContextLibrary = createContext('');

//IMPORT COMPONENT TO RENDER
import App from './App';


//<------------------THEME---------------------->
const theme = createTheme({
    colors : {
        primary: '#264653',
        secondaryCool: '#2a9d8f',
        neutral: 'e9c46a',
        primaryWarm: '#f4a261',
        secondaryWarm: '#e76f51',
        danger : '#e76f51',
    },
    spinnerSize: '70px',
    surface : {
        padding : "25px",
        margin : "25px"
    }
    
});

// development mode or production mode
const dev = true;
let baseUrl = dev === true ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000';

const Index = ( props ) => {

    const defaultAlertSeverity = 'info';
    const defaultAlertMessage = '';
    const defaultUsername = "Guest";

    const [state, setState] = useState({
        user : {
            user : null,
            username : defaultUsername,
            loggedIn : false,
        },

        alert : {
            message : defaultAlertMessage,
            severity : defaultAlertSeverity, //error\\warning\\info\\success
            showAlert : false
        },

        modal : {
            showModal : false,
            modalContent : "",
            modalHeader : ""
        },

        snackbar : {
            openSnackbar : false,
            snackbarContent : ""
        },

    });

    //CHECK FOR CREDENTIALS IN LOCAL STORAGE AND UPDATE USER. || SAVE NEW USER IN LOCAL STORAGE. && SET USERNAME WITH NAME OR EMAIL
    //REMOVES USER TOKENS FROM LOCAL STORAGE IF PASSED WITH CUREENTUSER=NULL
    const updateUser = ( currentUser=null, access_token="", refresh_token="", access_token_expiry="" ) => {
        if( currentUser ){
            let username;
            if ( currentUser.first_name && currentUser.last_name ){
                username = currentUser.first_name + " " + currentUser.last_name;
            }
            else{
                username = currentUser.email;
            }
            setState({ ...state, user : {
                user : currentUser,
                username : username,
                loggedIn : true,
                
            }});
            currentUser.access_token=access_token;
            currentUser.refresh_token=refresh_token;
            currentUser.token_exp=Date.parse( access_token_expiry );
            localStorage.setItem( 'user', JSON.stringify(currentUser) );
        } else {
            setState({ ...state, user : {
                user : null,
                username : "Guest",
                loggedIn : false,
            }});
            localStorage.removeItem('user');
        }
    };

    const logout = () => {
        const url = baseUrl + `/auth/dj-rest-auth/logout/`;
		fetch(url, {
			method : "POST",
			timeout: 5000,
			headers : {
				"Content-Type" : "application/json",
				'Accept': 'application/json',
			},
		})
		.then(response => {
			if (!response.ok) {
				throw new Error("HTTP status " + response.status);
			}
			localStorage.clear();
			updateUser();
			return;
		})
		.catch(err => console.log(err));
  	};


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    //CHECK IF TOKEN IN LOCAL STORAGE, IF TOKEN EXISTS, CHECK EXPIRY, IF TOKEN IS VALID, RETURN ELSE REFRESH TOKEN.
    const tokenValidOrRefresh =  () => {
        const currentUser = localStorage.getItem('user');
        if (currentUser){
            const token_exp = JSON.parse(currentUser).token_exp;
            const time_now = Date.now();
            if(time_now > token_exp){
                refreshToken();
            }
            else{
                return;
            }
        }
        else{
            updateUser();
            return;
        }
    };

    const refreshToken = async () => {
        const url = `${baseUrl}/auth/dj-rest-auth/token/refresh/`;
        fetch(url, {
            method : "POST",
            timeout: 5000,
            headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
            },
        }).then(response => {
            if (!response.ok){
                updateUser();
                window.location.href = '/login/';
                return response;
            }
            else{
                return response.json();
            }
        }).then( response => {
            let user = JSON.parse(localStorage.getItem('user'));
            user.access_token = response.access || null;
            user.token_exp = Date.parse(response.access_token_expiration);
            localStorage.setItem('user', JSON.stringify(user));
        }).catch(error => console.log(error));
    };

    //ALERT COMPONENT sSHOW||HIDE. ARGS=message(string), severity(string, options=error\\warning\\info\\success)
    const toggleAlert = (message='', severity=state.alert.severity) => {
        setState({...state, alert : {
            message : message,
            severity : severity,
            showAlert : !state.alert.showAlert,
        }});
	};

    //MODAL COMPONENT SHOW||HIDE. ARGS=header(string), content(string)
    const toggleModal = (header="", content="") => {
        setState({...state, modal : {
            modalHeader : header,
            modalContent : content,
            showModal : !state.modal.showModal
        }});
    };

    //SNACKBAR COMPONENT SHOW. ARGS=content(string)
    const openSnackbar = (content="") => {
        setState({...state, snackbar : {
            openSnackbar : true,
            snackbarContent : content
        }});
      };
    
    //SNACKBAR COMPONENT HIDE.
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({...state, snackbar : {
            openSnackbar : false,
            snackbarContent : ""
        }});
        
    };

    useEffect(()=>{
        tokenValidOrRefresh();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if( currentUser ) {
            const user = currentUser;
            
            setState({...state, user : {
                user : user,
                username : user.email,
                loggedIn : true
            }});

        }
    }, []);

    return(
        <CookiesProvider>
        <ThemeProvider theme={theme}>
        <URLContext.Provider value={baseUrl}>
        <ContextLibrary.Provider value={{ 
            data : state, 
            logout : logout,
            updateUser : updateUser,
            toggleAlert : toggleAlert,
            tokenValidOrRefresh : tokenValidOrRefresh,
            toggleModal : toggleModal,
            openSnackbar : openSnackbar,
            handleSnackbarClose : handleSnackbarClose,
        }}>
        <BrowserRouter>
            <App  />
        </BrowserRouter>
        </ContextLibrary.Provider>
        </URLContext.Provider>
        </ThemeProvider>
        </CookiesProvider>
    )
}

render((
   <Index /> 
), document.getElementById('root'));
