
import React, {useEffect, useContext, useState, useRef, Fragment} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  Redirect,
  useLocation, 
  NavLink
} from "react-router-dom";

import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import LogIn from './Login';
import SignUp from './Register';
import Unauthorized from './401';
import { ContextLibrary } from '.';
import { URLContext } from '.';
import TransitionAlert from './Alert';
import Copyright from './CopyRight';
import Profile from './Profile';
import PasswordResetConfirm from "./PasswordResetConfirm";
import TransitionsModal from './Modal';
import SnackbarComponent from "./SnackBar";

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PasswordReset from "./PasswordReset";
import { LoadingSpinner } from './LoadingSpinner';

const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	  justifySelf : 'flex-end',
	},
	paper: {
	  marginRight: theme.spacing(2),
	},
  }));
  


export default function App({ children, ...rest }) {

  	const context = useContext(ContextLibrary);
	const [username, setUsername] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);
	
	const classes = useStyles();
  	const [open, setOpen] = useState(false);
  	const anchorRef = useRef(null);
	
	useEffect(()=>{
		setUsername(context.data.user.username);
		setLoggedIn(context.data.user.loggedIn);
	}, [context.data.user]);

  	
	// MENUBAR DROPDOWN
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
		
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};
		
	const handleListKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	};
		
	// return focus to the button when we transitioned from !open -> open
	const prevOpen = useRef(open);
		  
	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [open]);

	return (
      	<Fragment>
			<CssBaseline>
				<Container 
					maxWidth='xl' 
					style={{
						width:'100vw', 
						minHeight:'100vh', 
						display:'flex', 
						flexDirection: 'column', 
						padding:'0px'
					}}
				>
					<nav 
						style={{
							display:'flex', 
							justifyContent:'space-between'
						}}
					>
						<NavLink className={"nav-link"} to={"/"} activeStyle={{fontWeight: "bold", color: "red"}}>Home</NavLink>
						<div>
							<div className={classes.root}>
								<Button
									ref={anchorRef}
									aria-controls={open ? 'menu-list-grow' : undefined}
									aria-haspopup="true"
									onClick={handleToggle}
								>
									<AccountCircleRoundedIcon />
									{username}
									
								</Button>
								<Popper 
									open={open} 
									anchorEl={anchorRef.current} 
									role={undefined} 
									transition 
									disablePortal>
									{({ TransitionProps, placement }) => (
										<Grow
											{...TransitionProps}
											style={{ 
												transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' 
											}}
										>
											<Paper>
												<ClickAwayListener onClickAway={handleClose}>
												<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
													{loggedIn  ? 
														<div>
															<MenuItem >
																<Link style={{textDecoration:'none'}} to={"/profile/"} onClick={handleClose}>
																	Profile
																</Link>
															</MenuItem>
															<MenuItem onClick={()=>context.logout()}>Logout<ExitToAppIcon/></MenuItem>
														</div> 
														: 
														<MenuItem>
															<Link style={{textDecoration:'none'}} to={"/login/"} onClick={handleClose}>Login</Link>
														</MenuItem> }
												</MenuList>
												</ClickAwayListener>
											</Paper>
										</Grow>
									)}
								</Popper>
							</div>
						</div>
					</nav>
					{/* A <Switch> looks through its children <Route>s and
						renders the first one that matches the current URL. */}
					<main style={{
						justifyContent: 'center', 
						flex:'1'}}
						>
						<LoadingSpinner />
						<TransitionAlert />
						<TransitionsModal />
						<Switch>
							<NoAuthRoute exact path="/login/">
								<LogIn />
							</NoAuthRoute>
							<NoAuthRoute exact path="/register/">
								<SignUp />
							</NoAuthRoute>
							<Route exact path={"/password_reset"} component={PasswordReset}/>
							<PrivateRoute exact path="/password_reset">
								<PasswordReset />
							</PrivateRoute>
							<PrivateRoute path="/profile">
              					<Profile />
            				</PrivateRoute>
							<NoAuthRoute path="/reset-confirm/auth/rest-auth/password/reset/confirm/:uid/:token">
								<PasswordResetConfirm/>
							</NoAuthRoute>
							<Route exact path={"/401/"} component={Unauthorized}/>
							<Route exact path={"/"} render={() => <div>Home</div>}/>
							<Route path={"*"} component={NotFound} />
						</Switch>
						<SnackbarComponent />
					</main> 
					<footer style={{
						display:'flex', 
						justifyContent: 'center', 
						flexBasis:'50px'}}>
						<Box mt={8}>
							<Copyright />
						</Box>
					</footer>
				</Container>
			</CssBaseline>
		</Fragment>
  );
}

function Home() {
  return <h2>Home</h2>;
}


function NotFound() {
	return (
	<h2>Not found</h2>
	)
}

/// For logged in users only
function PrivateRoute({ children, ...rest }) {
	let auth = useContext(ContextLibrary).data.user.loggedIn;
	return (
	  	<Route
			{...rest}
			render={({ location }) =>
		  		auth ? (
				children
		  	) : (
				<Redirect
			  		to={{
						pathname: "/login",
						state: { from: location }
			  		}}
				/>
		  	)}
	  	/>
	);
};

/// For not  logged in users only
function NoAuthRoute({ children, ...rest }) {
	let auth = useContext(ContextLibrary).data.user.loggedIn;
	return (
	  	<Route
			{...rest}
			render={({ location }) =>
		  	!auth ? (
				children
		  	) : (
				<Redirect
			  		to={{
						pathname: "/",
					state: { from: location }
			  		}}
				/>
		  	)}
	  	/>
	);
};