import React, { useState, useContext, useRef } from 'react';

//MATERIAL UI
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';

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

/// STYLES
const useStyles = makeStyles((theme) => ({
	
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
  	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},

}));

/// COMPONENT

export default function LogIn() {

	//ROUTER
	let history = useHistory();
  	let location = useLocation();

	//GLOBAL STATES
	const baseUrl = useContext(URLContext);
	const context = useContext(ContextLibrary);
	
	//STATE 
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isValid, setIsValid] = useState(false);	

	//STYLE
	const classes = useStyles();
	
	//HANDLE INPUT CHANGE
	const changeInput = (e, arg) => {
		//arg=setState hook eg: setEmail
		arg(e.target.value);
	};

	//PASSWORD SHOW/HIDE TOGGLE
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	  };
	
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	
	//LOGIN API CALL WITH EMAIL AND PASSWORD; 
	//REQUEST=>USERNAME(EMAIL), PASSWORD, RESPONSE=>ACCESS_TOKEN, REFRESH_TOKEN, PK, USERNAME

	const login = () => {
		/// REQUEST
		const url = `${baseUrl}/auth/dj-rest-auth/login/`;
		trackPromise(
			fetch(url, {
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
			.then(response => {

				/// NOT STATUS===200

				if (!response.ok) {
					context.toggleAlert("Wrong Email or Password", "error");
				}
				return(response.json());
			})
			.then(response => {

				/// SUCCESS

				if (response){

					//UPDATE USER 

					let currentUser = response.user;
					let token = response.access_token; 
					let decoded = jwt_decode(token);
					let access_token_expiry = Date(decoded.exp);
					let refresh = response.refresh_token;

					context.updateUser(currentUser, token, refresh, access_token_expiry);

					//REDIRECT IF ORIGINALLY REDIRECTED FROM RESTRICTED PAGE

					let { from } = location.state || { from: { pathname: "/" } };
					history.replace(from);
				}
				else {

					//FAILED LOGIN, REMOVE USER FROM LOCALSTORAGE
					
					context.updateUser();
				}
			})
			.catch(error => console.log(error))
		)
		
	};
	
	//LOGIN API CALL, CLEAR FORM
	const submitLoginForm = (e) => {
		e.preventDefault();
		login();
		setEmail("");
		setPassword("");
	};

	return (
		<Container component="main" maxWidth="xs">
		<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
				<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
				Sign in
				</Typography>
				<ValidatorForm className={classes.form} ref={useRef('form')}
					onSubmit={submitLoginForm}
					onError={errors => console.log(errors)} >
				<TextValidator
					variant="outlined"
					margin="dense"
					required
					fullWidth
					type="email"
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
					value={email}
					validators={['required', 'isEmail']}
					errorMessages={['this field is required', 'email is not valid']}
					onChange = {(e) => changeInput(e, setEmail)}
				/>
				<OutlinedInput
					variant="outlined"
					margin="dense"
					required
					fullWidth
					name="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					id="password"
					autoComplete="current-password"
					value = {password}
					onChange = {(e) => changeInput(e, setPassword)}
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
				<Button
					type="submit"
					onClick={submitLoginForm}
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				>
					Sign In
				</Button>
				<Grid container>
					<Grid item xs>
					<Link to="/password_reset" variant="body2">
						Forgot password?
					</Link>
					</Grid>
					<Grid item>
					<Link to="/register" variant="body2">
						{"Don't have an account? Sign Up"}
					</Link>
					</Grid>
				</Grid>
				</ValidatorForm>
			</div>
		</Container>
	);
}