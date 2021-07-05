import React, { useState, useContext, useEffect, Fragment, useRef } from 'react';
import { ContextLibrary, URLContext } from '.';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//MATERIAL UI
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { trackPromise } from 'react-promise-tracker';

//VALIDATES FORM
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

//VALIDATES INPUT TYPE
let validator = require('validator');

//ROUTER
import {
	useHistory,
	useLocation,
	Link
  } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

export default function Profile() {

    const baseUrl = useContext(URLContext);
    const context = useContext(ContextLibrary);
    const [password, setPassword] = useState("");
    const [new_password1, setNew_password1] = useState("");
    const [new_password2, setNew_password2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    //PASSWORD SHOW/HIDE TOGGLE
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
    const handleClickShowPassword1 = () => {
		setShowPassword1(!showPassword1);
	};
    const handleClickShowPassword2 = () => {
		setShowPassword2(!showPassword2);
	};
	
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

    const classes = useStyles();

    const [user, setUser] = useState("");

    const changeInput = (e, arg) => {
		///arg=setState hook eg: setEmail
		arg(e.target.value);
	};

    const getUserDetails = () => {
        const url = `${baseUrl}/auth/dj-rest-auth/user/`;
        fetch(url, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
				'Accept': 'application/json',
            },
        })
        .then(
            response => {
                if (!response.ok){
                    window.location.href = '/login/';
                    return;
                }
                else {
                    return response.json();
                }
            }
        ).then(
            response => {
                setUser(response);
        })
        .catch(error => console.log(error));
    };

    const ChangePassword = () => {
		/// REQUEST
		const url = `${baseUrl}/auth/dj-rest-auth/password/change/`;
		trackPromise(
			fetch(url, {
				method : "POST",
				timeout: 5000,
				headers : {
					"Content-Type" : "application/json",
					'Accept': 'application/json',
				},
				body : JSON.stringify({
					new_password1 : new_password1,
                    new_password2 : new_password2,
                    old_password : password
				})
			})
			.then(response => {

				/// NOT STATUS===200
                if (!response.ok) {
					context.toggleAlert(message=`Error . Failed to change Password.`, severity="error")
				}
				else{
                    context.openSnackbar("Your Password has been Successfully Changed. Please Sign in again")
                    context.logout();
                }
			})
			.catch(error => console.log(error))
		)
		
	};

    useEffect(() => {
        context.tokenValidOrRefresh();
        getUserDetails();
    }, []);

    const submitPasswordChange = (e) => {
        setPassword("");
        setNew_password1("");
        setNew_password2("");
        setShowPassword(false);
        setShowPassword1(false);
        setShowPassword2(false);
        ChangePassword();
    };


    return(
        <Fragment>
            <Container max-width="xs">
                <CssBaseline />
                <div className={classes.root}>
                    <div className={classes.paper}>
                    <Grid container spacing={3}>
                    <Typography component="h1" variant="h5">
				Profile
				</Typography>
                        {user ? 
                            <Grid container>
                                <Grid item xs={2}>
                                    email:
                                </Grid>
                                <Grid item xs={8}>
                                {user.email}
                                </Grid> 
                            </Grid>
                        : null}
                        <Grid container>
                        
				<ValidatorForm className={classes.form} ref={useRef('form')}
					onSubmit={submitPasswordChange}
					onError={errors => console.log(errors)} >
				
				<OutlinedInput
					variant="outlined"
					margin="dense"
					required
					fullWidth
					name="new_password1"
					label="New Password"
					type={showPassword1 ? 'text' : 'password'}
					id="new_password1"
					value = {new_password1}
					onChange = {(e) => changeInput(e, setNew_password1)}
					endAdornment={
						<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword1}
							onMouseDown={handleMouseDownPassword}
							edge="end"
						>
							{showPassword1 ? <Visibility /> : <VisibilityOff />}
						</IconButton>
						</InputAdornment>
					}
				/>
                <OutlinedInput
					variant="outlined"
					margin="dense"
					required
					fullWidth
					name="new_password2"
					label="Confirm New Password"
					type={showPassword2 ? 'text' : 'password'}
					id="new_password2"
					autoComplete="current-password"
					value = {new_password2}
					onChange = {(e) => changeInput(e, setNew_password2)}
					endAdornment={
						<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword2}
							onMouseDown={handleMouseDownPassword}
							edge="end"
						>
							{showPassword2 ? <Visibility /> : <VisibilityOff />}
						</IconButton>
						</InputAdornment>
					}
				/>
                <OutlinedInput
					variant="outlined"
					margin="dense"
					required
					fullWidth
					name="old_password"
					label="Current Password"
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
                        </Grid>
                        
                        
                    </Grid>
                    </div>
                </div>
            </Container>
        </Fragment>
    );
}