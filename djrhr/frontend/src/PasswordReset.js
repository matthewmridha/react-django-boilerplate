import React, { useState, useContext, Fragment, useRef } from 'react';
import { ContextLibrary, URLContext } from '.';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { trackPromise} from 'react-promise-tracker';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import {
	useHistory,
	useLocation,
	Link
  } from "react-router-dom";

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


export default function PasswordReset() {

    const classes = useStyles();

    const baseUrl = useContext(URLContext);
    const context = useContext(ContextLibrary);

    const [email, setEmail] = useState("");
    const [emailErrorText, setEmailErrorText] = React.useState("");

    const changeInput = (e, arg) => {
		///arg=setState hook eg: setEmail
		arg(e.target.value);
	};

    const requestPasswordReset = (e) => {
        e.preventDefault();
        if (!email || !validator.isEmail(email)) {
            setEmailErrorText("Please enter valid email");
          } else {
            setEmailErrorText("");
            const url = `${baseUrl}/auth/dj-rest-auth/password/reset/`;
            fetch(url, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                },
                body : JSON.stringify({
                    email : email
                })
            })
            .then(
                response => {
                    if (response.ok){
                        context.openSnackbar("an Email with a password reset link has been sent to the provided address.")
                    }
                }
            ).catch(error => console.log(error));
        };
    };

    return(
        <Fragment>
            <Container component="main" maxWidth="xs">
		    <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Reset Password
                    </Typography>
                    <ValidatorForm className={classes.form} ref={useRef('form')}
                        onSubmit={requestPasswordReset}
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
                        value = {email}
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                        error={!!emailErrorText}
                        helperText={emailErrorText}
                        onChange = {(e) => changeInput(e, setEmail)}
                    />
                    <Button
                        type="submit"
                        onClick={requestPasswordReset}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Reset Password
                    </Button>
                    <Grid container>
                        <Grid item>
                        <Link to="/login/" variant="body2">
                            {"Sign In"}
                        </Link>
                        </Grid>
                    </Grid>
                    </ValidatorForm>
                </div>
		    </Container>
        </Fragment>
    );
}