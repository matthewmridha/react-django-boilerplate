import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { ContextLibrary } from '.';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
		marginTop: theme.spacing(2),
		},
	},
}));

export default function TransitionAlert() {
    const globalState = useContext(ContextLibrary);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");

    useEffect(()=>{
        setMessage(globalState.data.alert.message);
        setSeverity(globalState.data.alert.severity);
        setOpen(globalState.data.alert.showAlert);
        
    }, [globalState.data.alert.showAlert]);

  return (
    <div className={classes.root}>
		<Collapse in={open}>
			<Alert
				variant="outlined"
				severity={severity} ///string=error||warning||info||success
				action={
				<IconButton
				aria-label="close"
				color="inherit"
				size="small"
				onClick={() => {
					globalState.toggleAlert();
				}}
				>
				<CloseIcon fontSize="inherit" />
				</IconButton>
			}
			>
			{message}
			</Alert>
		</Collapse>
    </div>
  );
};