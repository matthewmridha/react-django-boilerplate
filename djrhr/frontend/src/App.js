
import React, { useEffect, useContext, useState, useRef, Fragment } from "react";

//ROUTER
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  Redirect,
} from "react-router-dom";

//MATERIAL UI
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useTheme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//CONTEXT
import { ContextLibrary } from '.';

//COMPONENTS
import LogIn from './Login';
import SignUp from './Register';
import Unauthorized from './401';
import TransitionAlert from './Alert';
import Copyright from './CopyRight';
import Profile from './Profile';
import PasswordResetConfirm from "./PasswordResetConfirm";
import TransitionsModal from './Modal';
import SnackbarComponent from "./SnackBar";
import PasswordReset from './PasswordReset';
import Schools from './SchoolList.js';
import { LoadingSpinner } from './LoadingSpinner';
import SchoolDetail from "./SchoolDetail";

import PropTypes from 'prop-types';

//SCROLL TO TOP BUTTON FUNCTION
function ScrollTop( props ) {
	const { children, window } = props;
	const trigger = useScrollTrigger({
	  target: window ? window() : undefined,
	  disableHysteresis: true,
	  threshold: 100,
	});
  
	const handleClick = ( event ) => {
	const anchor = ( event.target.ownerDocument || document ).querySelector(
		'#back-to-top-anchor'
	);
  
	if (anchor) {
		anchor.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	  }
	};
  
	return (
	  <Zoom in={ trigger }>
		<Box
		  onClick={ handleClick }
		  role="presentation"
		  sx={{ position: 'fixed', bottom: 16, right: 16 }}
		>
		  { children }
		</Box>
	  </Zoom>
	);
};

//MAIN COMPONENT

export default function App({ props, children, ...rest }) {

  	const context = useContext( ContextLibrary );
	const [ username, setUsername ] = useState( "" );
	const [ loggedIn, setLoggedIn ] = useState( false );
	const [ open, setOpen ] = useState( false );
  	const anchorRef = useRef( null );
	
	useEffect(()=>{
		//UPDATE USERNAME IF AUTHENTICATED
		setUsername( context.data.user.username );
		setLoggedIn( context.data.user.loggedIn );
	}, [ context.data.user ]);

	//THEME
	const theme = useTheme();

	//APPBAR DROPDOWN
	const handleToggle = () => {
		setOpen( ( prevOpen ) => !prevOpen );
	};
		
	const handleClose = ( event ) => {
		if ( anchorRef.current && anchorRef.current.contains( event.target ) ) {
			return;
		}
		setOpen( false );
	};
		
	const handleListKeyDown = ( event ) => {
		if ( event.key === 'Tab' ) {
			event.preventDefault();
			setOpen( false );
		}
	};

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = useRef( open );
		  
	useEffect(() => {
		if ( prevOpen.current === true && open === false ) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [ open ]);

	return (
		<Fragment>
		<CssBaseline />
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="fixed" >
					<Toolbar>
						<IconButton
							size="large"
							edge="end"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 0 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							CampuX
						</Typography>
						<div>
							<IconButton
								size="large"
								ref={ anchorRef }
								aria-controls={ open ? 'menu-list-grow' : undefined }
								aria-haspopup="true"
								onClick={ handleToggle }
								color="inherit"
							>
							<AccountCircle />
							</IconButton>
							<Popper 
								open={ open } 
								anchorEl={ anchorRef.current } 
								role={ undefined } 
								transition 
								disablePortal
							>
								{({ TransitionProps, placement }) => (
									<Grow
										{ ...TransitionProps }
										style={{ 
											transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' 
										}}
									>
										<Paper>
											<ClickAwayListener onClickAway={ handleClose }>
												<MenuList 
													autoFocusItem={ open } 
													id="menu-list-grow" 
													onKeyDown={ handleListKeyDown }
												>
													{ loggedIn  ? 
														<div>
															<MenuItem>
																{ username }
															</MenuItem>
															<MenuItem >
																<Link 
																	style={{ textDecoration:'none' }} 
																	to={ "/profile/" } 
																	onClick={ handleClose }
																>
																	Profile
																</Link>
															</MenuItem>
															<MenuItem 
																onClick={ () => context.logout() }
															>
																Logout
																<ExitToAppIcon/>
															</MenuItem>
																</div> 
														: 
															<MenuItem>
																<Link 
																	style={{ textDecoration:'none' }} 
																	to={"/login/"} 
																	onClick = { handleClose }
																>
																	Login
																</Link>
															</MenuItem> }
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</div>
					</Toolbar>
  				</AppBar>
  			</Box>
			{/* TARGET FOR BACK TO TOP */}
  			<div id="back-to-top-anchor" ></div>
			<Container 
				maxWidth='xl' 
				spacing={ 0 }
				style={{ padding:"0px", minHeight:"100vh" }}
			>
				{/* A <Switch> looks through its children <Route>s and
				renders the first one that matches the current URL. */}

				<main style={{minHeight:'100vh', display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
					<LoadingSpinner />
					<TransitionAlert />
					<TransitionsModal />
      				<SnackbarComponent />	
					<Switch>
						<PublicRoute exact path="/schools/">
							<Schools />
						</PublicRoute>
						<PublicRoute exact path="/login/">
							<LogIn />
						</PublicRoute>
						<PublicRoute exact path="/register/">
							<SignUp />
						</PublicRoute>
      					<PublicRoute path='/school/:name'>
							<SchoolDetail />
						</PublicRoute>
						<Route exact path={"/password_reset"} component={PasswordReset}/>
						<PrivateRoute exact path="/password_reset">
							<PasswordReset />
						</PrivateRoute>
						<PrivateRoute path="/profile">
              				<Profile />
            			</PrivateRoute>
						<PublicRoute path="/reset-confirm/auth/rest-auth/password/reset/confirm/:uid/:token">
							<PasswordResetConfirm/>
						</PublicRoute>
						<Route exact path={"/401/"} component={Unauthorized}/>
						<Route exact path={"/"} render={() => <div>Home</div>}/>
						<Route path={"*"} component={NotFound} />
					</Switch>
				</main> 
				<footer style={{
					display:'flex', 
					justifyContent: 'center', 
					flexBasis:'50px'}}
				>
					<Box mt={8}>
						<Copyright />
					</Box>
				</footer>
			</Container>
			<ScrollTop {...props}>
        		<Fab color="primary" size="small" aria-label="scroll back to top">
          			<KeyboardArrowUpIcon />
        		</Fab>
      		</ScrollTop>
		</Fragment>
		
		
  	);
}

function Home() {
  return (
  <div>
	  <img src="https://edu-aws-bucket.s3.amazonaws.com/Deal_1-001_hczLm0c.jpg"/>
  <h2>Home</h2>
  </div>
  )
}


function NotFound() {
	return (
	<h2>Not found</h2>
	)
}

/// AUTHENTICATED USERS ONLY
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

/// AUTH NOT REQUIRED
function PublicRoute({ children, ...rest }) {
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