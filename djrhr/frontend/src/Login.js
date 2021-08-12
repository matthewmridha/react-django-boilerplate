import React, { Fragment, useState, useContext, useRef } from 'react';

//MATERIAL UI
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Paper } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { FormHelperText } from '@material-ui/core';



//VALIDATES FORM
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

//VALIDATES INPUT TYPE
let validator = require('validator');

//PROMISE TRACKER - LOADING SPINNER
import { trackPromise} from 'react-promise-tracker';

//DECODE RESPONSE JWT
import jwt_decode from "jwt-decode";

//ROUTER
import {
	useHistory,
	useLocation,
	Link
  } from "react-router-dom";

/// IMPORT GLOBAL VARIABLES
import { ContextLibrary, URLContext } from '.';

/// COMPONENT

export default function LogIn() {

	const theme = useTheme();

	//ROUTER
	let history = useHistory();
  	let location = useLocation();

	//GLOBAL STATES
	const baseUrl = useContext(URLContext);
	const context = useContext(ContextLibrary);
	
	//STATE 
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ showPassword, setShowPassword ] = useState( false );
	const [ emailHelperText, setEmailHelperText ] = useState( '' );	
	const [ emailError, setEmailError ] = useState( false );
	const [ passwordError, setPasswordError ] = useState( false );
	const [ passwordHelperText, setPasswordHelperText ] = useState( '' );
		
	//HANDLE INPUT CHANGE
	const changeInput = ( e, arg ) => {
		//arg=setState hook eg: setEmail
		arg( e.target.value );
	};

	//PASSWORD SHOW/HIDE TOGGLE
	const handleClickShowPassword = () => {
		setShowPassword( !showPassword );
	};
	
	const handleMouseDownPassword = ( event ) => {
		event.preventDefault();
	};

	//LOGIN API CALL WITH EMAIL AND PASSWORD; 
	//REQUEST=>USERNAME(EMAIL), PASSWORD, RESPONSE=>ACCESS_TOKEN, REFRESH_TOKEN, PK, USERNAME

	const login = () => {
		const url = `${ baseUrl }/auth/dj-rest-auth/login/`;
		trackPromise(
			fetch( url, {
				method : "POST",
				timeout: 5000,
				headers : {
					"Content-Type" : "application/json",
					'Accept': 'application/json',
				},
				body : JSON.stringify({
					email: email,
					password: password
				})
			})
			.then( response => {
				// NOT STATUS===200
				if ( !response.ok ) {
					context.toggleAlert( "Incorrect Email or Password", "error" );
				}
				return(response.json());
			})
			.then( response => {
				// SUCCESS
				if ( response ){
					//UPDATE USER 
					let currentUser = response.user;
					let token = response.access_token; 
					let decoded = jwt_decode( token );
					let access_token_expiry = Date( decoded.exp );
					let refresh = response.refresh_token;

					context.updateUser( currentUser, token, refresh, access_token_expiry );

					//REDIRECT IF ORIGINALLY REDIRECTED FROM RESTRICTED PAGE
					let { from } = location.state || { from: { pathname: "/" } };
					history.replace( from );
				}
				else {
					//FAILED LOGIN, REMOVE STORED USER IF ANY
					context.updateUser();
				}
			})
			.catch(error => console.log(error))
		);
		
	};
	
	//LOGIN API CALL, CLEAR FORM
	const submitLoginForm = ( e ) => {
		e.preventDefault();
		if( password.length <= 1 ) {
			setPasswordError( true );
			setPasswordHelperText( "*Password Required" );
			return 1;
		}
		else if( email.length <=6 || !validator.isEmail( email ) ) {
			setEmailHelperText( "Valid Email Required" );
			setEmailError( true );
			return 1;
		}
		else{
			setPasswordError( false );
			setPasswordHelperText( "" );
			setEmailHelperText( "" );
			setEmailError( false );
			login();
			setEmail( "" );
			setPassword( "" );
		}
	};

	
	return (
		<Fragment>
			<Container maxWidth="xs">
			<Paper elevation={ 5 } style={{ padding: theme.surface.padding }}>
				<Grid container spacing={ 2 }>
					<Grid item xs={ 12 } style={{ display : "flex", justifyContent : "center", alignItems : "center", flexDirection : "column" }}>
						<Avatar style={{ backgroundColor : theme.colors.danger }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
					</Grid>
				</Grid>
					<Divider variant="middle" style={{ margin: theme.surface.margin }}/>
				<Grid container spacing={ 2 }>
					<Grid item xs={ 12 }>
						<form 
							onSubmit={ submitLoginForm }
							onError={ errors => console.log( errors ) }
						>
							<Grid container spacing={ 2 }>
								<Grid item xs={ 12 }>
									<FormControl fullWidth variant="outlined">
									<InputLabel htmlFor="outlined-email">Email</InputLabel>
										<OutlinedInput
											variant="outlined"
											margin="dense"
											required
											type="email"
											id="email"
											label="Email Address"
											name="email"
											autoComplete="email"
											autoFocus
											value={email}
											error={emailError}
											onChange = {(e) => changeInput(e, setEmail)}
										/>
										<FormHelperText><span style={{color: 'red'}}>{emailHelperText}</span></FormHelperText>
									</FormControl>
									
								</Grid>
								<Grid item xs={12}>
									<FormControl fullWidth variant="outlined">
										<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
										<OutlinedInput
											id="outlined-adornment-password"
											type={showPassword ? 'text' : 'password'}
											value = {password}
											label="Password"
											onChange = {(e) => changeInput(e, setPassword)}
											required
											error = { passwordError }
											helperText="Incorrect entry."
											endAdornment={
											<InputAdornment position="end">
												<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
												>
												{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
											}
										/>
										<FormHelperText><span style={{color: 'red'}}>{passwordHelperText}</span></FormHelperText>
        							</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button
										type="submit"
										onClick={submitLoginForm}
										fullWidth
										variant="contained"
										size="large"
										style={{backgroundColor:theme.colors.primary}}
										
									>
											Sign In
									</Button>
								</Grid>
							</Grid>
						</form>
					</Grid>
					<Grid item xs={6}>
						<Link to="/password_reset" variant="body2">
							Forgot password?
						</Link>
					</Grid>
					<Grid item xs={6} style={{textAlign:"right"}}>
						<Link to="/register" variant="body2" >
							{"Sign Up"}
						</Link>
					</Grid>
				</Grid>
			</Paper>
			</Container>
		</Fragment>
	);
}