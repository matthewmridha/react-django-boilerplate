import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { ContextLibrary } from '.';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function TransitionsModal() {
    const context =  useContext(ContextLibrary);
    const classes = useStyles();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    
    useEffect(() => {
        setModalOpen(context.data.modal.showModal);
        setModalHeader(context.data.modal.modalHeader);
        setModalContent(context.data.modal.modalContent);
    }, [context.data.modal.showModal]);

  
	return (
		<div>
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={modalOpen}
			onClose={()=>context.toggleModal()}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
			timeout: 500,
			}}
		>
			<Fade in={modalOpen}>
			<div className={classes.paper}>
				<h2 id="transition-modal-title">{modalHeader}</h2>
				<p id="transition-modal-description">{modalContent}</p>
			</div>
			</Fade>
		</Modal>
		</div>
  	);
}
