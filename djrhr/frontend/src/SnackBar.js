import React, {useState, useContext, useEffect, Fragment} from 'react';

//MATERIAL UI
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ContextLibrary } from '.';

export default function SnackbarComponent() {

    const context = useContext(ContextLibrary);

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    useEffect(() => {
        setContent(context.data.snackbar.snackbarContent);
        setOpen(context.data.snackbar.openSnackbar);
    }, [context.data.snackbar.openSnackbar]);

  
  return (
    <div>
        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={()=>context.handleSnackbarClose()}
            message={content}
            action={
            <Fragment>
                <Button color="secondary" size="small" onClick={()=>context.handleSnackbarClose()}>
                UNDO
                </Button>
                <IconButton size="small" aria-label="close" color="inherit" onClick={()=>context.handleSnackbarClose()}>
                <CloseIcon fontSize="small" />
                </IconButton>
            </Fragment>
            }
        />
    </div>
  );
}